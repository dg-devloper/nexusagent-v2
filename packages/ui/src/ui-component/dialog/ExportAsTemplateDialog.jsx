import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

// material-ui
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, OutlinedInput, Typography, Stack, alpha } from '@mui/material'

// store
import {
    closeSnackbar as closeSnackbarAction,
    enqueueSnackbar as enqueueSnackbarAction,
    HIDE_CANVAS_DIALOG,
    SHOW_CANVAS_DIALOG
} from '@/store/actions'
import useNotifier from '@/utils/useNotifier'
import { StyledButton } from '@/ui-component/button/StyledButton'
import Chip from '@mui/material/Chip'
import { IconX, IconTemplate, IconPlus } from '@tabler/icons-react'

// API
import marketplacesApi from '@/api/marketplaces'
import useApi from '@/hooks/useApi'

const brandColor = '#2b63d9'

const ExportAsTemplateDialog = ({ show, dialogProps, onCancel }) => {
    const portalElement = document.getElementById('portal')
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [flowType, setFlowType] = useState('')
    const [description, setDescription] = useState('')
    const [badge, setBadge] = useState('')
    const [usecases, setUsecases] = useState([])
    const [usecaseInput, setUsecaseInput] = useState('')

    const saveCustomTemplateApi = useApi(marketplacesApi.saveAsCustomTemplate)

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    useNotifier()

    useEffect(() => {
        if (dialogProps.chatflow) {
            setName(dialogProps.chatflow.name)
            setFlowType(dialogProps.chatflow.type === 'MULTIAGENT' ? 'Agentflow' : 'Chatflow')
        }

        if (dialogProps.tool) {
            setName(dialogProps.tool.name)
            setDescription(dialogProps.tool.description)
            setFlowType('Tool')
        }

        return () => {
            setName('')
            setDescription('')
            setBadge('')
            setUsecases([])
            setFlowType('')
            setUsecaseInput('')
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dialogProps])

    useEffect(() => {
        if (show) dispatch({ type: SHOW_CANVAS_DIALOG })
        else dispatch({ type: HIDE_CANVAS_DIALOG })
        return () => dispatch({ type: HIDE_CANVAS_DIALOG })
    }, [show, dispatch])

    const handleUsecaseInputChange = (event) => {
        setUsecaseInput(event.target.value)
    }

    const handleUsecaseInputKeyDown = (event) => {
        if (event.key === 'Enter' && usecaseInput.trim()) {
            event.preventDefault()
            if (!usecases.includes(usecaseInput)) {
                setUsecases([...usecases, usecaseInput])
                setUsecaseInput('')
            }
        }
    }

    const handleUsecaseDelete = (toDelete) => {
        setUsecases(usecases.filter((category) => category !== toDelete))
    }

    const onConfirm = () => {
        if (name.trim() === '') {
            enqueueSnackbar({
                message: 'Template Name is mandatory!',
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
            return
        }

        const template = {
            name,
            description,
            badge: badge ? badge.toUpperCase() : undefined,
            usecases,
            type: flowType
        }
        if (dialogProps.chatflow) {
            template.chatflowId = dialogProps.chatflow.id
        }
        if (dialogProps.tool) {
            template.tool = {
                iconSrc: dialogProps.tool.iconSrc,
                schema: dialogProps.tool.schema,
                func: dialogProps.tool.func
            }
        }
        saveCustomTemplateApi.request(template)
    }

    useEffect(() => {
        if (saveCustomTemplateApi.data) {
            enqueueSnackbar({
                message: 'Saved as template successfully!',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'success',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
            onCancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveCustomTemplateApi.data])

    useEffect(() => {
        if (saveCustomTemplateApi.error) {
            enqueueSnackbar({
                message: 'Failed to save as template!',
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
            onCancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveCustomTemplateApi.error])

    const component = show ? (
        <Dialog
            onClose={onCancel}
            open={show}
            fullWidth
            maxWidth='sm'
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: `0 8px 40px ${alpha(brandColor, 0.1)}`,
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle 
                sx={{ 
                    fontSize: '1.25rem', 
                    p: 3, 
                    pb: 2,
                    fontWeight: 600,
                    color: 'rgb(51, 65, 85)',
                    borderBottom: `1px solid ${alpha(brandColor, 0.1)}`
                }} 
                id='alert-dialog-title'
            >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '12px',
                            backgroundColor: alpha(brandColor, 0.05),
                            border: `1px solid ${alpha(brandColor, 0.1)}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px) scale(1.05)',
                                boxShadow: `0 6px 16px ${alpha(brandColor, 0.12)}`,
                                backgroundColor: alpha(brandColor, 0.08)
                            }
                        }}
                    >
                        <IconTemplate size={24} color={brandColor} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {dialogProps.title || 'Export As Template'}
                    </Typography>
                </Stack>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <Stack spacing={3} sx={{ p: 3 }}>
                    <Box>
                        <Typography 
                            variant='subtitle2'
                            sx={{
                                color: 'rgb(100, 116, 139)',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                mb: 1
                            }}
                        >
                            Name<span style={{ color: '#EF4444' }}>&nbsp;*</span>
                        </Typography>
                        <OutlinedInput
                            id={'name'}
                            type={'string'}
                            fullWidth
                            value={name}
                            name='name'
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                            sx={{ 
                                borderRadius: 2,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: alpha(brandColor, 0.2)
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: alpha(brandColor, 0.3)
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: brandColor
                                }
                            }}
                        />
                    </Box>
                    
                    <Box>
                        <Typography 
                            variant='subtitle2'
                            sx={{
                                color: 'rgb(100, 116, 139)',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                mb: 1
                            }}
                        >
                            Description
                        </Typography>
                        <OutlinedInput
                            id={'description'}
                            type={'string'}
                            fullWidth
                            multiline
                            rows={2}
                            value={description}
                            name='description'
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }}
                            sx={{ 
                                borderRadius: 2,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: alpha(brandColor, 0.2)
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: alpha(brandColor, 0.3)
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: brandColor
                                }
                            }}
                        />
                    </Box>
                    
                    <Box>
                        <Typography 
                            variant='subtitle2'
                            sx={{
                                color: 'rgb(100, 116, 139)',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                mb: 1
                            }}
                        >
                            Badge
                        </Typography>
                        <OutlinedInput
                            id={'badge'}
                            type={'string'}
                            fullWidth
                            value={badge}
                            name='badge'
                            onChange={(e) => {
                                setBadge(e.target.value)
                            }}
                            sx={{ 
                                borderRadius: 2,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: alpha(brandColor, 0.2)
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: alpha(brandColor, 0.3)
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: brandColor
                                }
                            }}
                        />
                    </Box>
                    
                    <Box>
                        <Typography 
                            variant='subtitle2'
                            sx={{
                                color: 'rgb(100, 116, 139)',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                mb: 1
                            }}
                        >
                            Usecases
                        </Typography>
                        {usecases.length > 0 && (
                            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {usecases.map((uc, index) => (
                                    <Chip
                                        key={index}
                                        label={uc}
                                        onDelete={() => handleUsecaseDelete(uc)}
                                        sx={{
                                            borderRadius: '8px',
                                            backgroundColor: alpha(brandColor, 0.1),
                                            color: brandColor,
                                            border: `1px solid ${alpha(brandColor, 0.2)}`,
                                            '& .MuiChip-deleteIcon': {
                                                color: alpha(brandColor, 0.7),
                                                '&:hover': {
                                                    color: brandColor
                                                }
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                        )}
                        <OutlinedInput
                            fullWidth
                            value={usecaseInput}
                            onChange={handleUsecaseInputChange}
                            onKeyDown={handleUsecaseInputKeyDown}
                            placeholder="Type and press Enter to add"
                            sx={{ 
                                borderRadius: 2,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: alpha(brandColor, 0.2)
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: alpha(brandColor, 0.3)
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: brandColor
                                }
                            }}
                        />
                        <Typography 
                            variant='body2' 
                            sx={{ 
                                fontStyle: 'italic', 
                                mt: 1,
                                color: 'rgb(100, 116, 139)',
                                fontSize: '0.75rem'
                            }}
                        >
                            Type a usecase and press enter to add it to the list. You can add as many items as you want.
                        </Typography>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2, borderTop: `1px solid ${alpha(brandColor, 0.1)}` }}>
                <Button 
                    onClick={onCancel}
                    sx={{
                        borderRadius: 2,
                        borderColor: alpha(brandColor, 0.3),
                        color: brandColor,
                        '&:hover': {
                            borderColor: brandColor,
                            backgroundColor: alpha(brandColor, 0.05)
                        }
                    }}
                >
                    {dialogProps.cancelButtonName || 'Cancel'}
                </Button>
                <StyledButton 
                    disabled={dialogProps.disabled} 
                    variant='contained' 
                    onClick={onConfirm}
                    startIcon={<IconPlus size={18} />}
                    sx={{
                        borderRadius: 2,
                        backgroundColor: brandColor,
                        '&:hover': {
                            backgroundColor: alpha(brandColor, 0.9)
                        }
                    }}
                >
                    {dialogProps.confirmButtonName || 'Save Template'}
                </StyledButton>
            </DialogActions>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

ExportAsTemplateDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func
}

export default ExportAsTemplateDialog
