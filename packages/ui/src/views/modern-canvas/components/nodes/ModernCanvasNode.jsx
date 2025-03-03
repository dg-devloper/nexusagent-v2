import PropTypes from 'prop-types'
import { useContext, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import { useTheme } from '@mui/material/styles'
import { IconButton, Box, Typography, Divider, Button } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'

// project imports
import ModernNodeCardWrapper from '../base/ModernNodeCardWrapper'
import ModernNodeTooltip from '../base/ModernNodeTooltip'
import ModernNodeInput from './ModernNodeInput'
import ModernNodeOutput from './ModernNodeOutput'
import ModernAdditionalParamsDialog from '../dialogs/ModernAdditionalParamsDialog'
import ModernNodeInfoDialog from '../dialogs/ModernNodeInfoDialog'
import { flowContext } from '@/store/context/ReactFlowContext'
import { themeVariables } from '../../config'

// const
import { baseURL } from '@/store/constant'
import { IconTrash, IconCopy, IconInfoCircle, IconAlertTriangle, IconTransferIn, IconTransferOut } from '@tabler/icons-react'
import LlamaindexPNG from '@/assets/images/llamaindex.png'

const ModernCanvasNode = ({ data }) => {
    const theme = useTheme()
    const canvas = useSelector((state) => state.canvas)
    const { deleteNode, duplicateNode } = useContext(flowContext)

    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [showInfoDialog, setShowInfoDialog] = useState(false)
    const [infoDialogProps, setInfoDialogProps] = useState({})
    const [warningMessage, setWarningMessage] = useState('')
    const [open, setOpen] = useState(false)
    const [isForceCloseNodeInfo, setIsForceCloseNodeInfo] = useState(null)

    const handleClose = () => setOpen(false)
    const handleOpen = () => setOpen(true)

    const getNodeInfoOpenStatus = () => {
        if (isForceCloseNodeInfo) return false
        return !canvas.canvasDialogShow && open
    }

    const nodeOutdatedMessage = (oldVersion, newVersion) => 
        `Node version ${oldVersion} outdated\nUpdate to latest version ${newVersion}`

    const nodeVersionEmptyMessage = (newVersion) => 
        `Node outdated\nUpdate to latest version ${newVersion}`

    const onDialogClicked = () => {
        setDialogProps({
            data,
            inputParams: data.inputParams.filter((inputParam) => !inputParam.hidden).filter((param) => param.additionalParams),
            confirmButtonName: 'Save',
            cancelButtonName: 'Cancel'
        })
        setShowDialog(true)
    }

    useEffect(() => {
        const componentNode = canvas.componentNodes.find((nd) => nd.name === data.name)
        if (componentNode) {
            if (!data.version) {
                setWarningMessage(nodeVersionEmptyMessage(componentNode.version))
            } else if (data.version && componentNode.version > data.version) {
                setWarningMessage(nodeOutdatedMessage(data.version, componentNode.version))
            } else if (componentNode.badge === 'DEPRECATING') {
                setWarningMessage(
                    componentNode?.deprecateMessage ??
                    'This node will be deprecated in the next release. Change to a new node tagged with NEW'
                )
            } else {
                setWarningMessage('')
            }
        }
    }, [canvas.componentNodes, data.name, data.version])

    return (
        <>
            <ModernNodeCardWrapper
                selected={data.selected}
                className="modern-canvas-node"
            >
                <ModernNodeTooltip
                    open={getNodeInfoOpenStatus()}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    disableFocusListener={true}
                    title={
                        <div className="modern-node-actions">
                            <IconButton
                                title="Duplicate"
                                onClick={() => duplicateNode(data.id)}
                                className="modern-node-action-btn"
                            >
                                <IconCopy />
                            </IconButton>
                            <IconButton
                                title="Delete"
                                onClick={() => deleteNode(data.id)}
                                className="modern-node-action-btn modern-node-action-btn-delete"
                            >
                                <IconTrash />
                            </IconButton>
                            <IconButton
                                title="Info"
                                onClick={() => {
                                    setInfoDialogProps({ data })
                                    setShowInfoDialog(true)
                                }}
                                className="modern-node-action-btn"
                            >
                                <IconInfoCircle />
                            </IconButton>
                        </div>
                    }
                    placement="right-start"
                >
                    <Box className="modern-node-content">
                        {/* Header */}
                        <div className="modern-node-header">
                            <Box className="modern-node-icon">
                                <div className="modern-node-icon-wrapper">
                                    <img
                                        src={`${baseURL}/api/v1/node-icon/${data.name}`}
                                        alt={data.label}
                                    />
                                </div>
                            </Box>
                            <Box className="modern-node-title">
                                <Typography variant="h6">
                                    {data.label}
                                </Typography>
                            </Box>
                            <div className="modern-node-badges">
                                {data.tags && data.tags.includes('LlamaIndex') && (
                                    <div className="modern-node-badge">
                                        <img src={LlamaindexPNG} alt="LlamaIndex" />
                                    </div>
                                )}
                                {warningMessage && (
                                    <Tooltip title={warningMessage} placement="top">
                                        <IconButton className="modern-node-warning">
                                            <IconAlertTriangle />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </div>
                        </div>

                        {/* Input Section */}
                        {(data.inputAnchors.length > 0 || data.inputParams.length > 0) && (
                            <>
                                <Divider />
                                <Box className="modern-node-section-header">
                                    <Typography variant="subtitle1">
                                        <IconTransferIn color="green" />
                                        Inputs
                                    </Typography>
                                </Box>
                                <Divider />
                                <div className="modern-node-inputs">
                                    {data.inputAnchors.map((inputAnchor, index) => (
                                        <ModernNodeInput
                                            key={index}
                                            inputAnchor={inputAnchor}
                                            data={data}
                                        />
                                    ))}
                                    {data.inputParams
                                        .filter((inputParam) => !inputParam.hidden)
                                        .map((inputParam, index) => (
                                            <ModernNodeInput
                                                key={index}
                                                inputParam={inputParam}
                                                data={data}
                                                onHideNodeInfoDialog={(status) => {
                                                    setIsForceCloseNodeInfo(status ? true : null)
                                                }}
                                            />
                                        ))}
                                </div>
                            </>
                        )}

                        {/* Additional Parameters */}
                        {data.inputParams.find((param) => param.additionalParams) && (
                            <div className="modern-node-additional-params">
                                <Button
                                    className="modern-node-additional-params-btn"
                                    variant="outlined"
                                    onClick={onDialogClicked}
                                >
                                    Additional Parameters
                                </Button>
                            </div>
                        )}

                        {/* Output Section */}
                        {data.outputAnchors.length > 0 && (
                            <>
                                <Divider />
                                <Box className="modern-node-section-header">
                                    <Typography variant="subtitle1">
                                        <IconTransferOut color="red" />
                                        Output
                                    </Typography>
                                </Box>
                                <Divider />
                                <div className="modern-node-outputs">
                                    {data.outputAnchors.map((outputAnchor, index) => (
                                        <ModernNodeOutput
                                            key={index}
                                            outputAnchor={outputAnchor}
                                            data={data}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </Box>
                </ModernNodeTooltip>
            </ModernNodeCardWrapper>

            {/* Dialogs */}
            <ModernAdditionalParamsDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
            />
            <ModernNodeInfoDialog
                show={showInfoDialog}
                dialogProps={infoDialogProps}
                onCancel={() => setShowInfoDialog(false)}
            />
        </>
    )
}

ModernCanvasNode.propTypes = {
    data: PropTypes.object
}

export default ModernCanvasNode