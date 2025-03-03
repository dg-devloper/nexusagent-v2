import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from '@/store/actions'
import parser from 'html-react-parser'

// Material
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Stack, OutlinedInput, Typography, alpha } from '@mui/material'

// Project imports
import { StyledButton } from '@/ui-component/button/StyledButton'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import CredentialInputHandler from './CredentialInputHandler'

// Icons
import { IconX, IconDeviceFloppy, IconPlus } from '@tabler/icons-react'

// API
import credentialsApi from '@/api/credentials'

// Hooks
import useApi from '@/hooks/useApi'

// utils
import useNotifier from '@/utils/useNotifier'
import { initializeDefaultNodeData } from '@/utils/genericHelper'

// const
import { baseURL, REDACTED_CREDENTIAL_VALUE } from '@/store/constant'
import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from '@/store/actions'

const brandColor = '#2b63d9'

const AddEditCredentialDialog = ({ show, dialogProps, onCancel, onConfirm, setError }) => {
    const portalElement = document.getElementById('portal')

    const dispatch = useDispatch()

    // ==============================|| Snackbar ||============================== //

    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const getSpecificCredentialApi = useApi(credentialsApi.getSpecificCredential)
    const getSpecificComponentCredentialApi = useApi(credentialsApi.getSpecificComponentCredential)

    const [credential, setCredential] = useState({})
    const [name, setName] = useState('')
    const [credentialData, setCredentialData] = useState({})
    const [componentCredential, setComponentCredential] = useState({})

    useEffect(() => {
        if (getSpecificCredentialApi.data) {
            setCredential(getSpecificCredentialApi.data)
            if (getSpecificCredentialApi.data.name) {
                setName(getSpecificCredentialApi.data.name)
            }
            if (getSpecificCredentialApi.data.plainDataObj) {
                setCredentialData(getSpecificCredentialApi.data.plainDataObj)
            }
            getSpecificComponentCredentialApi.request(getSpecificCredentialApi.data.credentialName)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificCredentialApi.data])

    useEffect(() => {
        if (getSpecificComponentCredentialApi.data) {
            setComponentCredential(getSpecificComponentCredentialApi.data)
        }
    }, [getSpecificComponentCredentialApi.data])

    useEffect(() => {
        if (getSpecificCredentialApi.error && setError) {
            setError(getSpecificCredentialApi.error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificCredentialApi.error])

    useEffect(() => {
        if (getSpecificComponentCredentialApi.error && setError) {
            setError(getSpecificComponentCredentialApi.error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificComponentCredentialApi.error])

    useEffect(() => {
        if (dialogProps.type === 'EDIT' && dialogProps.data) {
            // When credential dialog is opened from Credentials dashboard
            getSpecificCredentialApi.request(dialogProps.data.id)
        } else if (dialogProps.type === 'EDIT' && dialogProps.credentialId) {
            // When credential dialog is opened from node in canvas
            getSpecificCredentialApi.request(dialogProps.credentialId)
        } else if (dialogProps.type === 'ADD' && dialogProps.credentialComponent) {
            // When credential dialog is to add a new credential
            setName('')
            setCredential({})
            const defaultCredentialData = initializeDefaultNodeData(dialogProps.credentialComponent.inputs)
            setCredentialData(defaultCredentialData)
            setComponentCredential(dialogProps.credentialComponent)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dialogProps])

    useEffect(() => {
        if (show) dispatch({ type: SHOW_CANVAS_DIALOG })
        else dispatch({ type: HIDE_CANVAS_DIALOG })
        return () => dispatch({ type: HIDE_CANVAS_DIALOG })
    }, [show, dispatch])

    const addNewCredential = async () => {
        try {
            const obj = {
                name,
                credentialName: componentCredential.name,
                plainDataObj: credentialData
            }
            const createResp = await credentialsApi.createCredential(obj)
            if (createResp.data) {
                enqueueSnackbar({
                    message: 'New Credential added',
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
        } catch (error) {
            if (setError) setError(error)
            enqueueSnackbar({
                message: `Failed to add new Credential: ${
                    typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                }`,
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

    const saveCredential = async () => {
        try {
            const saveObj = {
                name,
                credentialName: componentCredential.name
            }

            let plainDataObj = {}
            for (const key in credentialData) {
                if (credentialData[key] !== REDACTED_CREDENTIAL_VALUE) {
                    plainDataObj[key] = credentialData[key]
                }
            }
            if (Object.keys(plainDataObj).length) saveObj.plainDataObj = plainDataObj

            const saveResp = await credentialsApi.updateCredential(credential.id, saveObj)
            if (saveResp.data) {
                enqueueSnackbar({
                    message: 'Credential saved',
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
            if (setError) setError(error)
            enqueueSnackbar({
                message: `Failed to save Credential: ${
                    typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                }`,
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
        <Dialog
            fullWidth
            maxWidth='sm'
            open={show}
            onClose={onCancel}
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
                {componentCredential && componentCredential.label && (
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 50,
                                height: 50,
                                borderRadius: '12px',
                                backgroundColor: alpha(brandColor, 0.05),
                                border: `1px solid ${alpha(brandColor, 0.1)}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <img
                                style={{
                                    width: '70%',
                                    height: '70%',
                                    objectFit: 'contain'
                                }}
                                alt={componentCredential.name}
                                src={`${baseURL}/api/v1/components-credentials-icon/${componentCredential.name}`}
                            />
                        </Box>
                        <Typography 
                            sx={{ 
                                color: 'rgb(51, 65, 85)',
                                fontWeight: 600
                            }}
                        >
                            {componentCredential.label}
                        </Typography>
                    </Box>
                )}
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                {componentCredential && componentCredential.description && (
                    <Box sx={{ px: 3, pt: 3 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                borderRadius: 3,
                                background: alpha('#FFC107', 0.1),
                                border: `1px solid ${alpha('#FFC107', 0.2)}`,
                                padding: 2,
                                color: '#B45309'
                            }}
                        >
                            {parser(componentCredential.description)}
                        </Box>
                    </Box>
                )}
                {componentCredential && componentCredential.label && (
                    <Box sx={{ p: 3 }}>
                        <Stack sx={{ position: 'relative', mb: 1 }} direction='row'>
                            <Typography 
                                variant='subtitle2'
                                sx={{
                                    color: 'rgb(100, 116, 139)',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                Credential Name
                                <span style={{ color: '#EF4444' }}>&nbsp;*</span>
                            </Typography>
                        </Stack>
                        <OutlinedInput
                            id='credName'
                            type='string'
                            fullWidth
                            placeholder={componentCredential.label}
                            value={name}
                            name='name'
                            onChange={(e) => setName(e.target.value)}
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
                )}
                {componentCredential &&
                    componentCredential.inputs &&
                    componentCredential.inputs.map((inputParam, index) => (
                        <CredentialInputHandler key={index} inputParam={inputParam} data={credentialData} />
                    ))}
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2, borderTop: `1px solid ${alpha(brandColor, 0.1)}` }}>
                <Button
                    variant="outlined"
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
                    Cancel
                </Button>
                <StyledButton
                    disabled={!name}
                    variant='contained'
                    onClick={() => (dialogProps.type === 'ADD' ? addNewCredential() : saveCredential())}
                    startIcon={dialogProps.type === 'ADD' ? <IconPlus size={18} /> : <IconDeviceFloppy size={18} />}
                    sx={{
                        borderRadius: 2,
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
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

AddEditCredentialDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    setError: PropTypes.func
}

export default AddEditCredentialDialog
