import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Tooltip,
    alpha,
    Chip,
    Badge
} from '@mui/material';
import {
    IconDotsVertical,
    IconTrash,
    IconRefresh,
    IconSettings,
    IconDownload,
    IconShare,
    IconBrandHipchat,
    IconInfoCircle,
    IconBell,
    IconSearch,
    IconPencil,
    IconCheck
} from '@tabler/icons-react';

import { effects } from '../utils/theme';

/**
 * ChatHeader component displays the chat title and provides actions
 */
const ChatHeader = ({
    title = 'Chat',
    onClearChat,
    onResetChat,
    onExportChat,
    onShareChat,
    onOpenSettings,
    showSettings = true,
    showExport = true,
    showShare = true,
    showClear = true,
    showReset = true,
    customActions = []
}) => {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [clearDialogOpen, setClearDialogOpen] = useState(false);
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    
    // Handle menu open
    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };
    
    // Handle menu close
    const handleMenuClose = () => {
        setMenuAnchor(null);
    };
    
    // Handle clear chat
    const handleClearChat = () => {
        setClearDialogOpen(true);
        handleMenuClose();
    };
    
    // Handle reset chat
    const handleResetChat = () => {
        setResetDialogOpen(true);
        handleMenuClose();
    };
    
    // Handle export chat
    const handleExportChat = () => {
        if (onExportChat) {
            onExportChat();
        }
        handleMenuClose();
    };
    
    // Handle share chat
    const handleShareChat = () => {
        if (onShareChat) {
            onShareChat();
        }
        handleMenuClose();
    };
    
    // Handle open settings
    const handleOpenSettings = () => {
        if (onOpenSettings) {
            onOpenSettings();
        }
        handleMenuClose();
    };
    
    // Handle clear dialog confirm
    const handleClearDialogConfirm = () => {
        if (onClearChat) {
            onClearChat();
        }
        setClearDialogOpen(false);
    };
    
    // Handle reset dialog confirm
    const handleResetDialogConfirm = () => {
        if (onResetChat) {
            onResetChat();
        }
        setResetDialogOpen(false);
    };
    
    // Handle title edit
    const handleEditTitle = () => {
        setIsEditing(true);
    };
    
    // Handle title save
    const handleSaveTitle = () => {
        // In a real implementation, this would save the title
        setIsEditing(false);
    };
    
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    width: '100%'
                }}
            >
                {/* Left side - Title and logo */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isEditing ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                autoFocus
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    background: 'transparent',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    width: '200px',
                                    padding: '4px 8px',
                                    borderBottom: '1px solid',
                                    borderColor: 'divider'
                                }}
                                onBlur={handleSaveTitle}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveTitle();
                                    if (e.key === 'Escape') {
                                        setEditedTitle(title);
                                        setIsEditing(false);
                                    }
                                }}
                            />
                            <IconButton 
                                size="small" 
                                onClick={handleSaveTitle}
                                sx={{ ml: 0.5 }}
                            >
                                <IconCheck size={16} />
                            </IconButton>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography 
                                variant="subtitle1" 
                                fontWeight={600}
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        '& .edit-icon': {
                                            opacity: 1
                                        }
                                    }
                                }}
                                onClick={handleEditTitle}
                            >
                                {title}
                                <IconPencil 
                                    size={14} 
                                    className="edit-icon"
                                    style={{ 
                                        marginLeft: '4px', 
                                        opacity: 0,
                                        transition: 'opacity 0.2s ease'
                                    }} 
                                />
                            </Typography>
                        </Box>
                    )}
                </Box>
                
                {/* Right side - Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {/* Search button */}
                    <Tooltip title="Search in conversation">
                        <IconButton
                            size="small"
                            sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                    color: 'primary.main',
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
                                }
                            }}
                        >
                            <IconSearch size={20} />
                        </IconButton>
                    </Tooltip>
                    
                    {/* Notifications button */}
                    <Tooltip title="Notifications">
                        <IconButton
                            size="small"
                            sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                    color: 'primary.main',
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
                                }
                            }}
                        >
                            <Badge 
                                color="error" 
                                variant="dot"
                                sx={{ '& .MuiBadge-badge': { top: 2, right: 2 } }}
                            >
                                <IconBell size={20} />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    
                    {/* Info button */}
                    <Tooltip title="Conversation info">
                        <IconButton
                            size="small"
                            sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                    color: 'primary.main',
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
                                }
                            }}
                        >
                            <IconInfoCircle size={20} />
                        </IconButton>
                    </Tooltip>
                    
                    {/* Custom actions */}
                    {customActions.map((action, index) => (
                        <Tooltip key={index} title={action.tooltip || ''}>
                            <IconButton
                                onClick={action.onClick}
                                size="small"
                                sx={{ 
                                    color: 'text.secondary',
                                    '&:hover': {
                                        color: 'primary.main',
                                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
                                    }
                                }}
                            >
                                {action.icon}
                            </IconButton>
                        </Tooltip>
                    ))}
                    
                    {/* Menu button */}
                    <Tooltip title="More options">
                        <IconButton
                            onClick={handleMenuOpen}
                            size="small"
                            sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                    color: 'primary.main',
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
                                }
                            }}
                        >
                            <IconDotsVertical size={20} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            
            {/* Menu */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 200,
                        boxShadow: effects.shadows.lg,
                        borderRadius: '12px',
                        ...effects.glass.light
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {showSettings && (
                    <MenuItem onClick={handleOpenSettings} sx={{ py: 1, px: 2, gap: 1.5 }}>
                        <IconSettings size={18} />
                        <Typography variant="body2">Settings</Typography>
                    </MenuItem>
                )}
                
                {showExport && (
                    <MenuItem onClick={handleExportChat} sx={{ py: 1, px: 2, gap: 1.5 }}>
                        <IconDownload size={18} />
                        <Typography variant="body2">Export Chat</Typography>
                    </MenuItem>
                )}
                
                {(showClear || showReset) && <Divider sx={{ my: 1 }} />}
                
                {showReset && (
                    <MenuItem onClick={handleResetChat} sx={{ py: 1, px: 2, gap: 1.5 }}>
                        <IconRefresh size={18} />
                        <Typography variant="body2">Reset Chat</Typography>
                    </MenuItem>
                )}
                
                {showClear && (
                    <MenuItem onClick={handleClearChat} sx={{ py: 1, px: 2, gap: 1.5, color: 'error.main' }}>
                        <IconTrash size={18} />
                        <Typography variant="body2">Clear Chat</Typography>
                    </MenuItem>
                )}
            </Menu>
            
            {/* Clear dialog */}
            <Dialog
                open={clearDialogOpen}
                onClose={() => setClearDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        boxShadow: effects.shadows.lg,
                        maxWidth: '400px',
                        width: '100%'
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconTrash size={20} color="error" />
                        <Typography variant="h6">Clear Chat History</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'text.primary', opacity: 0.8 }}>
                        Are you sure you want to clear the chat history? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button 
                        onClick={() => setClearDialogOpen(false)}
                        variant="outlined"
                        sx={{ borderRadius: '8px' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleClearDialogConfirm} 
                        color="error" 
                        variant="contained"
                        sx={{ borderRadius: '8px' }}
                    >
                        Clear
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Reset dialog */}
            <Dialog
                open={resetDialogOpen}
                onClose={() => setResetDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        boxShadow: effects.shadows.lg,
                        maxWidth: '400px',
                        width: '100%'
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconRefresh size={20} color="primary" />
                        <Typography variant="h6">Reset Chat</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'text.primary', opacity: 0.8 }}>
                        Are you sure you want to reset the chat? This will clear the current conversation and start a new one.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button 
                        onClick={() => setResetDialogOpen(false)}
                        variant="outlined"
                        sx={{ borderRadius: '8px' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleResetDialogConfirm} 
                        color="primary" 
                        variant="contained"
                        sx={{ borderRadius: '8px' }}
                    >
                        Reset
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

ChatHeader.propTypes = {
    title: PropTypes.string,
    onClearChat: PropTypes.func,
    onResetChat: PropTypes.func,
    onExportChat: PropTypes.func,
    onShareChat: PropTypes.func,
    onOpenSettings: PropTypes.func,
    showSettings: PropTypes.bool,
    showExport: PropTypes.bool,
    showShare: PropTypes.bool,
    showClear: PropTypes.bool,
    showReset: PropTypes.bool,
    customActions: PropTypes.array
};

export default ChatHeader;
