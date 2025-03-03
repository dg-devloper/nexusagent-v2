import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
    HIDE_CANVAS_DIALOG,
    SHOW_CANVAS_DIALOG,
    enqueueSnackbar as enqueueSnackbarAction,
    closeSnackbar as closeSnackbarAction
} from '@/store/actions'

// Material
import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Box, 
    Typography, 
    OutlinedInput, 
    Stack,
    TextField,
    InputLabel,
    FormControl,
    alpha
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Project imports
import { StyledButton } from '@/ui-component/button/StyledButton'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'

// Icons
import { IconX, IconFiles, IconEdit, IconPlus } from '@tabler/icons-react'

// API
import documentStoreApi from '@/api/documentstore'

// utils
import useNotifier from '@/utils/useNotifier'

const brandColor = '#2b63d9'
const buttonBlue = '#5379e0'

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: 16,
        boxShadow: `0 10px 40px ${alpha(brandColor, 0.2)}`,
        overflow: 'hidden'
    }
}))

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    background: `linear-gradient(135deg, ${brandColor} 0%, ${alpha(brandColor, 0.8)} 100%)`,
    color: 'white',
    padding: '16px 24px',
    fontSize: '1.25rem',
    fontWeight: 600,
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, ${alpha('#fff', 0.2)} 0%, transparent 100%)`
    }
}))

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
    borderRadius: 8,
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(brandColor, 0.5)
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: brandColor,
        borderWidth: '1px'
    }
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 8,
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(brandColor, 0.5)
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: brandColor,
            borderWidth: '1px'
        }
    }
}))

const AddDocStoreDialog = ({ show, dialogProps, onCancel, onConfirm }) => {
    const portalElement = document.getElementById('portal')

    const dispatch = useDispatch()

    // ==============================|| Snackbar ||============================== //

    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [documentStoreName, setDocumentStoreName] = useState('')
    const [documentStoreDesc, setDocumentStoreDesc] = useState('')
    const [dialogType, setDialogType] = useState('ADD')
    const [docStoreId, setDocumentStoreId] = useState()

    useEffect(() => {
        setDialogType(dialogProps.type)
        if (dialogProps.type === 'EDIT' && dialogProps.data) {
            setDocumentStoreName(dialogProps.data.name)
            setDocumentStoreDesc(dialogProps.data.description)
            setDocumentStoreId(dialogProps.data.id)
        } else if (dialogProps.type === 'ADD') {
            setDocumentStoreName('')
            setDocumentStoreDesc('')
        }

        return () => {
            setDocumentStoreName('')
            setDocumentStoreDesc('')
        }
    }, [dialogProps])

    useEffect(() => {
        if (show) dispatch({ type: SHOW_CANVAS_DIALOG })
        else dispatch({ type: HIDE_CANVAS_DIALOG })
        return () => dispatch({ type: HIDE_CANVAS_DIALOG })
    }, [show, dispatch])

    const createDocumentStore = async () => {
        try {
            const obj = {
                name: documentStoreName,
                description: documentStoreDesc
            }
            const createResp = await documentStoreApi.createDocumentStore(obj)
            if (createResp.data) {
                enqueueSnackbar({
                    message: 'New Document Store created.',
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
                onConfirm(createResp.data.id)
            }
        } catch (err) {
            const errorData = typeof err === 'string' ? err : err.response?.data || `${err.response.data.message}`
            enqueueSnackbar({
                message: `Failed to add new Document Store: ${errorData}`,
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
    }

    const updateDocumentStore = async () => {
        try {
            const saveObj = {
                name: documentStoreName,
                description: documentStoreDesc
            }

            const saveResp = await documentStoreApi.updateDocumentStore(docStoreId, saveObj)
            if (saveResp.data) {
                enqueueSnackbar({
                    message: 'Document Store Updated!',
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
                onConfirm(saveResp.data.id)
            }
        } catch (error) {
            const errorData = error.response?.data || `${error.response?.status}: ${error.response?.statusText}`
            enqueueSnackbar({
                message: `Failed to update Document Store: ${errorData}`,
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
    }

    const component = show ? (
        <StyledDialog
            fullWidth
            maxWidth='sm'
            open={show}
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <StyledDialogTitle id='alert-dialog-title'>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        {dialogType === 'ADD' ? (
                            <IconPlus size={20} style={{ color: '#fff' }} />
                        ) : (
                            <IconEdit size={20} style={{ color: '#fff' }} />
                        )}
                    </Box>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                        {dialogProps.title}
                    </Typography>
                </Stack>
            </StyledDialogTitle>
            <DialogContent sx={{ p: 5, pt: 5 }}>
                <Stack spacing={3}>
                    <FormControl fullWidth variant="outlined">
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                            Name <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <StyledTextField
                            id="document-store-name"
                            variant="outlined"
                            fullWidth
                            value={documentStoreName ?? ''}
                            onChange={(e) => setDocumentStoreName(e.target.value)}
                            required
                            InputLabelProps={{
                                shrink: false
                            }}
                        />
                    </FormControl>
                    
                    <FormControl fullWidth variant="outlined">
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                            Description
                        </Typography>
                        <StyledTextField
                            id="document-store-description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={6}
                            value={documentStoreDesc ?? ''}
                            onChange={(e) => setDocumentStoreDesc(e.target.value)}
                            InputLabelProps={{
                                shrink: false
                            }}
                        />
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${alpha('#000', 0.05)}` }}>
                <Button 
                    onClick={() => onCancel()}
                    sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        color: alpha(brandColor, 0.8)
                    }}
                >
                    {dialogProps.cancelButtonName || 'Cancel'}
                </Button>
                <StyledButton
                    disabled={!documentStoreName}
                    variant='contained'
                    onClick={() => (dialogType === 'ADD' ? createDocumentStore() : updateDocumentStore())}
                    sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        backgroundColor: brandColor,
                        '&:hover': {
                            backgroundColor: alpha(brandColor, 0.9)
                        }
                    }}
                >
                    {dialogProps.confirmButtonName}
                </StyledButton>
            </DialogActions>
            <ConfirmDialog />
        </StyledDialog>
    ) : null

    return createPortal(component, portalElement)
}

AddDocStoreDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func
}

export default AddDocStoreDialog
