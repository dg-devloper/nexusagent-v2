import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Avatar, Box, ButtonBase, Typography, Stack, TextField, Button } from '@mui/material'

// icons
import { IconSettings, IconChevronLeft, IconDeviceFloppy, IconPencil, IconCheck, IconX, IconCode } from '@tabler/icons-react'

// project imports
import Settings from '@/views/settings'
import SaveChatflowDialog from '@/ui-component/dialog/SaveChatflowDialog'
import APICodeDialog from '@/views/chatflows/APICodeDialog'
import ViewMessagesDialog from '@/ui-component/dialog/ViewMessagesDialog'
import ChatflowConfigurationDialog from '@/ui-component/dialog/ChatflowConfigurationDialog'
import UpsertHistoryDialog from '@/views/vectorstore/UpsertHistoryDialog'
import ViewLeadsDialog from '@/ui-component/dialog/ViewLeadsDialog'
import ExportAsTemplateDialog from '@/ui-component/dialog/ExportAsTemplateDialog'

// API
import chatflowsApi from '@/api/chatflows'

// Hooks
import useApi from '@/hooks/useApi'

// utils
import { generateExportFlowData } from '@/utils/genericHelper'
import { uiBaseURL } from '@/store/constant'
import { closeSnackbar as closeSnackbarAction, enqueueSnackbar as enqueueSnackbarAction, SET_CHATFLOW } from '@/store/actions'

const ModernCanvasHeader = ({ chatflow, isAgentCanvas, handleSaveFlow, handleDeleteFlow, handleLoadFlow }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const flowNameRef = useRef()
    const settingsRef = useRef()

    // State
    const [isEditingFlowName, setEditingFlowName] = useState(null)
    const [flowName, setFlowName] = useState('')
    const [isSettingsOpen, setSettingsOpen] = useState(false)
    const [flowDialogOpen, setFlowDialogOpen] = useState(false)
    const [apiDialogOpen, setAPIDialogOpen] = useState(false)
    const [apiDialogProps, setAPIDialogProps] = useState({})
    const [viewMessagesDialogOpen, setViewMessagesDialogOpen] = useState(false)
    const [viewMessagesDialogProps, setViewMessagesDialogProps] = useState({})
    const [viewLeadsDialogOpen, setViewLeadsDialogOpen] = useState(false)
    const [viewLeadsDialogProps, setViewLeadsDialogProps] = useState({})
    const [upsertHistoryDialogOpen, setUpsertHistoryDialogOpen] = useState(false)
    const [upsertHistoryDialogProps, setUpsertHistoryDialogProps] = useState({})
    const [chatflowConfigurationDialogOpen, setChatflowConfigurationDialogOpen] = useState(false)
    const [chatflowConfigurationDialogProps, setChatflowConfigurationDialogProps] = useState({})
    const [exportAsTemplateDialogOpen, setExportAsTemplateDialogOpen] = useState(false)
    const [exportAsTemplateDialogProps, setExportAsTemplateDialogProps] = useState({})

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const title = isAgentCanvas ? 'Agents' : 'Chatflow'
    const updateChatflowApi = useApi(chatflowsApi.updateChatflow)
    const canvas = useSelector((state) => state.canvas)

    const onSettingsItemClick = (setting) => {
        setSettingsOpen(false)

        if (setting === 'deleteChatflow') {
            handleDeleteFlow()
        } else if (setting === 'viewMessages') {
            setViewMessagesDialogProps({
                title: 'View Messages',
                chatflow: chatflow
            })
            setViewMessagesDialogOpen(true)
        } else if (setting === 'viewLeads') {
            setViewLeadsDialogProps({
                title: 'View Leads',
                chatflow: chatflow
            })
            setViewLeadsDialogOpen(true)
        } else if (setting === 'saveAsTemplate') {
            if (canvas.isDirty) {
                enqueueSnackbar({
                    message: 'Please save the flow before exporting as template',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        action: (key) => (
                            <Button className='modern-snackbar-btn' onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                return
            }
            setExportAsTemplateDialogProps({
                title: 'Export As Template',
                chatflow: chatflow
            })
            setExportAsTemplateDialogOpen(true)
        } else if (setting === 'viewUpsertHistory') {
            setUpsertHistoryDialogProps({
                title: 'View Upsert History',
                chatflow: chatflow
            })
            setUpsertHistoryDialogOpen(true)
        } else if (setting === 'chatflowConfiguration') {
            setChatflowConfigurationDialogProps({
                title: `${title} Configuration`,
                chatflow: chatflow
            })
            setChatflowConfigurationDialogOpen(true)
        } else if (setting === 'duplicateChatflow') {
            try {
                let flowData = chatflow.flowData
                const parsedFlowData = JSON.parse(flowData)
                flowData = JSON.stringify(parsedFlowData)
                localStorage.setItem('duplicatedFlowData', flowData)
                window.open(`${uiBaseURL}/${isAgentCanvas ? 'agentcanvas' : 'canvas'}`, '_blank')
            } catch (e) {
                console.error(e)
            }
        } else if (setting === 'exportChatflow') {
            try {
                const flowData = JSON.parse(chatflow.flowData)
                let dataStr = JSON.stringify(generateExportFlowData(flowData), null, 2)
                const blob = new Blob([dataStr], { type: 'application/json' })
                const dataUri = URL.createObjectURL(blob)
                let exportFileDefaultName = `${chatflow.name} ${title}.json`
                let linkElement = document.createElement('a')
                linkElement.setAttribute('href', dataUri)
                linkElement.setAttribute('download', exportFileDefaultName)
                linkElement.click()
            } catch (e) {
                console.error(e)
            }
        }
    }

    const onUploadFile = (file) => {
        setSettingsOpen(false)
        handleLoadFlow(file)
    }

    const submitFlowName = () => {
        if (chatflow.id) {
            const updateBody = {
                name: flowNameRef.current.value
            }
            updateChatflowApi.request(chatflow.id, updateBody)
        }
    }

    const onAPIDialogClick = () => {
        let isFormDataRequired = false
        let isSessionMemory = false

        try {
            const flowData = JSON.parse(chatflow.flowData)
            const nodes = flowData.nodes

            // Check if file type exists
            for (const node of nodes) {
                if (node.data.inputParams.find((param) => param.type === 'file')) {
                    isFormDataRequired = true
                    break
                }
            }

            // Check if sessionId memory exists
            for (const node of nodes) {
                if (node.data.inputParams.find((param) => param.name === 'sessionId')) {
                    isSessionMemory = true
                    break
                }
            }
        } catch (e) {
            console.error(e)
        }

        setAPIDialogProps({
            title: 'Embed in website or use as API',
            chatflowid: chatflow.id,
            chatflowApiKeyId: chatflow.apikeyid,
            isFormDataRequired,
            isSessionMemory,
            isAgentCanvas
        })
        setAPIDialogOpen(true)
    }

    const onSaveChatflowClick = () => {
        if (chatflow.id) handleSaveFlow(flowName)
        else setFlowDialogOpen(true)
    }

    const onConfirmSaveName = (flowName) => {
        setFlowDialogOpen(false)
        handleSaveFlow(flowName)
    }

    useEffect(() => {
        if (updateChatflowApi.data) {
            setFlowName(updateChatflowApi.data.name)
            dispatch({ type: SET_CHATFLOW, chatflow: updateChatflowApi.data })
        }
        setEditingFlowName(false)
    }, [updateChatflowApi.data, dispatch])

    useEffect(() => {
        if (chatflow) {
            setFlowName(chatflow.name)
            if (chatflowConfigurationDialogOpen) {
                setChatflowConfigurationDialogProps({
                    title: `${title} Configuration`,
                    chatflow
                })
            }
        }
    }, [chatflow, title, chatflowConfigurationDialogOpen])

    return (
        <>
            <Stack flexDirection='row' justifyContent='space-between' className='modern-canvas-header'>
                <Stack flexDirection='row' className='modern-canvas-header-left'>
                    <Box>
                        <ButtonBase title='Back' className='modern-canvas-header-back-btn'>
                            <Avatar
                                variant='rounded'
                                className='modern-canvas-header-avatar'
                                onClick={() =>
                                    window.history.state && window.history.state.idx > 0 ? navigate(-1) : navigate('/', { replace: true })
                                }
                            >
                                <IconChevronLeft />
                            </Avatar>
                        </ButtonBase>
                    </Box>
                    <Box className='modern-canvas-header-title'>
                        {!isEditingFlowName ? (
                            <Stack flexDirection='row' alignItems='center'>
                                <Typography variant='h5'>
                                    {canvas.isDirty && <span className='modern-canvas-header-dirty'>*</span>} {flowName}
                                </Typography>
                                {chatflow?.id && (
                                    <ButtonBase
                                        title='Edit Name'
                                        className='modern-canvas-header-edit-btn'
                                        onClick={() => setEditingFlowName(true)}
                                    >
                                        <IconPencil />
                                    </ButtonBase>
                                )}
                            </Stack>
                        ) : (
                            <Stack flexDirection='row' alignItems='center'>
                                <TextField
                                    size='small'
                                    inputRef={flowNameRef}
                                    className='modern-canvas-header-input'
                                    defaultValue={flowName}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') submitFlowName()
                                        else if (e.key === 'Escape') setEditingFlowName(false)
                                    }}
                                />
                                <ButtonBase title='Save Name' className='modern-canvas-header-save-btn' onClick={submitFlowName}>
                                    <IconCheck />
                                </ButtonBase>
                                <ButtonBase
                                    title='Cancel'
                                    className='modern-canvas-header-cancel-btn'
                                    onClick={() => setEditingFlowName(false)}
                                >
                                    <IconX />
                                </ButtonBase>
                            </Stack>
                        )}
                    </Box>
                </Stack>
                <Box className='modern-canvas-header-actions'>
                    {chatflow?.id && (
                        <ButtonBase title='API Endpoint' className='modern-canvas-header-api-btn' onClick={onAPIDialogClick}>
                            <IconCode />
                        </ButtonBase>
                    )}
                    <ButtonBase title={`Save ${title}`} className='modern-canvas-header-save-flow-btn' onClick={onSaveChatflowClick}>
                        <IconDeviceFloppy />
                    </ButtonBase>
                    <ButtonBase
                        ref={settingsRef}
                        title='Settings'
                        className='modern-canvas-header-settings-btn'
                        onClick={() => setSettingsOpen(!isSettingsOpen)}
                    >
                        <IconSettings />
                    </ButtonBase>
                </Box>
            </Stack>

            {/* Dialogs */}
            <Settings
                chatflow={chatflow}
                isSettingsOpen={isSettingsOpen}
                anchorEl={settingsRef.current}
                onClose={() => setSettingsOpen(false)}
                onSettingsItemClick={onSettingsItemClick}
                onUploadFile={onUploadFile}
                isAgentCanvas={isAgentCanvas}
            />
            <SaveChatflowDialog
                show={flowDialogOpen}
                dialogProps={{
                    title: `Save New ${title}`,
                    confirmButtonName: 'Save',
                    cancelButtonName: 'Cancel'
                }}
                onCancel={() => setFlowDialogOpen(false)}
                onConfirm={onConfirmSaveName}
            />
            {apiDialogOpen && <APICodeDialog show={apiDialogOpen} dialogProps={apiDialogProps} onCancel={() => setAPIDialogOpen(false)} />}
            <ViewMessagesDialog
                show={viewMessagesDialogOpen}
                dialogProps={viewMessagesDialogProps}
                onCancel={() => setViewMessagesDialogOpen(false)}
            />
            <ViewLeadsDialog show={viewLeadsDialogOpen} dialogProps={viewLeadsDialogProps} onCancel={() => setViewLeadsDialogOpen(false)} />
            {exportAsTemplateDialogOpen && (
                <ExportAsTemplateDialog
                    show={exportAsTemplateDialogOpen}
                    dialogProps={exportAsTemplateDialogProps}
                    onCancel={() => setExportAsTemplateDialogOpen(false)}
                />
            )}
            <UpsertHistoryDialog
                show={upsertHistoryDialogOpen}
                dialogProps={upsertHistoryDialogProps}
                onCancel={() => setUpsertHistoryDialogOpen(false)}
            />
            <ChatflowConfigurationDialog
                key='chatflowConfiguration'
                show={chatflowConfigurationDialogOpen}
                dialogProps={chatflowConfigurationDialogProps}
                onCancel={() => setChatflowConfigurationDialogOpen(false)}
            />
        </>
    )
}

ModernCanvasHeader.propTypes = {
    chatflow: PropTypes.object,
    handleSaveFlow: PropTypes.func,
    handleDeleteFlow: PropTypes.func,
    handleLoadFlow: PropTypes.func,
    isAgentCanvas: PropTypes.bool
}

export default ModernCanvasHeader
