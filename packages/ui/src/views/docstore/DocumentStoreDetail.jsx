import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

// material-ui
import {
    Box,
    Stack,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Menu,
    MenuItem,
    Divider,
    Button,
    Skeleton,
    IconButton,
    Grid,
    Card
} from '@mui/material'
import { alpha, styled, useTheme } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import AddDocStoreDialog from '@/views/docstore/AddDocStoreDialog'
import { BackdropLoader } from '@/ui-component/loading/BackdropLoader'
import DocumentLoaderListDialog from '@/views/docstore/DocumentLoaderListDialog'
import ErrorBoundary from '@/ErrorBoundary'
import { StyledButton } from '@/ui-component/button/StyledButton'
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import DeleteDocStoreDialog from './DeleteDocStoreDialog'
import DocumentStoreStatus from '@/views/docstore/DocumentStoreStatus'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'

// API
import documentsApi from '@/api/documentstore'

// Hooks
import useApi from '@/hooks/useApi'
import useNotifier from '@/utils/useNotifier'
import { getFileName } from '@/utils/genericHelper'
import useConfirm from '@/hooks/useConfirm'

// icons
import { 
    IconPlus, 
    IconRefresh, 
    IconX, 
    IconVectorBezier2, 
    IconFiles, 
    IconDatabase, 
    IconFileText, 
    IconInfoCircle,
    IconChartBar,
    IconCloudUpload
} from '@tabler/icons-react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import FileDeleteIcon from '@mui/icons-material/Delete'
import FileEditIcon from '@mui/icons-material/Edit'
import FileChunksIcon from '@mui/icons-material/AppRegistration'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import doc_store_details_emptySVG from '@/assets/images/doc_store_details_empty.svg'

// store
import { closeSnackbar as closeSnackbarAction, enqueueSnackbar as enqueueSnackbarAction } from '@/store/actions'

// ==============================|| DOCUMENTS ||============================== //

const brandColor = '#2b63d9'
const buttonBlue = '#5379e0'

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

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 16,
        marginTop: theme.spacing(1),
        minWidth: 180,
        boxShadow: `0 10px 30px ${alpha(brandColor, 0.15)}`,
        '& .MuiMenu-list': {
            padding: '8px'
        },
        '& .MuiMenuItem-root': {
            borderRadius: 8,
            margin: '4px 0',
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: alpha(brandColor, 0.8),
                marginRight: theme.spacing(1.5)
            },
            '&:hover': {
                backgroundColor: alpha(brandColor, 0.05)
            },
            '&:active': {
                backgroundColor: alpha(brandColor, 0.1)
            }
        }
    }
}))

const DocumentStoreDetails = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useNotifier()
    const { confirm } = useConfirm()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const getSpecificDocumentStore = useApi(documentsApi.getSpecificDocumentStore)

    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [isBackdropLoading, setBackdropLoading] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [documentStore, setDocumentStore] = useState({})
    const [dialogProps, setDialogProps] = useState({})
    const [showDocumentLoaderListDialog, setShowDocumentLoaderListDialog] = useState(false)
    const [documentLoaderListDialogProps, setDocumentLoaderListDialogProps] = useState({})
    const [showDeleteDocStoreDialog, setShowDeleteDocStoreDialog] = useState(false)
    const [deleteDocStoreDialogProps, setDeleteDocStoreDialogProps] = useState({})

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const URLpath = document.location.pathname.toString().split('/')
    const storeId = URLpath[URLpath.length - 1] === 'document-stores' ? '' : URLpath[URLpath.length - 1]

    const openPreviewSettings = (id) => {
        navigate('/document-stores/' + storeId + '/' + id)
    }

    const showStoredChunks = (id) => {
        navigate('/document-stores/chunks/' + storeId + '/' + id)
    }

    const showVectorStoreQuery = (id) => {
        navigate('/document-stores/query/' + id)
    }

    const onDocLoaderSelected = (docLoaderComponentName) => {
        setShowDocumentLoaderListDialog(false)
        navigate('/document-stores/' + storeId + '/' + docLoaderComponentName)
    }

    const showVectorStore = (id) => {
        navigate('/document-stores/vector/' + id)
    }

    const listLoaders = () => {
        const dialogProp = {
            title: 'Select Document Loader'
        }
        setDocumentLoaderListDialogProps(dialogProp)
        setShowDocumentLoaderListDialog(true)
    }

    const deleteVectorStoreDataFromStore = async (storeId) => {
        try {
            await documentsApi.deleteVectorStoreDataFromStore(storeId)
        } catch (error) {
            console.error(error)
        }
    }

    const onDocStoreDelete = async (type, file, removeFromVectorStore) => {
        setBackdropLoading(true)
        setShowDeleteDocStoreDialog(false)
        if (type === 'STORE') {
            if (removeFromVectorStore) {
                await deleteVectorStoreDataFromStore(storeId)
            }
            try {
                const deleteResp = await documentsApi.deleteDocumentStore(storeId)
                setBackdropLoading(false)
                if (deleteResp.data) {
                    enqueueSnackbar({
                        message: 'Store, Loader and associated document chunks deleted',
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
                    navigate('/document-stores/')
                }
            } catch (error) {
                setBackdropLoading(false)
                setError(error)
                enqueueSnackbar({
                    message: `Failed to delete Document Store: ${
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
            }
        } else if (type === 'LOADER') {
            try {
                const deleteResp = await documentsApi.deleteLoaderFromStore(storeId, file.id)
                setBackdropLoading(false)
                if (deleteResp.data) {
                    enqueueSnackbar({
                        message: 'Loader and associated document chunks deleted',
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
                setError(error)
                setBackdropLoading(false)
                enqueueSnackbar({
                    message: `Failed to delete Document Loader: ${
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
            }
        }
    }

    const onLoaderDelete = (file, vectorStoreConfig, recordManagerConfig) => {
        const props = {
            title: `Delete`,
            description: `Delete Loader ${file.loaderName} ? This will delete all the associated document chunks.`,
            vectorStoreConfig,
            recordManagerConfig,
            type: 'LOADER',
            file
        }

        setDeleteDocStoreDialogProps(props)
        setShowDeleteDocStoreDialog(true)
    }

    const onStoreDelete = (vectorStoreConfig, recordManagerConfig) => {
        const props = {
            title: `Delete`,
            description: `Delete Store ${getSpecificDocumentStore.data?.name} ? This will delete all the associated loaders and document chunks.`,
            vectorStoreConfig,
            recordManagerConfig,
            type: 'STORE'
        }

        setDeleteDocStoreDialogProps(props)
        setShowDeleteDocStoreDialog(true)
    }

    const onStoreRefresh = async (storeId) => {
        const confirmPayload = {
            title: `Refresh all loaders and upsert all chunks?`,
            description: `This will re-process all loaders and upsert all chunks. This action might take some time.`,
            confirmButtonName: 'Refresh',
            cancelButtonName: 'Cancel'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            setAnchorEl(null)
            setBackdropLoading(true)
            try {
                const resp = await documentsApi.refreshLoader(storeId)
                if (resp.data) {
                    enqueueSnackbar({
                        message: 'Document store refresh successfully!',
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
                setBackdropLoading(false)
            } catch (error) {
                setBackdropLoading(false)
                enqueueSnackbar({
                    message: `Failed to refresh document store: ${
                        typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                    }`,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
            }
        }
    }

    const onEditClicked = () => {
        const data = {
            name: documentStore.name,
            description: documentStore.description,
            id: documentStore.id
        }
        const dialogProp = {
            title: 'Edit Document Store',
            type: 'EDIT',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Update',
            data: data
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const onConfirm = () => {
        setShowDialog(false)
        getSpecificDocumentStore.request(storeId)
    }

    const handleClick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    useEffect(() => {
        getSpecificDocumentStore.request(storeId)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (getSpecificDocumentStore.data) {
            setDocumentStore(getSpecificDocumentStore.data)
            // total the chunks and chars
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificDocumentStore.data])

    useEffect(() => {
        if (getSpecificDocumentStore.error) {
            setError(getSpecificDocumentStore.error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificDocumentStore.error])

    useEffect(() => {
        setLoading(getSpecificDocumentStore.loading)
    }, [getSpecificDocumentStore.loading])
    return (
        <>
            <MainCard>
                {error ? (
                    <ErrorBoundary error={error} />
                ) : (
                    <Stack flexDirection='column' sx={{ gap: 3 }}>
                        <Box
                            sx={{
                                borderRadius: '24px',
                                background: `linear-gradient(135deg, ${brandColor} 0%, ${alpha(brandColor, 0.8)} 100%)`,
                                padding: '3rem',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: `0 10px 40px -10px ${alpha(brandColor, 0.4)}`,
                                '&:before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: `radial-gradient(circle at top left, ${alpha('#fff', 0.12)} 0%, transparent 50%)`,
                                    pointerEvents: 'none'
                                },
                                '&:after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '20%',
                                    right: '10%',
                                    width: '300px',
                                    height: '300px',
                                    background: `radial-gradient(circle, ${alpha('#fff', 0.08)} 0%, transparent 50%)`,
                                    pointerEvents: 'none'
                                }
                            }}
                        >
                            <Stack spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={7}>
                                        <Stack direction="row" spacing={3} alignItems="center">
                                            <Box
                                                sx={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    backdropFilter: 'blur(8px)',
                                                    color: 'white',
                                                    padding: '16px',
                                                    borderRadius: '16px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    transform: 'rotate(-5deg)'
                                                }}
                                            >
                                                <IconFiles stroke={2} size='1.5rem' style={{ color: '#fff' }} />
                                            </Box>
                                            <Stack spacing={1}>
                                                <Typography 
                                                    variant='h3' 
                                                    sx={{ 
                                                        color: '#fff',
                                                        fontWeight: 700,
                                                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                        letterSpacing: '-0.02em'
                                                    }}
                                                >
                                                    {documentStore?.name || 'Document Store'}
                                                </Typography>
                                                <Typography 
                                                    sx={{ 
                                                        color: 'rgba(255, 255, 255, 0.9)',
                                                        fontSize: '1rem',
                                                        lineHeight: 1.6
                                                    }}
                                                >
                                                    {documentStore?.description || 'Loading document store details...'}
                                                </Typography>
                                            </Stack>
                                        </Stack>

                                        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                                            <Chip 
                                                icon={<IconFileText size={16} />} 
                                                label={`${documentStore?.loaders?.length || 0} Document Loaders`}
                                                sx={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                    color: 'white',
                                                    borderRadius: '8px',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    '& .MuiChip-icon': {
                                                        color: 'white'
                                                    }
                                                }}
                                            />
                                            <Chip 
                                                icon={<IconDatabase size={16} />} 
                                                label={`${documentStore?.totalChunks || 0} Chunks`}
                                                sx={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                    color: 'white',
                                                    borderRadius: '8px',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    '& .MuiChip-icon': {
                                                        color: 'white'
                                                    }
                                                }}
                                            />
                                            <DocumentStoreStatus status={documentStore?.status} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        <Box
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(8px)',
                                                borderRadius: '16px',
                                                padding: '20px',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                height: '100%'
                                            }}
                                        >
                                            <Stack spacing={2}>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <IconInfoCircle size={20} style={{ color: 'white' }} />
                                                    <Typography sx={{ color: 'white', fontWeight: 600 }}>
                                                        Document Store Actions
                                                    </Typography>
                                                </Stack>
                                                <Stack spacing={2}>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<IconPlus size={18} />}
                                                        onClick={listLoaders}
                                                        sx={{
                                                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                            color: 'white',
                                                            borderRadius: '10px',
                                                            textTransform: 'none',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(255, 255, 255, 0.25)'
                                                            }
                                                        }}
                                                    >
                                                        Add Document Loader
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<FileChunksIcon style={{ fontSize: 18 }} />}
                                                        onClick={() => showStoredChunks('all')}
                                                        disabled={documentStore?.totalChunks <= 0 || documentStore?.status === 'UPSERTING'}
                                                        sx={{
                                                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                            color: 'white',
                                                            borderRadius: '10px',
                                                            textTransform: 'none',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(255, 255, 255, 0.25)'
                                                            },
                                                            '&.Mui-disabled': {
                                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                                color: 'rgba(255, 255, 255, 0.5)'
                                                            }
                                                        }}
                                                    >
                                                        View & Edit Chunks
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<SearchIcon style={{ fontSize: 18 }} />}
                                                        onClick={() => showVectorStoreQuery(documentStore.id)}
                                                        disabled={documentStore?.totalChunks <= 0 || documentStore?.status !== 'UPSERTED'}
                                                        sx={{
                                                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                            color: 'white',
                                                            borderRadius: '10px',
                                                            textTransform: 'none',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(255, 255, 255, 0.25)'
                                                            },
                                                            '&.Mui-disabled': {
                                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                                color: 'rgba(255, 255, 255, 0.5)'
                                                            }
                                                        }}
                                                    >
                                                        Retrieval Query
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: '1rem',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            variant="contained"
                                            startIcon={<IconRefresh size={18} />}
                                            onClick={() => navigate('/document-stores')}
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                color: 'white',
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.25)'
                                                }
                                            }}
                                        >
                                            Back to Document Stores
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<FileEditIcon style={{ fontSize: 18 }} />}
                                            onClick={() => onEditClicked()}
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                color: 'white',
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.25)'
                                                }
                                            }}
                                        >
                                            Edit Store
                                        </Button>
                                    </Stack>

                                    <Button
                                        id='document-store-header-action-button'
                                        aria-controls={open ? 'document-store-header-menu' : undefined}
                                        aria-haspopup='true'
                                        aria-expanded={open ? 'true' : undefined}
                                        variant='contained'
                                        disableElevation
                                        onClick={handleClick}
                                        sx={{ 
                                            backgroundColor: buttonBlue,
                                            color: 'white',
                                            borderRadius: '10px',
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: alpha(buttonBlue, 0.9)
                                            }
                                        }}
                                        endIcon={<KeyboardArrowDownIcon />}
                                    >
                                        More Actions
                                    </Button>
                                    <StyledMenu
                                        id='document-store-header-menu'
                                        MenuListProps={{
                                            'aria-labelledby': 'document-store-header-menu-button'
                                        }}
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                    >
                                        <MenuItem
                                            disabled={documentStore?.totalChunks <= 0 || documentStore?.status === 'UPSERTING'}
                                            onClick={() => showStoredChunks('all')}
                                            disableRipple
                                        >
                                            <FileChunksIcon />
                                            View & Edit Chunks
                                        </MenuItem>
                                        <MenuItem
                                            disabled={documentStore?.totalChunks <= 0 || documentStore?.status === 'UPSERTING'}
                                            onClick={() => showVectorStore(documentStore.id)}
                                            disableRipple
                                        >
                                            <IconCloudUpload size={18} />
                                            Upsert All Chunks
                                        </MenuItem>
                                        <MenuItem
                                            disabled={documentStore?.totalChunks <= 0 || documentStore?.status !== 'UPSERTED'}
                                            onClick={() => showVectorStoreQuery(documentStore.id)}
                                            disableRipple
                                        >
                                            <SearchIcon />
                                            Retrieval Query
                                        </MenuItem>
                                        <MenuItem
                                            disabled={documentStore?.totalChunks <= 0 || documentStore?.status !== 'UPSERTED'}
                                            onClick={() => onStoreRefresh(documentStore.id)}
                                            disableRipple
                                            title='Re-process all loaders and upsert all chunks'
                                        >
                                            <RefreshIcon />
                                            Refresh
                                        </MenuItem>
                                        <Divider sx={{ my: 0.5 }} />
                                        <MenuItem
                                            onClick={() => onStoreDelete(documentStore.vectorStoreConfig, documentStore.recordManagerConfig)}
                                            disableRipple
                                        >
                                            <FileDeleteIcon />
                                            Delete
                                        </MenuItem>
                                    </StyledMenu>
                                </Box>
                            </Stack>
                        </Box>
                        {getSpecificDocumentStore.data?.whereUsed?.length > 0 && (
                            <Stack flexDirection='row' sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                <div
                                    style={{
                                        paddingLeft: '15px',
                                        paddingRight: '15px',
                                        paddingTop: '10px',
                                        paddingBottom: '10px',
                                        fontSize: '0.9rem',
                                        width: 'max-content',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <IconVectorBezier2 style={{ marginRight: 5 }} size={17} />
                                    Chatflows Used:
                                </div>
                                {getSpecificDocumentStore.data.whereUsed.map((chatflowUsed, index) => (
                                    <Chip
                                        key={index}
                                        clickable
                                        style={{
                                            width: 'max-content',
                                            borderRadius: '25px',
                                            boxShadow: customization.isDarkMode
                                                ? '0 2px 14px 0 rgb(255 255 255 / 10%)'
                                                : '0 2px 14px 0 rgb(32 40 45 / 10%)'
                                        }}
                                        label={chatflowUsed.name}
                                        onClick={() => navigate('/canvas/' + chatflowUsed.id)}
                                    ></Chip>
                                ))}
                            </Stack>
                        )}
                        {!isLoading && documentStore && !documentStore?.loaders?.length ? (
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                                <Box sx={{ p: 2, height: 'auto' }}>
                                    <img
                                        style={{ objectFit: 'cover', height: '16vh', width: 'auto' }}
                                        src={doc_store_details_emptySVG}
                                        alt='doc_store_details_emptySVG'
                                    />
                                </Box>
                                <div>No Document Added Yet</div>
                                <StyledButton
                                    variant='contained'
                                    sx={{ borderRadius: 2, height: '100%', mt: 2, color: 'white' }}
                                    startIcon={<IconPlus />}
                                    onClick={listLoaders}
                                >
                                    Add Document Loader
                                </StyledButton>
                            </Stack>
                        ) : (
                            <TableContainer
                                sx={{ border: 1, borderColor: theme.palette.grey[900] + 25, borderRadius: 2 }}
                                component={Paper}
                            >
                                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                                    <TableHead
                                        sx={{
                                            backgroundColor: customization.isDarkMode
                                                ? theme.palette.common.black
                                                : theme.palette.grey[100],
                                            height: 56
                                        }}
                                    >
                                        <TableRow>
                                            <StyledTableCell>&nbsp;</StyledTableCell>
                                            <StyledTableCell>Loader</StyledTableCell>
                                            <StyledTableCell>Splitter</StyledTableCell>
                                            <StyledTableCell>Source(s)</StyledTableCell>
                                            <StyledTableCell>Chunks</StyledTableCell>
                                            <StyledTableCell>Chars</StyledTableCell>
                                            <StyledTableCell>Actions</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading ? (
                                            <>
                                                <StyledTableRow>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                                <StyledTableRow>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            </>
                                        ) : (
                                            <>
                                                {documentStore?.loaders &&
                                                    documentStore?.loaders.length > 0 &&
                                                    documentStore?.loaders.map((loader, index) => (
                                                        <LoaderRow
                                                            key={index}
                                                            index={index}
                                                            loader={loader}
                                                            theme={theme}
                                                            onEditClick={() => openPreviewSettings(loader.id)}
                                                            onViewChunksClick={() => showStoredChunks(loader.id)}
                                                            onDeleteClick={() =>
                                                                onLoaderDelete(
                                                                    loader,
                                                                    documentStore?.vectorStoreConfig,
                                                                    documentStore?.recordManagerConfig
                                                                )
                                                            }
                                                            onChunkUpsert={() =>
                                                                navigate(`/document-stores/vector/${documentStore.id}/${loader.id}`)
                                                            }
                                                        />
                                                    ))}
                                            </>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        {getSpecificDocumentStore.data?.status === 'STALE' && (
                            <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                                <Typography
                                    color='warning'
                                    style={{ color: 'darkred', fontWeight: 500, fontStyle: 'italic', fontSize: 12 }}
                                >
                                    Some files are pending processing. Please Refresh to get the latest status.
                                </Typography>
                            </div>
                        )}
                    </Stack>
                )}
            </MainCard>
            {showDialog && (
                <AddDocStoreDialog
                    dialogProps={dialogProps}
                    show={showDialog}
                    onCancel={() => setShowDialog(false)}
                    onConfirm={onConfirm}
                />
            )}
            {showDocumentLoaderListDialog && (
                <DocumentLoaderListDialog
                    show={showDocumentLoaderListDialog}
                    dialogProps={documentLoaderListDialogProps}
                    onCancel={() => setShowDocumentLoaderListDialog(false)}
                    onDocLoaderSelected={onDocLoaderSelected}
                />
            )}
            {showDeleteDocStoreDialog && (
                <DeleteDocStoreDialog
                    show={showDeleteDocStoreDialog}
                    dialogProps={deleteDocStoreDialogProps}
                    onCancel={() => setShowDeleteDocStoreDialog(false)}
                    onDelete={onDocStoreDelete}
                />
            )}
            {isBackdropLoading && <BackdropLoader open={isBackdropLoading} />}
            <ConfirmDialog />
        </>
    )
}

function LoaderRow(props) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const formatSources = (source) => {
        if (source && typeof source === 'string' && source.includes('base64')) {
            return getFileName(source)
        }
        if (source && typeof source === 'string' && source.startsWith('[') && source.endsWith(']')) {
            return JSON.parse(source).join(', ')
        }
        return source
    }

    return (
        <>
            <TableRow hover key={props.index} sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}>
                <StyledTableCell onClick={props.onViewChunksClick} scope='row' style={{ width: '5%' }}>
                    <div
                        style={{
                            display: 'flex',
                            width: '20px',
                            height: '20px',
                            backgroundColor: props.loader?.status === 'SYNC' ? '#00e676' : '#ffe57f',
                            borderRadius: '50%'
                        }}
                    ></div>
                </StyledTableCell>
                <StyledTableCell onClick={props.onViewChunksClick} scope='row'>
                    {props.loader.loaderName}
                </StyledTableCell>
                <StyledTableCell onClick={props.onViewChunksClick}>{props.loader.splitterName ?? 'None'}</StyledTableCell>
                <StyledTableCell onClick={props.onViewChunksClick}>{formatSources(props.loader.source)}</StyledTableCell>
                <StyledTableCell onClick={props.onViewChunksClick}>
                    {props.loader.totalChunks && <Chip variant='outlined' size='small' label={props.loader.totalChunks.toLocaleString()} />}
                </StyledTableCell>
                <StyledTableCell onClick={props.onViewChunksClick}>
                    {props.loader.totalChars && <Chip variant='outlined' size='small' label={props.loader.totalChars.toLocaleString()} />}
                </StyledTableCell>
                <StyledTableCell>
                    <div>
                        <Button
                            id='document-store-action-button'
                            aria-controls={open ? 'document-store-action-customized-menu' : undefined}
                            aria-haspopup='true'
                            aria-expanded={open ? 'true' : undefined}
                            disableElevation
                            onClick={(e) => handleClick(e)}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            Options
                        </Button>
                        <StyledMenu
                            id='document-store-actions-customized-menu'
                            MenuListProps={{
                                'aria-labelledby': 'document-store-actions-customized-button'
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={props.onEditClick} disableRipple>
                                <FileEditIcon />
                                Preview & Process
                            </MenuItem>
                            <MenuItem onClick={props.onViewChunksClick} disableRipple>
                                <FileChunksIcon />
                                View & Edit Chunks
                            </MenuItem>
                            <MenuItem onClick={props.onChunkUpsert} disableRipple>
                                <NoteAddIcon />
                                Upsert Chunks
                            </MenuItem>
                            <Divider sx={{ my: 0.5 }} />
                            <MenuItem onClick={props.onDeleteClick} disableRipple>
                                <FileDeleteIcon />
                                Delete
                            </MenuItem>
                        </StyledMenu>
                    </div>
                </StyledTableCell>
            </TableRow>
        </>
    )
}

LoaderRow.propTypes = {
    loader: PropTypes.any,
    index: PropTypes.number,
    open: PropTypes.bool,
    theme: PropTypes.any,
    onViewChunksClick: PropTypes.func,
    onEditClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onChunkUpsert: PropTypes.func
}
export default DocumentStoreDetails
