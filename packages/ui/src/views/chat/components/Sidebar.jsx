import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
    Box, 
    IconButton, 
    Tooltip, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Typography,
    Divider,
    Avatar,
    Badge,
    InputBase,
    Paper,
    ListItemButton,
    alpha,
    Menu,
    MenuItem
} from '@mui/material';
import { 
    IconLayoutDashboard, 
    IconPlus, 
    IconHome, 
    IconRefresh, 
    IconSettings,
    IconUser,
    IconSearch,
    IconBrandHipchat,
    IconMessage,
    IconChevronRight,
    IconClock,
    IconDotsVertical,
    IconShare,
    IconPencil,
    IconTrash
} from '@tabler/icons-react';
import { format } from 'date-fns';

import { effects } from '../utils/theme';
import { useChatSessions } from '../hooks';

/**
 * Sidebar component for the chat interface
 */
const Sidebar = ({ 
    onNewChat, 
    onHome, 
    onRefresh, 
    onSettings,
    chatSessions = [],
    activeChatId,
    onSelectChat
}) => {
    const [sessionsDialogOpen, setSessionsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    
    // Use the chat sessions hook
    const {
        sessions,
        isLoading,
        error,
        createSession,
        updateSession,
        deleteSession,
        shareSession,
        selectSession
    } = useChatSessions({
        onError: (err) => console.error('Chat sessions error:', err)
    });
    
    // Handle new chat button click
    const handleNewChatClick = () => {
        if (onNewChat) {
            onNewChat();
        }
    };
    
    // Handle session selection
    const handleSessionSelect = (sessionId) => {
        setSessionsDialogOpen(false);
        
        // Use the onSelectChat prop to navigate to the session
        if (onSelectChat) {
            onSelectChat(sessionId);
        } else {
            // Fallback to the hook's selectSession if onSelectChat is not provided
            selectSession(sessionId);
        }
    };
    
    // Handle session menu open
    const handleSessionMenuOpen = (event, sessionId) => {
        event.stopPropagation();
        setMenuAnchorEl(event.currentTarget);
        setSelectedSessionId(sessionId);
    };
    
    // Handle session menu close
    const handleSessionMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedSessionId(null);
    };
    
    // Handle session rename
    const handleSessionRename = () => {
        handleSessionMenuClose();
        // Implementation for renaming session
        const newTitle = prompt('Enter new chat title:', 
            sessions.find(s => s.id === selectedSessionId)?.title || '');
        
        if (newTitle && newTitle.trim()) {
            updateSession(selectedSessionId, { title: newTitle.trim() });
        }
    };
    
    // Handle session share
    const handleSessionShare = async () => {
        handleSessionMenuClose();
        
        try {
            const shareData = await shareSession(selectedSessionId);
            
            if (shareData && shareData.shareUrl) {
                // Copy to clipboard
                navigator.clipboard.writeText(shareData.shareUrl);
                alert('Share link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing session:', err);
        }
    };
    
    // Handle session delete
    const handleSessionDelete = () => {
        handleSessionMenuClose();
        
        if (confirm('Are you sure you want to delete this chat?')) {
            deleteSession(selectedSessionId);
        }
    };
    
    // Filter chat sessions based on search query
    const filteredSessions = sessions.filter(session => 
        session.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    width: '100%',
                    bgcolor: 'background.paper',
                    overflow: 'hidden'
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconBrandHipchat size={28} color="primary.main" />
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                ml: 1.5, 
                                fontWeight: 600,
                                fontSize: '1.1rem'
                            }}
                        >
                            AIRA Chat
                        </Typography>
                    </Box>
                    <Tooltip title="New Chat" placement="right">
                        <IconButton 
                            size="small" 
                            onClick={handleNewChatClick}
                            color="primary"
                            sx={{
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                                '&:hover': {
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                                }
                            }}
                        >
                            <IconPlus size={18} />
                        </IconButton>
                    </Tooltip>
                </Box>
                
                {/* Search */}
                <Box sx={{ p: 2 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: (theme) => 
                                theme.palette.mode === 'dark' 
                                    ? alpha(theme.palette.common.white, 0.05)
                                    : alpha(theme.palette.common.black, 0.03)
                        }}
                    >
                        <IconSearch size={18} color="text.secondary" />
                        <InputBase
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                ml: 1,
                                flex: 1,
                                fontSize: '0.875rem'
                            }}
                        />
                    </Paper>
                </Box>
                
                {/* Chat Sessions */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflow: 'auto',
                        px: 1
                    }}
                >
                    <List sx={{ py: 1 }}>
                        {isLoading ? (
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center',
                                    p: 2 
                                }}
                            >
                                <Typography variant="body2">Loading sessions...</Typography>
                            </Box>
                        ) : filteredSessions.length > 0 ? (
                            filteredSessions.map((session) => (
                                <ListItemButton
                                    key={session.id}
                                    selected={session.id === activeChatId}
                                    onClick={() => handleSessionSelect(session.id)}
                                    sx={{
                                        borderRadius: '8px',
                                        mb: 0.5,
                                        py: 1,
                                        '&.Mui-selected': {
                                            bgcolor: (theme) => 
                                                theme.palette.mode === 'dark' 
                                                    ? alpha(theme.palette.primary.main, 0.15)
                                                    : alpha(theme.palette.primary.main, 0.1),
                                            '&:hover': {
                                                bgcolor: (theme) => 
                                                    theme.palette.mode === 'dark' 
                                                        ? alpha(theme.palette.primary.main, 0.25)
                                                        : alpha(theme.palette.primary.main, 0.15),
                                            }
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <Avatar
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                bgcolor: (theme) => 
                                                    session.id === activeChatId
                                                        ? 'primary.main'
                                                        : theme.palette.mode === 'dark'
                                                            ? alpha(theme.palette.common.white, 0.1)
                                                            : alpha(theme.palette.common.black, 0.08),
                                                color: session.id === activeChatId ? 'white' : 'text.primary'
                                            }}
                                        >
                                            <IconMessage size={16} />
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography 
                                                variant="body2" 
                                                noWrap 
                                                sx={{ 
                                                    fontWeight: session.id === activeChatId ? 600 : 400,
                                                    color: session.id === activeChatId ? 'primary.main' : 'text.primary'
                                                }}
                                            >
                                                {session.title || 'Untitled Chat'}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box 
                                                sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}
                                            >
                                                <IconClock size={12} />
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        color: 'text.secondary',
                                                        fontSize: '0.7rem'
                                                    }}
                                                >
                                                    {format(new Date(session.createdAt), 'MMM d, yyyy')}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                    <Badge 
                                        badgeContent={session.messageCount} 
                                        color="primary"
                                        sx={{ mr: 1 }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleSessionMenuOpen(e, session.id)}
                                        sx={{
                                            opacity: 0.6,
                                            '&:hover': {
                                                opacity: 1
                                            }
                                        }}
                                    >
                                        <IconDotsVertical size={16} />
                                    </IconButton>
                                </ListItemButton>
                            ))
                        ) : (
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 200,
                                    opacity: 0.7
                                }}
                            >
                                <IconMessage size={40} stroke={1} />
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    {searchQuery ? 'No matching chats found' : 'No chat sessions yet'}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<IconPlus size={16} />}
                                    onClick={handleNewChatClick}
                                    sx={{ mt: 2 }}
                                >
                                    Start a new chat
                                </Button>
                            </Box>
                        )}
                    </List>
                </Box>
                
                {/* Footer */}
                <Box
                    sx={{
                        p: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Home">
                            <IconButton 
                                size="small" 
                                onClick={onHome}
                                sx={{
                                    bgcolor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? alpha(theme.palette.common.white, 0.05)
                                            : alpha(theme.palette.common.black, 0.03),
                                    '&:hover': {
                                        bgcolor: (theme) => 
                                            theme.palette.mode === 'dark' 
                                                ? alpha(theme.palette.common.white, 0.1)
                                                : alpha(theme.palette.common.black, 0.06),
                                    }
                                }}
                            >
                                <IconHome size={18} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Refresh">
                            <IconButton 
                                size="small" 
                                onClick={onRefresh}
                                sx={{
                                    bgcolor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? alpha(theme.palette.common.white, 0.05)
                                            : alpha(theme.palette.common.black, 0.03),
                                    '&:hover': {
                                        bgcolor: (theme) => 
                                            theme.palette.mode === 'dark' 
                                                ? alpha(theme.palette.common.white, 0.1)
                                                : alpha(theme.palette.common.black, 0.06),
                                    }
                                }}
                            >
                                <IconRefresh size={18} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Settings">
                            <IconButton 
                                size="small" 
                                onClick={onSettings}
                                sx={{
                                    bgcolor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? alpha(theme.palette.common.white, 0.05)
                                            : alpha(theme.palette.common.black, 0.03),
                                    '&:hover': {
                                        bgcolor: (theme) => 
                                            theme.palette.mode === 'dark' 
                                                ? alpha(theme.palette.common.white, 0.1)
                                                : alpha(theme.palette.common.black, 0.06),
                                    }
                                }}
                            >
                                <IconSettings size={18} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Profile">
                            <IconButton 
                                size="small"
                                sx={{
                                    bgcolor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? alpha(theme.palette.common.white, 0.05)
                                            : alpha(theme.palette.common.black, 0.03),
                                    '&:hover': {
                                        bgcolor: (theme) => 
                                            theme.palette.mode === 'dark' 
                                                ? alpha(theme.palette.common.white, 0.1)
                                                : alpha(theme.palette.common.black, 0.06),
                                    }
                                }}
                            >
                                <IconUser size={18} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>
            
            {/* Session Menu */}
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleSessionMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleSessionRename}>
                    <ListItemIcon>
                        <IconPencil size={18} />
                    </ListItemIcon>
                    <ListItemText>Rename</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleSessionShare}>
                    <ListItemIcon>
                        <IconShare size={18} />
                    </ListItemIcon>
                    <ListItemText>Share</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSessionDelete} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <IconTrash size={18} color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

Sidebar.propTypes = {
    onNewChat: PropTypes.func,
    onHome: PropTypes.func,
    onRefresh: PropTypes.func,
    onSettings: PropTypes.func,
    chatSessions: PropTypes.array,
    activeChatId: PropTypes.string,
    onSelectChat: PropTypes.func
};

export default Sidebar;
