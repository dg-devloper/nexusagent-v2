import { useEffect, useRef, useState, useCallback, useContext } from 'react'
import ReactFlow, { addEdge, Controls, Background, MarkerType, applyNodeChanges, applyEdgeChanges } from 'reactflow'
import 'reactflow/dist/style.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    REMOVE_DIRTY,
    SET_DIRTY,
    SET_CHATFLOW,
    enqueueSnackbar as enqueueSnackbarAction,
    closeSnackbar as closeSnackbarAction,
    SET_MENU
} from '@/store/actions'
import { cloneDeep } from 'lodash'

// material-ui
import { Box, Button, Fab, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import CanvasNode from './CanvasNode'
import ButtonEdge from './ButtonEdge'
import StickyNote from './StickyNote'
import AddNodes from './AddNodes'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import { ChatPopUp } from '@/views/chatmessage/ChatPopUp'
import { VectorStorePopUp } from '@/views/vectorstore/VectorStorePopUp'
import { flowContext } from '@/store/context/ReactFlowContext'
import CanvasSubHeader from './CanvasSubHeader'
import Sidebar from '@/layout/MinimalLayout/Sidebar'
import FilledLoadingEdge from './animation/FilledLoadingEdge'

// API
import nodesApi from '@/api/nodes'
import chatflowsApi from '@/api/chatflows'

// Hooks
import useApi from '@/hooks/useApi'
import useConfirm from '@/hooks/useConfirm'

// icons
import { IconX, IconRefreshAlert } from '@tabler/icons-react'

// utils
import {
    getUniqueNodeId,
    initNode,
    rearrangeToolsOrdering,
    getUpsertDetails,
    updateOutdatedNodeData,
    updateOutdatedNodeEdge
} from '@/utils/genericHelper'
import useNotifier from '@/utils/useNotifier'
import { usePrompt } from '@/utils/usePrompt'

// const

const nodeTypes = { customNode: CanvasNode, stickyNote: StickyNote }
const edgeTypes = { buttonedge: ButtonEdge, filledLoadingEdge: FilledLoadingEdge }

// ==============================|| CANVAS ||============================== //

const Canvas = () => {
    const theme = useTheme()
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'))

    const navigate = useNavigate()

    const { state } = useLocation()
    const templateFlowData = state ? state.templateFlowData : ''

    const URLpath = document.location.pathname.toString().split('/')
    const chatflowId =
        URLpath[URLpath.length - 1] === 'canvas' || URLpath[URLpath.length - 1] === 'agentcanvas' ? '' : URLpath[URLpath.length - 1]
    const isAgentCanvas = URLpath.includes('agentcanvas') ? true : false
    const canvasTitle = URLpath.includes('agentcanvas') ? 'Agent' : 'Chatflow'

    const { confirm } = useConfirm()

    const dispatch = useDispatch()
    const canvas = useSelector((state) => state.canvas)
    const [canvasDataStore, setCanvasDataStore] = useState(canvas)
    const [chatflow, setChatflow] = useState(null)
    const { reactFlowInstance, setReactFlowInstance } = useContext(flowContext)

    // ==============================|| Snackbar ||============================== //

    useNotifier()
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    // ==============================|| ReactFlow ||============================== //

    const [nodes, setNodes] = useState([])
    const [edges, setEdges] = useState([])

    const [selectedNode, setSelectedNode] = useState(null)
    const [isUpsertButtonEnabled, setIsUpsertButtonEnabled] = useState(false)
    const [isSyncNodesButtonEnabled, setIsSyncNodesButtonEnabled] = useState(false)

    const reactFlowWrapper = useRef(null)

    // Debounce flowData updates
    const updateFlowDebounceRef = useRef(null)
    const updateFlowData = useCallback(
        (newNodes, newEdges) => {
            if (updateFlowDebounceRef.current) {
                clearTimeout(updateFlowDebounceRef.current)
            }
            updateFlowDebounceRef.current = setTimeout(() => {
                dispatch({
                    type: SET_CHATFLOW,
                    chatflow: {
                        ...canvas.chatflow,
                        flowData: JSON.stringify({ nodes: newNodes, edges: newEdges })
                    }
                })
            }, 500)
        },
        [dispatch, canvas.chatflow]
    )

    // Update nodes and edges with flowData changes
    const onNodesChange = useCallback(
        (changes) => {
            setNodes((nds) => {
                const newNodes = applyNodeChanges(changes, nds)
                if (newNodes !== nds) {
                    updateFlowData(newNodes, edges)
                }
                return newNodes
            })
        },
        [edges, updateFlowData]
    )

    const onEdgesChange = useCallback(
        (changes) => {
            setEdges((eds) => {
                const newEdges = applyEdgeChanges(changes, eds)
                if (newEdges !== eds) {
                    updateFlowData(nodes, newEdges)
                }
                return newEdges
            })
        },
        [nodes, updateFlowData]
    )

    // ==============================|| Chatflow API ||============================== //

    const getNodesApi = useApi(nodesApi.getAllNodes)
    const createNewChatflowApi = useApi(chatflowsApi.createNewChatflow)
    const updateChatflowApi = useApi(chatflowsApi.updateChatflow)
    const getSpecificChatflowApi = useApi(chatflowsApi.getSpecificChatflow)

    // ==============================|| Events & Actions ||============================== //

    const onConnect = useCallback(
        (params) => {
            const newEdge = {
                ...params,
                type: 'buttonedge',
                markerEnd: {
                    type: MarkerType.Arrow,
                    width: 15,
                    height: 15
                },
                id: `${params.source}-${params.sourceHandle}-${params.target}-${params.targetHandle}`
            }

            const targetNodeId = params.targetHandle.split('-')[0]
            const sourceNodeId = params.sourceHandle.split('-')[0]
            const targetInput = params.targetHandle.split('-')[2]

            setNodes((nds) => {
                const newNodes = nds.map((node) => {
                    if (node.id === targetNodeId) {
                        let value
                        const inputAnchor = node.data.inputAnchors.find((ancr) => ancr.name === targetInput)
                        const inputParam = node.data.inputParams.find((param) => param.name === targetInput)

                        if (inputAnchor && inputAnchor.list) {
                            const newValues = node.data.inputs[targetInput] || []
                            if (targetInput === 'tools') {
                                rearrangeToolsOrdering(newValues, sourceNodeId)
                            } else {
                                newValues.push(`{{${sourceNodeId}.data.instance}}`)
                            }
                            value = newValues
                        } else if (inputParam && inputParam.acceptVariable) {
                            value = node.data.inputs[targetInput] || ''
                        } else {
                            value = `{{${sourceNodeId}.data.instance}}`
                        }
                        node.data = {
                            ...node.data,
                            inputs: {
                                ...node.data.inputs,
                                [targetInput]: value
                            }
                        }
                    }
                    return node
                })

                updateFlowData(newNodes, [...edges, newEdge])
                return newNodes
            })

            setEdges((eds) => addEdge(newEdge, eds))
            setDirty()
        },
        [edges, updateFlowData]
    )

    const handleLoadFlow = (file) => {
        try {
            const flowData = JSON.parse(file)
            const nodes = flowData.nodes || []

            setNodes(nodes)
            setEdges(flowData.edges || [])
            setDirty()
        } catch (e) {
            console.error(e)
        }
    }

    const onNodeClick = useCallback((event, clickedNode) => {
        setSelectedNode(clickedNode)
        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                data: {
                    ...node.data,
                    selected: node.id === clickedNode.id
                }
            }))
        )
    }, [])

    const onDragOver = useCallback((event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(
        (event) => {
            event.preventDefault()
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
            let nodeData = event.dataTransfer.getData('application/reactflow')

            // check if the dropped element is valid
            if (typeof nodeData === 'undefined' || !nodeData) {
                return
            }

            nodeData = JSON.parse(nodeData)

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left - 100,
                y: event.clientY - reactFlowBounds.top - 50
            })

            const newNodeId = getUniqueNodeId(nodeData, reactFlowInstance.getNodes())

            const newNode = {
                id: newNodeId,
                position,
                type: nodeData.type !== 'StickyNote' ? 'customNode' : 'stickyNote',
                data: initNode(nodeData, newNodeId)
            }

            setSelectedNode(newNode)
            setNodes((nds) => {
                const newNodes = nds.concat({
                    ...newNode,
                    data: {
                        ...newNode.data,
                        selected: true
                    }
                })
                updateFlowData(newNodes, edges)
                return newNodes
            })
            setDirty()
        },
        [reactFlowInstance, edges, updateFlowData]
    )

    const syncNodes = () => {
        const componentNodes = canvas.componentNodes

        const cloneNodes = cloneDeep(nodes)
        const cloneEdges = cloneDeep(edges)
        let toBeRemovedEdges = []

        for (let i = 0; i < cloneNodes.length; i++) {
            const node = cloneNodes[i]
            const componentNode = componentNodes.find((cn) => cn.name === node.data.name)
            if (componentNode && componentNode.version > node.data.version) {
                const clonedComponentNode = cloneDeep(componentNode)
                cloneNodes[i].data = updateOutdatedNodeData(clonedComponentNode, node.data)
                toBeRemovedEdges.push(...updateOutdatedNodeEdge(cloneNodes[i].data, cloneEdges))
            }
        }

        setNodes(cloneNodes)
        setEdges(cloneEdges.filter((edge) => !toBeRemovedEdges.includes(edge)))
        setDirty()
        setIsSyncNodesButtonEnabled(false)
    }

    const saveChatflowSuccess = () => {
        dispatch({ type: REMOVE_DIRTY })
        enqueueSnackbar({
            message: `${canvasTitle} saved`,
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
                action: (key) => (
                    <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                        <IconX />
                    </Button>
                )
            }
        })
    }

    const errorFailed = (message) => {
        enqueueSnackbar({
            message,
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'error',
                persist: true,
                action: (key) => (
                    <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                        <IconX />
                    </Button>
                )
            }
        })
    }

    const setDirty = () => {
        dispatch({ type: SET_DIRTY })
    }

    const checkIfUpsertAvailable = (nodes, edges) => {
        const upsertNodeDetails = getUpsertDetails(nodes, edges)
        if (upsertNodeDetails.length) setIsUpsertButtonEnabled(true)
        else setIsUpsertButtonEnabled(false)
    }

    const checkIfSyncNodesAvailable = (nodes) => {
        const componentNodes = canvas.componentNodes

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i]
            const componentNode = componentNodes.find((cn) => cn.name === node.data.name)
            if (componentNode && componentNode.version > node.data.version) {
                setIsSyncNodesButtonEnabled(true)
                return
            }
        }

        setIsSyncNodesButtonEnabled(false)
    }

    const leftDrawerOpened = useSelector((state) => state.customization.opened)
    const handleLeftDrawerToggle = () => {
        dispatch({ type: SET_MENU, opened: !leftDrawerOpened })
    }

    // ==============================|| useEffect ||============================== //

    // Get specific chatflow successful
    useEffect(() => {
        if (getSpecificChatflowApi.data) {
            const chatflow = getSpecificChatflowApi.data
            const initialFlow = chatflow.flowData ? JSON.parse(chatflow.flowData) : []
            setNodes(initialFlow.nodes || [])
            setEdges(initialFlow.edges || [])
            dispatch({ type: SET_CHATFLOW, chatflow })
        } else if (getSpecificChatflowApi.error) {
            errorFailed(`Failed to retrieve ${canvasTitle}: ${getSpecificChatflowApi.error.response.data.message}`)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificChatflowApi.data, getSpecificChatflowApi.error])

    // Create new chatflow successful
    useEffect(() => {
        if (createNewChatflowApi.data) {
            const chatflow = createNewChatflowApi.data
            dispatch({ type: SET_CHATFLOW, chatflow })
            saveChatflowSuccess()
            window.history.replaceState(state, null, `/${isAgentCanvas ? 'agentcanvas' : 'canvas'}/${chatflow.id}`)
        } else if (createNewChatflowApi.error) {
            errorFailed(`Failed to save ${canvasTitle}: ${createNewChatflowApi.error.response.data.message}`)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createNewChatflowApi.data, createNewChatflowApi.error])

    // Update chatflow successful
    useEffect(() => {
        if (updateChatflowApi.data) {
            dispatch({ type: SET_CHATFLOW, chatflow: updateChatflowApi.data })
            saveChatflowSuccess()
        } else if (updateChatflowApi.error) {
            errorFailed(`Failed to save ${canvasTitle}: ${updateChatflowApi.error.response.data.message}`)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateChatflowApi.data, updateChatflowApi.error])

    useEffect(() => {
        setChatflow(canvasDataStore.chatflow)
        if (canvasDataStore.chatflow) {
            const flowData = canvasDataStore.chatflow.flowData ? JSON.parse(canvasDataStore.chatflow.flowData) : []
            checkIfUpsertAvailable(flowData.nodes || [], flowData.edges || [])
            checkIfSyncNodesAvailable(flowData.nodes || [])
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasDataStore.chatflow])

    // Initialization
    useEffect(() => {
        setIsSyncNodesButtonEnabled(false)
        setIsUpsertButtonEnabled(false)
        if (chatflowId) {
            getSpecificChatflowApi.request(chatflowId)
        } else {
            if (localStorage.getItem('duplicatedFlowData')) {
                handleLoadFlow(localStorage.getItem('duplicatedFlowData'))
                setTimeout(() => localStorage.removeItem('duplicatedFlowData'), 0)
            } else {
                setNodes([])
                setEdges([])
            }
            dispatch({
                type: SET_CHATFLOW,
                chatflow: {
                    name: `Untitled ${canvasTitle}`,
                    flowData: JSON.stringify({ nodes: [], edges: [] })
                }
            })
        }

        getNodesApi.request()

        // Clear dirty state before leaving and remove any ongoing test triggers and webhooks
        return () => {
            if (updateFlowDebounceRef.current) {
                clearTimeout(updateFlowDebounceRef.current)
            }
            setTimeout(() => dispatch({ type: REMOVE_DIRTY }), 0)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setCanvasDataStore(canvas)
    }, [canvas])

    useEffect(() => {
        function handlePaste(e) {
            const pasteData = e.clipboardData.getData('text')
            //TODO: prevent paste event when input focused, temporary fix: catch chatflow syntax
            if (pasteData.includes('{"nodes":[') && pasteData.includes('],"edges":[')) {
                handleLoadFlow(pasteData)
            }
        }

        window.addEventListener('paste', handlePaste)

        return () => {
            window.removeEventListener('paste', handlePaste)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (templateFlowData && templateFlowData.includes('"nodes":[') && templateFlowData.includes('],"edges":[')) {
            handleLoadFlow(templateFlowData)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateFlowData])

    usePrompt('You have unsaved changes! Do you want to navigate away?', canvasDataStore.isDirty)

    return (
        <>
            <Box sx={{ height: '100%' }}>
                <Box sx={{ height: '100%', width: '100%', display: 'flex' }}>
                    <Sidebar
                        drawerOpen={leftDrawerOpened}
                        drawerToggle={handleLeftDrawerToggle}
                        isAgentCanvas={isAgentCanvas}
                        nodesData={getNodesApi.data}
                        node={selectedNode}
                    />

                    <div className='reactflow-parent-wrapper'>
                        <div className='reactflow-wrapper' ref={reactFlowWrapper}>
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onNodeClick={onNodeClick}
                                onEdgesChange={onEdgesChange}
                                onDrop={onDrop}
                                onDragOver={onDragOver}
                                onNodeDragStop={setDirty}
                                nodeTypes={nodeTypes}
                                edgeTypes={edgeTypes}
                                onConnect={onConnect}
                                onInit={setReactFlowInstance}
                                fitView
                                fitViewOptions={{ padding: 0.5 }}
                                deleteKeyCode={canvas.canvasDialogShow ? null : ['Delete']}
                                minZoom={0.1}
                                className='chatflow-canvas'
                            >
                                <Controls
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                />
                                <Background color='#aaa' gap={16} />
                                {matchDownMd && <AddNodes isAgentCanvas={isAgentCanvas} nodesData={getNodesApi.data} node={selectedNode} />}
                                {isSyncNodesButtonEnabled && (
                                    <Fab
                                        sx={{
                                            left: 40,
                                            top: 20,
                                            color: 'white',
                                            background: 'orange',
                                            '&:hover': {
                                                background: 'orange',
                                                backgroundImage: `linear-gradient(rgb(0 0 0/10%) 0 0)`
                                            }
                                        }}
                                        size='small'
                                        aria-label='sync'
                                        title='Sync Nodes'
                                        onClick={() => syncNodes()}
                                    >
                                        <IconRefreshAlert />
                                    </Fab>
                                )}
                                {isUpsertButtonEnabled && <VectorStorePopUp chatflowid={chatflowId} />}
                                <CanvasSubHeader chatflow={chatflow} isAgentCanvas={isAgentCanvas} />
                                <ChatPopUp isAgentCanvas={isAgentCanvas} chatflowid={chatflowId} />
                            </ReactFlow>
                        </div>
                    </div>
                </Box>
                <ConfirmDialog />
            </Box>
        </>
    )
}

export default Canvas
