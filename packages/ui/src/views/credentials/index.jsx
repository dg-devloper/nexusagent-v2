import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from '@/store/actions'
import moment from 'moment'

// material-ui
import { styled, alpha, useTheme } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell'
import {
    Button,
    Box,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography
} from '@mui/material'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import { StyledButton } from '@/ui-component/button/StyledButton'
import CredentialListDialog from './CredentialListDialog'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import AddEditCredentialDialog from './AddEditCredentialDialog'

// API
import credentialsApi from '@/api/credentials'

// Hooks
import useApi from '@/hooks/useApi'
import useConfirm from '@/hooks/useConfirm'

// utils
import useNotifier from '@/utils/useNotifier'

// Icons
import { IconTrash, IconEdit, IconX, IconPlus } from '@tabler/icons-react'

// const
import { baseURL } from '@/store/constant'
import { SET_COMPONENT_CREDENTIALS } from '@/store/actions'
import ErrorBoundary from '@/ErrorBoundary'
import HeaderSection from '@/layout/MainLayout/HeaderSection'
import AppIcon from '@/menu-items/icon'

const brandColor = '#2b63d9'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: `1px solid ${alpha(brandColor, 0.1)}`,
    padding: '20px 24px',
    [`&.${tableCellClasses.head}`]: {
        background: `linear-gradient(180deg, ${alpha(brandColor, 0.05)} 0%, ${alpha(brandColor, 0.02)} 100%)`,
        color: 'rgb(100, 116, 139)',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        height: 64
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '0.875rem',
        color: 'rgb(51, 65, 85)',
        height: 72
    }
}))

const StyledTableRow = styled(TableRow)(() => ({
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    '&:hover': {
        backgroundColor: alpha(brandColor, 0.02),
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 12px ${alpha(brandColor, 0.08)}`
    },
    '&:after': {
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '1px',
        background: `linear-gradient(90deg, ${alpha(brandColor, 0.1)} 0%, ${alpha(brandColor, 0.05)} 100%)`
    },
    '&:last-child:after': {
        display: 'none'
    }
}))

// ==============================|| Credentials ||============================== //

const Credentials = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const dispatch = useDispatch()
    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showCredentialListDialog, setShowCredentialListDialog] = useState(false)
    const [credentialListDialogProps, setCredentialListDialogProps] = useState({})
    const [showSpecificCredentialDialog, setShowSpecificCredentialDialog] = useState(false)
    const [specificCredentialDialogProps, setSpecificCredentialDialogProps] = useState({})
    const [credentials, setCredentials] = useState([])
    const [componentsCredentials, setComponentsCredentials] = useState([])

    const { confirm } = useConfirm()

    const getAllCredentialsApi = useApi(credentialsApi.getAllCredentials)
    const getAllComponentsCredentialsApi = useApi(credentialsApi.getAllComponentsCredentials)

    const [search, setSearch] = useState('')
    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }
    function filterCredentials(data) {
        return data.credentialName.toLowerCase().indexOf(search.toLowerCase()) > -1
    }

    const listCredential = () => {
        const dialogProp = {
            title: 'Add New Credential',
            componentsCredentials
        }
        setCredentialListDialogProps(dialogProp)
        setShowCredentialListDialog(true)
    }

    const addNew = (credentialComponent) => {
        const dialogProp = {
            type: 'ADD',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add',
            credentialComponent
        }
        setSpecificCredentialDialogProps(dialogProp)
        setShowSpecificCredentialDialog(true)
    }

    const edit = (credential) => {
        const dialogProp = {
            type: 'EDIT',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Save',
            data: credential
        }
        setSpecificCredentialDialogProps(dialogProp)
        setShowSpecificCredentialDialog(true)
    }

    const deleteCredential = async (credential) => {
        const confirmPayload = {
            title: `Delete`,
            description: `Delete credential ${credential.name}?`,
            confirmButtonName: 'Delete',
            cancelButtonName: 'Cancel'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                const deleteResp = await credentialsApi.deleteCredential(credential.id)
                if (deleteResp.data) {
                    enqueueSnackbar({
                        message: 'Credential deleted',
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
                    onConfirm()
                }
            } catch (error) {
                enqueueSnackbar({
                    message: `Failed to delete Credential: ${
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
    }

    const onCredentialSelected = (credentialComponent) => {
        setShowCredentialListDialog(false)
        addNew(credentialComponent)
    }

    const onConfirm = () => {
        setShowCredentialListDialog(false)
        setShowSpecificCredentialDialog(false)
        getAllCredentialsApi.request()
    }

    useEffect(() => {
        getAllCredentialsApi.request()
        getAllComponentsCredentialsApi.request()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllCredentialsApi.loading)
    }, [getAllCredentialsApi.loading])

    useEffect(() => {
        if (getAllCredentialsApi.data) {
            setCredentials(getAllCredentialsApi.data)
        }
    }, [getAllCredentialsApi.data])

    useEffect(() => {
        if (getAllCredentialsApi.error) {
            setError(getAllCredentialsApi.error)
        }
    }, [getAllCredentialsApi.error])

    useEffect(() => {
        if (getAllComponentsCredentialsApi.data) {
            setComponentsCredentials(getAllComponentsCredentialsApi.data)
            dispatch({ type: SET_COMPONENT_CREDENTIALS, componentsCredentials: getAllComponentsCredentialsApi.data })
        }
    }, [getAllComponentsCredentialsApi.data, dispatch])

    return (
        <>
            <MainCard>
                {error ? (
                    <ErrorBoundary error={error} />
                ) : (
                    <Stack flexDirection='column' sx={{ gap: 3 }}>
                        <HeaderSection
                            onSearchChange={onSearchChange}
                            title={AppIcon.security.headerTitle}
                            subtitle={AppIcon.security.description}
                            icon={AppIcon.security.icon}
                        >
                            <StyledButton
                                variant='contained'
                                onClick={listCredential}
                                startIcon={<IconPlus />}
                                sx={{ 
                                    borderRadius: 2, 
                                    height: 40,
                                    backgroundColor: '#1F64FF',
                                    '&:hover': {
                                        backgroundColor: '#1957E3'
                                    }
                                }}
                            >
                                Add Credential
                            </StyledButton>
                        </HeaderSection>
                        {!isLoading && credentials.length <= 0 ? (
                            <Stack 
                                sx={{ 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    py: 8
                                }} 
                                flexDirection='column'
                                spacing={2}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: 'rgb(99, 115, 129)',
                                        textAlign: 'center',
                                        maxWidth: 300
                                    }}
                                >
                                    No credentials yet. Add your first credential to get started!
                                </Typography>
                                <StyledButton
                                    variant="contained"
                                    onClick={listCredential}
                                    startIcon={<IconPlus />}
                                    sx={{
                                        mt: 2,
                                        borderRadius: 2,
                                        height: 40,
                                        backgroundColor: '#1F64FF',
                                        '&:hover': {
                                            backgroundColor: '#1957E3'
                                        }
                                    }}
                                >
                                    Add Credential
                                </StyledButton>
                            </Stack>
                        ) : (
                            <TableContainer 
                                component={Paper} 
                                elevation={0}
                                sx={{ 
                                    border: `1px solid ${alpha(brandColor, 0.1)}`,
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    background: `linear-gradient(180deg, ${alpha(brandColor, 0.02)} 0%, transparent 100%)`,
                                    boxShadow: `0 8px 32px -4px ${alpha(brandColor, 0.08)}`
                                }}
                            >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Name</StyledTableCell>
                                            <StyledTableCell>Last Updated</StyledTableCell>
                                            <StyledTableCell>Created</StyledTableCell>
                                            <StyledTableCell align="right">Actions</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading ? (
                                            <>
                                                {[1, 2, 3].map((index) => (
                                                    <StyledTableRow key={index}>
                                                        <StyledTableCell colSpan={4}>
                                                            <Box
                                                                sx={{
                                                                    height: 72,
                                                                    borderRadius: 3,
                                                                    background: `linear-gradient(90deg, ${alpha(brandColor, 0.04)} 0%, ${alpha(brandColor, 0.02)} 50%, ${alpha(brandColor, 0.04)} 100%)`,
                                                                    backgroundSize: '200% 100%',
                                                                    animation: 'pulse 2s ease-in-out infinite',
                                                                    '@keyframes pulse': {
                                                                        '0%': {
                                                                            backgroundPosition: '0% 0%'
                                                                        },
                                                                        '100%': {
                                                                            backgroundPosition: '-200% 0%'
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </>
                                        ) : (
                                            <>
                                                {credentials.filter(filterCredentials).map((credential, index) => (
                                                    <StyledTableRow key={index}>
                                                        <StyledTableCell>
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'row',
                                                                    alignItems: 'center',
                                                                    gap: 2
                                                                }}
                                                            >
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
                                                                    <img
                                                                        style={{
                                                                            width: '70%',
                                                                            height: '70%',
                                                                            objectFit: 'contain'
                                                                        }}
                                                                        alt={credential.credentialName}
                                                                        src={`${baseURL}/api/v1/components-credentials-icon/${credential.credentialName}`}
                                                                    />
                                                                </Box>
                                                                <Typography
                                                                    sx={{
                                                                        color: 'rgb(51, 65, 85)',
                                                                        fontWeight: 600,
                                                                        fontSize: '0.875rem',
                                                                        transition: 'all 0.2s ease-in-out',
                                                                        '&:hover': {
                                                                            color: brandColor
                                                                        }
                                                                    }}
                                                                >
                                                                    {credential.name}
                                                                </Typography>
                                                            </Box>
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <Typography 
                                                                sx={{ 
                                                                    color: 'rgb(100, 116, 139)',
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                {moment(credential.updatedDate).format('MMM D, YYYY')}
                                                            </Typography>
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <Typography 
                                                                sx={{ 
                                                                    color: 'rgb(100, 116, 139)',
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                {moment(credential.createdDate).format('MMM D, YYYY')}
                                                            </Typography>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right">
                                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                                <IconButton 
                                                                    title='Edit' 
                                                                    onClick={() => edit(credential)}
                                                                    sx={{
                                                                        color: brandColor,
                                                                        backgroundColor: alpha(brandColor, 0.05),
                                                                        borderRadius: '10px',
                                                                        transition: 'all 0.2s ease-in-out',
                                                                        '&:hover': {
                                                                            backgroundColor: alpha(brandColor, 0.1),
                                                                            transform: 'translateY(-2px)',
                                                                            boxShadow: `0 4px 12px ${alpha(brandColor, 0.15)}`
                                                                        }
                                                                    }}
                                                                >
                                                                    <IconEdit size={18} />
                                                                </IconButton>
                                                                <IconButton
                                                                    title='Delete'
                                                                    onClick={() => deleteCredential(credential)}
                                                                    sx={{
                                                                        color: '#EF4444',
                                                                        backgroundColor: alpha('#EF4444', 0.05),
                                                                        borderRadius: '10px',
                                                                        transition: 'all 0.2s ease-in-out',
                                                                        '&:hover': {
                                                                            backgroundColor: alpha('#EF4444', 0.1),
                                                                            transform: 'translateY(-2px)',
                                                                            boxShadow: `0 4px 12px ${alpha('#EF4444', 0.15)}`
                                                                        }
                                                                    }}
                                                                >
                                                                    <IconTrash size={18} />
                                                                </IconButton>
                                                            </Stack>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Stack>
                )}
            </MainCard>
            <CredentialListDialog
                show={showCredentialListDialog}
                dialogProps={credentialListDialogProps}
                onCancel={() => setShowCredentialListDialog(false)}
                onCredentialSelected={onCredentialSelected}
            ></CredentialListDialog>
            <AddEditCredentialDialog
                show={showSpecificCredentialDialog}
                dialogProps={specificCredentialDialogProps}
                onCancel={() => setShowSpecificCredentialDialog(false)}
                onConfirm={onConfirm}
                setError={setError}
            ></AddEditCredentialDialog>
            <ConfirmDialog />
        </>
    )
}

export default Credentials
