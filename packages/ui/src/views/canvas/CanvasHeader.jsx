import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useRef, useState, useCallback } from 'react'

// material-ui
import { useTheme, alpha } from '@mui/material/styles'
import { 
    Box, 
    Typography, 
    Stack,
    IconButton,
    Fade,
    Tooltip,
    Popover,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    InputBase,
    ClickAwayListener,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material'

// icons
import { 
    IconChevronDown,
    IconNotification,
    IconSettings,
    IconBook,
    IconDeviceFloppy,
    IconArrowLeft,
    IconEdit,
    IconCheck,
    IconX,
    IconCloudCheck,
    IconCloudUpload,
    IconCopy,
    IconDownload,
    IconTrash,
    IconAdjustments,
    IconAlertTriangle,
    IconTemplate
} from '@tabler/icons-react'

// project imports
import Settings from '@/views/settings'
import SaveChatflowDialog from '@/ui-component/dialog/SaveChatflowDialog'
import agentsettings from '@/menu-items/agentsettings'
import APICodeDialog from '@/views/chatflows/APICodeDialog'
import ViewMessagesDialog from '@/ui-component/dialog/ViewMessagesDialog'
import ChatflowConfigurationDialog from '@/ui-component/dialog/ChatflowConfigurationDialog'
import UpsertHistoryDialog from '@/views/vectorstore/UpsertHistoryDialog'
import ViewLeadsDialog from '@/ui-component/dialog/ViewLeadsDialog'
import ExportAsTemplateDialog from '@/ui-component/dialog/ExportAsTemplateDialog'
import Logo from '@/ui-component/extended/Logo'

// API
import chatflowsApi from '@/api/chatflows'

// Hooks
import useApi from '@/hooks/useApi'

// utils
import { generateExportFlowData } from '@/utils/genericHelper'
import { uiBaseURL } from '@/store/constant'
import { closeSnackbar as closeSnackbarAction, enqueueSnackbar as enqueueSnackbarAction, SET_CHATFLOW, REMOVE_DIRTY } from '@/store/actions'

// ==============================|| CANVAS HEADER ||============================== //

const UnsavedChangesDialog = ({ open, onClose, onConfirm }) => {
    const theme = useTheme()
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    width: '400px'
                }
            }}
        >
            <DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconAlertTriangle size={24} color={theme.palette.warning.main} />
                Unsaved Changes
            </DialogTitle>
            <DialogContent>
                <Typography>
                    You have unsaved changes. Would you like to save them before leaving?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={() => onClose('discard')} color="error">Discard</Button>
                <Button onClick={onConfirm} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    )
}

// Dialog konfirmasi penghapusan
const DeleteConfirmDialog = ({ open, onClose, onConfirm, title }) => {
    const theme = useTheme()
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    width: '400px'
                }
            }}
        >
            <DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconAlertTriangle size={24} color={theme.palette.error.main} />
                {title || 'Confirm Delete'}
            </DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete this {title}? This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={onConfirm} color="error" variant="contained">Delete</Button>
            </DialogActions>
        </Dialog>
    )
}

const CanvasHeader = ({ isAgentCanvas, handleSaveFlow, handleDeleteFlow, handleLoadFlow, handleSaveTemplate }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const flowNameRef = useRef()
    const settingsRef = useRef()
    const inputFile = useRef()
    const [anchorEl, setAnchorEl] = useState(null)
    const [settingsAnchorEl, setSettingsAnchorEl] = useState(null)

    const [isEditingFlowName, setEditingFlowName] = useState(false)
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
    const [lastSaveTime, setLastSaveTime] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [pendingNavigation, setPendingNavigation] = useState(null)

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const title = isAgentCanvas ? 'Agents' : 'Chatflow'
    const updateChatflowApi = useApi(chatflowsApi.updateChatflow)
    const canvas = useSelector((state) => state.canvas)

    // Get settings menu items from agentsettings
    const getSettingsItems = () => {
        // Always use agent_settings menu items for both canvas types
        return agentsettings.children.map(item => {
            let icon = null;
            if (item.icon) {
                const Icon = item.icon;
                // Gunakan ukuran icon yang konsisten tanpa hardcoding warna khusus
                icon = <Icon size={20} />;
            }
            
            return {
                icon: icon,
                label: item.title,
                onClick: () => onSettingsItemClick(item.id),
                // Tidak perlu hardcoding warna untuk item delete
                color: undefined
            };
        });
    };
    
    const settingsItems = getSettingsItems();

    // Autosave functionality with better feedback
    const autoSave = useCallback(() => {
        if (canvas.chatflow?.id && canvas.isDirty) {
            setIsSaving(true)
            handleSaveFlow(canvas.chatflow.name)
            setTimeout(() => {
                setIsSaving(false)
                setLastSaveTime(new Date())
                enqueueSnackbar({
                    message: 'Changes saved automatically',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        autoHideDuration: 1000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'center',
                        }
                    }
                })
            }, 1000)
        }
    }, [canvas.chatflow, canvas.isDirty, handleSaveFlow, enqueueSnackbar])

    useEffect(() => {
        const interval = setInterval(autoSave, 30000) // Autosave every 30 seconds if dirty
        return () => clearInterval(interval)
    }, [autoSave])

    const handleBack = () => {
        if (canvas.isDirty) {
            setShowUnsavedDialog(true)
            setPendingNavigation(() => () => {
                if (window.history.state && window.history.state.idx > 0) {
                    navigate(-1)
                } else {
                    navigate('/', { replace: true })
                }
            })
        } else {
            if (window.history.state && window.history.state.idx > 0) {
                navigate(-1)
            } else {
                navigate('/', { replace: true })
            }
        }
    }

    const handleUnsavedDialogClose = (action) => {
        setShowUnsavedDialog(false)
        if (action === 'discard') {
            dispatch({ type: REMOVE_DIRTY })
            if (pendingNavigation) {
                pendingNavigation()
            }
        }
    }

    const handleUnsavedDialogConfirm = () => {
        if (canvas.chatflow?.id) {
            handleSaveFlow(canvas.chatflow.name)
            setShowUnsavedDialog(false)
            if (pendingNavigation) {
                setTimeout(() => pendingNavigation(), 500)
            }
        }
    }

    const handleDeleteDialogClose = () => {
        setShowDeleteDialog(false)
    }

    const handleDeleteDialogConfirm = () => {
        if (canvas.chatflow?.id) {
            handleDeleteFlow()
            setShowDeleteDialog(false)
        }
    }

    const onSettingsItemClick = (setting) => {
        setSettingsAnchorEl(null)
        setSettingsOpen(false)
        setAnchorEl(null)

        if (setting === 'deleteChatflow') {
            if (canvas.chatflow?.id) {
                // Tampilkan dialog konfirmasi sebelum menghapus
                setShowDeleteDialog(true)
            }
        } else if (setting === 'chatflowConfiguration') {
            setChatflowConfigurationDialogProps({
                title: `${title} Configuration`,
                chatflow: canvas.chatflow
            })
            setChatflowConfigurationDialogOpen(true)
        } else if (setting === 'duplicateChatflow') {
            try {
                // Check if canvas.chatflow exists before accessing its properties
                if (!canvas.chatflow || !canvas.chatflow.flowData) {
                    enqueueSnackbar({
                        message: 'No chatflow data available to duplicate',
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'error',
                            persist: true,
                            action: (key) => (
                                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                                    <IconX />
                                </IconButton>
                            )
                        }
                    })
                    return
                }
                
                let flowData = canvas.chatflow.flowData
                const parsedFlowData = JSON.parse(flowData)
                flowData = JSON.stringify(parsedFlowData)
                localStorage.setItem('duplicatedFlowData', flowData)
                
                // Use navigate instead of window.open to avoid login issues
                navigate(`/${isAgentCanvas ? 'agentcanvas' : 'canvas'}`)
            } catch (e) {
                console.error(e)
                enqueueSnackbar({
                    message: 'Error duplicating chatflow: ' + e.message,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        action: (key) => (
                            <IconButton size="small" onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </IconButton>
                        )
                    }
                })
            }
        } else if (setting === 'exportChatflow') {
            try {
                const flowData = JSON.parse(canvas.chatflow.flowData)
                let dataStr = JSON.stringify(generateExportFlowData(flowData), null, 2)
                const blob = new Blob([dataStr], { type: 'application/json' })
                const dataUri = URL.createObjectURL(blob)
                let exportFileDefaultName = `${canvas.chatflow.name} ${title}.json`
                let linkElement = document.createElement('a')
                linkElement.setAttribute('href', dataUri)
                linkElement.setAttribute('download', exportFileDefaultName)
                linkElement.click()
            } catch (e) {
                console.error(e)
            }
        } else if (setting === 'saveAsTemplate') {
            if (canvas.isDirty) {
                enqueueSnackbar({
                    message: 'Please save the flow before saving as template',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        action: (key) => (
                            <IconButton size="small" onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </IconButton>
                        )
                    }
                })
                return
            }
            // Open the export as template dialog
            setExportAsTemplateDialogProps({
                title: 'Save As Template',
                chatflow: canvas.chatflow
            })
            setExportAsTemplateDialogOpen(true)
        } else if (setting === 'viewMessages') {
            setViewMessagesDialogProps({
                title: 'View Messages',
                chatflow: canvas.chatflow
            })
            setViewMessagesDialogOpen(true)
        } else if (setting === 'viewLeads') {
            setViewLeadsDialogProps({
                title: 'View Leads',
                chatflow: canvas.chatflow
            })
            setViewLeadsDialogOpen(true)
        } else if (setting === 'upsertHistory') {
            setUpsertHistoryDialogProps({
                title: 'Upsert History',
                chatflow: canvas.chatflow
            })
            setUpsertHistoryDialogOpen(true)
        } else if (setting === 'loadChatflow') {
            if (inputFile && inputFile.current) {
                inputFile.current.click()
            }
        }
    }

    const onUploadFile = (file) => {
        setSettingsOpen(false)
        handleLoadFlow(file)
    }

    // Fungsi untuk menangani submit nama flow
    // Gunakan ref untuk melacak apakah sedang dalam proses submit
    const isSubmittingRef = useRef(false)

    const submitFlowName = () => {
        // Jika sudah dalam proses submit, jangan lakukan apa-apa
        if (isSubmittingRef.current) return
        
        // Tandai bahwa sedang dalam proses submit
        isSubmittingRef.current = true
        
        // Simpan nilai input sebelum menutup mode edit
        const newName = flowNameRef.current ? flowNameRef.current.value.trim() : ''
        
        // Hentikan mode edit terlebih dahulu untuk mencegah loop
        setEditingFlowName(false)
        
        if (!canvas.chatflow?.id || !flowNameRef.current) {
            enqueueSnackbar({
                message: 'Cannot update name: chatflow not available',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    autoHideDuration: 3000
                }
            })
            // Reset flag submit
            isSubmittingRef.current = false
            return
        }
        
        if (!newName) {
            enqueueSnackbar({
                message: 'Chatflow name cannot be empty',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'warning',
                    autoHideDuration: 3000
                }
            })
            // Reset flag submit
            isSubmittingRef.current = false
            return
        }
        
        if (newName === canvas.chatflow.name) {
            // Reset flag submit
            isSubmittingRef.current = false
            return // Tidak ada perubahan, tidak perlu update
        }
        
        const updateBody = {
            name: newName
        }
        
        // Gunakan setTimeout untuk memastikan state sudah diperbarui
        setTimeout(() => {
            updateChatflowApi.request(canvas.chatflow.id, updateBody)
                .finally(() => {
                    // Reset flag submit setelah API call selesai
                    isSubmittingRef.current = false
                })
        }, 0)
    }

    const onAPIDialogClick = () => {
        let isFormDataRequired = false
        let isSessionMemory = false
        try {
            const flowData = JSON.parse(canvas.chatflow.flowData)
            const nodes = flowData.nodes
            for (const node of nodes) {
                if (node.data.inputParams.find((param) => param.type === 'file')) {
                    isFormDataRequired = true
                }
                if (node.data.inputParams.find((param) => param.name === 'sessionId')) {
                    isSessionMemory = true
                }
                if (isFormDataRequired && isSessionMemory) break
            }
        } catch (e) {
            console.error(e)
        }

        setAPIDialogProps({
            title: 'Embed in website or use as API',
            chatflowid: canvas.chatflow.id,
            chatflowApiKeyId: canvas.chatflow.apikeyid,
            isFormDataRequired,
            isSessionMemory,
            isAgentCanvas
        })
        setAPIDialogOpen(true)
    }

    const onSaveChatflowClick = () => {
        setIsSaving(true)
        if (canvas.chatflow?.id) {
            handleSaveFlow(canvas.chatflow.name)
            setLastSaveTime(new Date())
        } else {
            setFlowDialogOpen(true)
        }
        setTimeout(() => {
            setIsSaving(false)
        }, 1000)
    }

    const onConfirmSaveName = (flowName) => {
        setFlowDialogOpen(false)
        handleSaveFlow(flowName)
        setFlowName(flowName)
        setLastSaveTime(new Date())
    }

    // Ref untuk melacak apakah notifikasi sudah ditampilkan
    const notificationShownRef = useRef(false)
    
    // Efek untuk menangani respons API update chatflow
    useEffect(() => {
        // Hanya jalankan ketika ada data baru dan notifikasi belum ditampilkan
        if (updateChatflowApi.data && !notificationShownRef.current) {
            // Tandai bahwa notifikasi sudah ditampilkan
            notificationShownRef.current = true
            
            // Update state dengan data baru
            setFlowName(updateChatflowApi.data.name)
            
            // Gunakan setTimeout untuk menunda dispatch action
            setTimeout(() => {
                dispatch({ type: SET_CHATFLOW, chatflow: updateChatflowApi.data })
                setLastSaveTime(new Date())
                
                // Tampilkan notifikasi sukses
                enqueueSnackbar({
                    message: 'Chatflow name updated successfully',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        autoHideDuration: 3000
                    }
                })
                
                // Reset flag notifikasi setelah beberapa saat
                setTimeout(() => {
                    notificationShownRef.current = false
                }, 1000)
            }, 0)
        } else if (updateChatflowApi.error) {
            // Tampilkan notifikasi error
            enqueueSnackbar({
                message: 'Failed to update chatflow: ' + 
                    (updateChatflowApi.error.response?.data?.message || updateChatflowApi.error.message || 'Unknown error'),
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <IconButton size="small" onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </IconButton>
                    )
                }
            })
        }
    }, [updateChatflowApi.data, updateChatflowApi.error, dispatch, enqueueSnackbar, closeSnackbar])

    useEffect(() => {
        if (canvas.chatflow) {
            setFlowName(canvas.chatflow.name)
            if (chatflowConfigurationDialogOpen) {
                setChatflowConfigurationDialogProps({
                    title: `${title} Configuration`,
                    chatflow: canvas.chatflow
                })
            }
        }
    }, [canvas.chatflow, title, chatflowConfigurationDialogOpen])

    return (
        <>
            <Box sx={{ 
                width: '100%', 
                height: '56px', 
                background: theme.palette.mode === 'dark' 
                    ? theme.palette.background.paper
                    : '#f8f9fa',
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                transition: 'all 0.3s ease',
                position: 'fixed',
                zIndex: 1100,
                left: 0,
                right: 0,
                top: 0,
                margin: 0
            }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                    {/* Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Logo type="blue" />
                    </Box>
                    
                    {/* Left side */}
                    <Tooltip title="Back">
                        <IconButton 
                            size="small"
                            onClick={handleBack}
                            className="slide-in"
                            sx={{
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    transform: 'translateX(-2px)'
                                }
                            }}
                        >
                            <IconArrowLeft size={20} style={{ color: theme.palette.text.primary }} />
                        </IconButton>
                    </Tooltip>

                    <Typography variant="body2" color="text.primary" sx={{ opacity: 0.9 }}>
                        My Projects
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ opacity: 0.9 }}>
                        /
                    </Typography>

                    {!isEditingFlowName ? (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography
                                sx={{
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: theme.palette.text.primary,
                                    fontWeight: 500
                                }}
                            >
                                {canvas.isDirty && <strong style={{ color: '#ffcc00' }}>*</strong>}
                                {canvas.chatflow?.name || title}
                            </Typography>
                                <Tooltip title="Edit Name">
                                    <IconButton 
                                        size="small" 
                                        aria-label="Edit Name"
                                        onClick={() => {
                                            // Jika sedang dalam proses submit, jangan aktifkan mode edit
                                            if (!isEditingFlowName && !isSubmittingRef.current) {
                                                setEditingFlowName(true);
                                            }
                                        }}
                                        sx={{ 
                                            ml: 0.5,
                                            color: theme.palette.text.secondary,
                                            '&:hover': {
                                                color: theme.palette.primary.main
                                            }
                                        }}
                                    >
                                        <IconEdit size={16} style={{ color: theme.palette.text.primary }} />
                                    </IconButton>
                                </Tooltip>
                        </Stack>
                    ) : (
                        <ClickAwayListener 
                            mouseEvent="onMouseDown"
                            touchEvent="onTouchStart"
                            onClickAway={() => {
                                if (isEditingFlowName) {
                                    setEditingFlowName(false);
                                }
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <InputBase
                                    inputRef={flowNameRef}
                                    defaultValue={canvas.chatflow?.name}
                                    sx={{
                                        fontSize: '0.875rem',
                                        color: theme.palette.text.primary,
                                        width: '200px',
                                        '& .MuiInputBase-input': {
                                            padding: '2px 4px',
                                            borderRadius: 1,
                                            backgroundColor: theme.palette.background.default,
                                            transition: theme.transitions.create(['border-color', 'box-shadow']),
                                            '&:focus': {
                                                boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                                            },
                                        },
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') submitFlowName()
                                        if (e.key === 'Escape') setEditingFlowName(false)
                                    }}
                                    autoFocus
                                />
                                <Tooltip title="Save Name">
                                    <IconButton 
                                        size="small"
                                        aria-label="Save Name"
                                        onClick={() => {
                                            // Jika sedang dalam proses submit, jangan lakukan apa-apa
                                            if (isEditingFlowName && flowNameRef.current && !isSubmittingRef.current) {
                                                submitFlowName();
                                            }
                                        }}
                                        sx={{ color: theme.palette.success.main }}
                                    >
                                        <IconCheck size={16} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancel">
                                    <IconButton 
                                        size="small"
                                        aria-label="Cancel"
                                        onClick={() => {
                                            // Jika sedang dalam proses submit, jangan lakukan apa-apa
                                            if (isEditingFlowName && !isSubmittingRef.current) {
                                                setEditingFlowName(false);
                                            }
                                        }}
                                        sx={{ color: theme.palette.error.main }}
                                    >
                                        <IconX size={16} />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </ClickAwayListener>
                    )}

                    {/* Middle */}
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {/* Run & API Buttons */}
                        <Box sx={{ 
                            display: 'flex', 
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            overflow: 'hidden'
                        }}>
                            <Button
                                startIcon={<IconDeviceFloppy size={18} />}
                                sx={{
                                    py: 0.5,
                                    px: 2,
                                    borderRadius: '8px 0 0 8px',
                                    borderRight: '1px solid #e0e0e0',
                                    backgroundColor: '#fff',
                                    color: theme.palette.text.primary,
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    }
                                }}
                                onClick={onSaveChatflowClick}
                            >
                                Playground
                            </Button>
                            <Button
                                startIcon={<IconDeviceFloppy size={18} />}
                                sx={{
                                    py: 0.5,
                                    px: 2,
                                    borderRadius: '0 8px 8px 0',
                                    backgroundColor: '#fff',
                                    color: theme.palette.text.primary,
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    }
                                }}
                                onClick={onAPIDialogClick}
                            >
                                API
                            </Button>
                        </Box>

                        {/* Saving indicator */}
                        <Box sx={{ position: 'absolute', right: '50%', transform: 'translateX(50%)' }}>
                            {isSaving ? (
                                <Fade in={isSaving} timeout={{ enter: 800, exit: 200 }}>
                                    <Box sx={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        color: theme.palette.primary.main
                                    }}>
                                        <IconCloudUpload size={18} className="saving-icon" />
                                        <Typography variant="caption">Saving...</Typography>
                                    </Box>
                                </Fade>
                            ) : (
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    {canvas.isDirty ? (
                                        <Tooltip title="Save Changes">
                                            <IconButton
                                                size="small"
                                                onClick={onSaveChatflowClick}
                                                color="warning"
                                            >
                                                <IconDeviceFloppy size={18} />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title={lastSaveTime ? `Last saved at ${lastSaveTime.toLocaleTimeString()}` : 'Not saved yet'}>
                                            <IconButton
                                                size="small"
                                                sx={{ color: theme.palette.success.main }}
                                            >
                                                <IconCloudCheck size={18} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Stack>
                            )}
                        </Box>
                    </Box>

                    {/* Right side */}
                    <Stack direction="row" spacing={0.5} alignItems="center" className="fade-in">
                        {canvas.chatflow?.id && (
                            <Tooltip title="Notifications">
                                <IconButton 
                                    size="small"
                                    sx={{
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    <IconNotification size={18} style={{ color: theme.palette.text.primary }} />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Documentation">
                            <IconButton 
                                size="small"
                                sx={{
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <IconBook size={18} style={{ color: theme.palette.text.primary }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Settings">
                            <IconButton 
                                size="small"
                                onClick={(e) => setSettingsAnchorEl(e.currentTarget)}
                                className="pulse-effect"
                                sx={{
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <IconSettings size={18} style={{ color: theme.palette.text.primary }} />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
            </Box>

            <style jsx global>{`
                @keyframes saving {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    50% { transform: translateY(-3px) scale(1.1); opacity: 0.8; }
                    100% { transform: translateY(0) scale(1); opacity: 1; }
                }
                
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(43, 99, 217, 0.4); }
                    70% { box-shadow: 0 0 0 6px rgba(43, 99, 217, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(43, 99, 217, 0); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slideIn {
                    from { transform: translateX(-20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                .saving-icon {
                    animation: saving 1.2s ease-in-out infinite;
                }
                
                .pulse-effect {
                    animation: pulse 2s infinite;
                }
                
                .fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                
                .slide-in {
                    animation: slideIn 0.3s ease-out forwards;
                }
            `}</style>

            <Popover
                open={Boolean(settingsAnchorEl)}
                anchorEl={settingsAnchorEl}
                onClose={() => setSettingsAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
            >
                <List sx={{ width: 200, py: 0.5 }}>
                    {settingsItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={item.onClick}>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.label} 
                                    sx={{ 
                                        color: item.color,
                                        '& .MuiTypography-root': {
                                            fontSize: '0.875rem'
                                        }
                                    }} 
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Popover>

            <UnsavedChangesDialog 
                open={showUnsavedDialog}
                onClose={handleUnsavedDialogClose}
                onConfirm={handleUnsavedDialogConfirm}
            />

            <DeleteConfirmDialog 
                open={showDeleteDialog}
                onClose={handleDeleteDialogClose}
                onConfirm={handleDeleteDialogConfirm}
                title={title}
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
            {apiDialogOpen && (
                <APICodeDialog 
                    show={apiDialogOpen} 
                    dialogProps={apiDialogProps} 
                    onCancel={() => setAPIDialogOpen(false)} 
                />
            )}
            <ViewMessagesDialog
                show={viewMessagesDialogOpen}
                dialogProps={viewMessagesDialogProps}
                onCancel={() => setViewMessagesDialogOpen(false)}
            />
            <ViewLeadsDialog 
                show={viewLeadsDialogOpen} 
                dialogProps={viewLeadsDialogProps} 
                onCancel={() => setViewLeadsDialogOpen(false)} 
            />
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
            
            {/* Hidden file input for loadChatflow */}
            <input
                type='file'
                hidden
                accept='.json'
                ref={inputFile}
                style={{ display: 'none' }}
                onChange={(e) => {
                    if (!e.target.files) return;
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        if (!evt?.target?.result) return;
                        handleLoadFlow(evt.target.result);
                    };
                    reader.readAsText(file);
                    e.target.value = ''; // Reset input
                }}
            />
        </>
    )
}

CanvasHeader.propTypes = {
    isAgentCanvas: PropTypes.bool,
    handleSaveFlow: PropTypes.func.isRequired,
    handleDeleteFlow: PropTypes.func.isRequired,
    handleLoadFlow: PropTypes.func.isRequired,
    handleSaveTemplate: PropTypes.func.isRequired
}

export default CanvasHeader
