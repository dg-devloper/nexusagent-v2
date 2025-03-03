import PropTypes from 'prop-types'
import { useContext, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import { useTheme } from '@mui/material/styles'
import { IconButton, Box, Typography, Divider, Button } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'

// project imports
import NodeCardWrapper from '@/ui-component/cards/NodeCardWrapper'
import NodeTooltip from '@/ui-component/tooltip/NodeTooltip'
import NodeInputHandler from './NodeInputHandler'
import NodeOutputHandler from './NodeOutputHandler'
import AdditionalParamsDialog from '@/ui-component/dialog/AdditionalParamsDialog'
import NodeInfoDialog from '@/ui-component/dialog/NodeInfoDialog'

// const
import { baseURL } from '@/store/constant'
import { IconTrash, IconCopy, IconInfoCircle, IconAlertTriangle } from '@tabler/icons-react'
import { flowContext } from '@/store/context/ReactFlowContext'
import LlamaindexPNG from '@/assets/images/llamaindex.png'
import { IconTransferIn } from '@tabler/icons-react'
import { IconTransferOut } from '@tabler/icons-react'

// ===========================|| MODERN CANVAS NODE ||=========================== //

const ModernCanvasNode = ({ data }) => {
    const theme = useTheme()
    const canvas = useSelector((state) => state.canvas)
    const { deleteNode, duplicateNode } = useContext(flowContext)
    const isDarkMode = theme.palette.mode === 'dark'

    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [showInfoDialog, setShowInfoDialog] = useState(false)
    const [infoDialogProps, setInfoDialogProps] = useState({})
    const [warningMessage, setWarningMessage] = useState('')
    const [open, setOpen] = useState(false)
    const [isForceCloseNodeInfo, setIsForceCloseNodeInfo] = useState(null)
    const [isHovered, setIsHovered] = useState(false)

    const handleClose = () => setOpen(false)
    const handleOpen = () => setOpen(true)
    const getNodeInfoOpenStatus = () => isForceCloseNodeInfo ? false : !canvas.canvasDialogShow && open

    const nodeOutdatedMessage = (oldVersion, newVersion) => `Node version ${oldVersion} outdated\nUpdate to latest version ${newVersion}`
    const nodeVersionEmptyMessage = (newVersion) => `Node outdated\nUpdate to latest version ${newVersion}`

    const onDialogClicked = () => {
        const dialogProps = {
            data,
            inputParams: data.inputParams.filter((inputParam) => !inputParam.hidden).filter((param) => param.additionalParams),
            confirmButtonName: 'Save',
            cancelButtonName: 'Cancel'
        }
        setDialogProps(dialogProps)
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
            <NodeCardWrapper
                content={false}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
                    padding: 0,
                    borderRadius: '12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: isDarkMode ? theme.palette.background.paper : '#ffffff',
                    boxShadow: isHovered 
                        ? isDarkMode 
                            ? '0 8px 32px rgba(0, 0, 0, 0.35), 0 0 2px rgba(255, 255, 255, 0.1)' 
                            : '0 8px 32px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)'
                        : isDarkMode
                            ? '0 4px 20px rgba(0, 0, 0, 0.25), 0 0 2px rgba(255, 255, 255, 0.05)'
                            : '0 4px 20px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.05)',
                    transform: isHovered ? 'translateY(-2px)' : 'none',
                    borderColor: data.selected ? theme.palette.primary.main : 'transparent',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '12px',
                        border: '2px solid transparent',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                    }
                }}
                border={false}
            >
                <NodeTooltip
                    open={getNodeInfoOpenStatus()}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    disableFocusListener={true}
                    title={
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            gap: 1,
                            p: 1
                        }}>
                            <IconButton
                                title='Duplicate'
                                onClick={() => duplicateNode(data.id)}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: theme.palette.primary.main,
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                <IconCopy size={20} />
                            </IconButton>
                            <IconButton
                                title='Delete'
                                onClick={() => deleteNode(data.id)}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: theme.palette.error.main,
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                <IconTrash size={20} />
                            </IconButton>
                            <IconButton
                                title='Info'
                                onClick={() => {
                                    setInfoDialogProps({ data })
                                    setShowInfoDialog(true)
                                }}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: theme.palette.info.main,
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                <IconInfoCircle size={20} />
                            </IconButton>
                        </Box>
                    }
                    placement='right'
                >
                    <Box>
                        <Box sx={{ 
                            p: 2, 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '10px',
                                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '8px',
                                    transition: 'all 0.3s ease',
                                    transform: isHovered ? 'scale(1.05)' : 'none'
                                }}
                            >
                                <img
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    src={`${baseURL}/api/v1/node-icon/${data.name}`}
                                    alt={data.label}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        fontSize: '0.95rem', 
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                        lineHeight: 1.2,
                                        transition: 'color 0.3s ease',
                                        '&:hover': {
                                            color: theme.palette.primary.main
                                        }
                                    }}
                                >
                                    {data.label}
                                </Typography>
                            </Box>
                            {data.tags && data.tags.includes('LlamaIndex') && (
                                <Box
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        transform: isHovered ? 'scale(1.1)' : 'none'
                                    }}
                                >
                                    <img
                                        src={LlamaindexPNG}
                                        alt='LlamaIndex'
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </Box>
                            )}
                            {warningMessage && (
                                <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{warningMessage}</span>} placement='top'>
                                    <IconButton 
                                        size="small"
                                        sx={{
                                            transition: 'all 0.3s ease',
                                            transform: isHovered ? 'scale(1.1)' : 'none'
                                        }}
                                    >
                                        <IconAlertTriangle size={20} color={theme.palette.warning.main} />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>

                        {(data.inputAnchors.length > 0 || data.inputParams.length > 0) && (
                            <>
                                <Divider sx={{ opacity: 0.6 }} />
                                <Box sx={{ p: 1.5 }}>
                                    <Typography
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: theme.palette.success.main,
                                            transition: 'all 0.3s ease',
                                            transform: isHovered ? 'translateX(4px)' : 'none'
                                        }}
                                    >
                                        <IconTransferIn size={18} />
                                        Inputs
                                    </Typography>
                                </Box>
                                <Divider sx={{ opacity: 0.6 }} />
                            </>
                        )}

                        {data.inputAnchors.map((inputAnchor, index) => (
                            <NodeInputHandler key={index} inputAnchor={inputAnchor} data={data} />
                        ))}

                        {data.inputParams
                            .filter((inputParam) => !inputParam.hidden)
                            .map((inputParam, index) => (
                                <NodeInputHandler
                                    key={index}
                                    inputParam={inputParam}
                                    data={data}
                                    onHideNodeInfoDialog={(status) => {
                                        setIsForceCloseNodeInfo(status ? true : null)
                                    }}
                                />
                            ))}

                        {data.inputParams.find((param) => param.additionalParams) && (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                <Button
                                    onClick={onDialogClicked}
                                    sx={{
                                        borderRadius: '12px',
                                        width: '90%',
                                        p: '10px 16px',
                                        backgroundColor: theme.palette.primary.main,
                                        color: '#fff',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.dark,
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                                        }
                                    }}
                                >
                                    Additional Parameters
                                </Button>
                            </Box>
                        )}

                        {data.outputAnchors.length > 0 && (
                            <>
                                <Divider sx={{ opacity: 0.6 }} />
                                <Box sx={{ p: 1.5 }}>
                                    <Typography
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: theme.palette.error.main,
                                            transition: 'all 0.3s ease',
                                            transform: isHovered ? 'translateX(4px)' : 'none'
                                        }}
                                    >
                                        <IconTransferOut size={18} />
                                        Outputs
                                    </Typography>
                                </Box>
                                <Divider sx={{ opacity: 0.6 }} />
                                {data.outputAnchors.map((outputAnchor, index) => (
                                    <NodeOutputHandler key={index} outputAnchor={outputAnchor} data={data} />
                                ))}
                            </>
                        )}
                    </Box>
                </NodeTooltip>
            </NodeCardWrapper>

            <AdditionalParamsDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
            />
            <NodeInfoDialog
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