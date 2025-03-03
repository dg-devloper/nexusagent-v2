import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
    Box, 
    Paper, 
    ThemeProvider, 
    CssBaseline, 
    CircularProgress, 
    Snackbar, 
    Alert,
    Drawer,
    useMediaQuery,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
    IconMenu2, 
    IconX,
    IconBrandHipchat
} from '@tabler/icons-react';

// Import components
import {
    ChatHeader,
    ChatInput,
    Sidebar,
    WelcomeScreen
} from './components';
import MessageList from './components/VirtualizedMessageList';

// Import hooks
import { useChat, useChatSessions } from './hooks';

// Import utilities
import { createAppTheme } from './utils/theme';
import { validateFileUpload, validateSessionId } from './utils/validation';
import { sanitizeInput, createDebouncedHandler } from './utils/optimizations';
import chatmessageApi from '@/api/chatmessage';

/**
 * Chat component is the main component for the chat interface
 */
const Chat = ({
    chatflowid: propChatflowid,
    initialMessages = [],
    title = 'AI Assistant',
    darkMode = false,
    showAgentReasoning = true,
    allowFiles = true,
    allowImages = true,
    allowVoice = true,
    showSettings = true,
    showExport = true,
    showShare = true,
    showClear = true,
    showReset = true,
    customActions = [],
    onError,
    onMessageStart,
    onMessageComplete,
    onMessageUpdate,
    onStreamStart,
    onStreamEnd
}) => {
    // Get predictionId from URL params
    const { predictionId, chatflowid: urlChatflowid } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Use predictionId or chatflowid from URL if provided, otherwise use prop
    const chatflowid = predictionId || urlChatflowid || propChatflowid;
    
    // Get sessionId from URL query params
    const urlSessionId = searchParams.get('sessionId');
    const validSessionId = useMemo(() => validateSessionId(urlSessionId), [urlSessionId]);
    
    // State for snackbar
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    
    // Use chat sessions hook
    const {
        sessions: chatSessions,
        isLoading: isSessionsLoading,
        error: sessionsError,
        createSession,
        updateSession,
        deleteSession,
        selectSession,
        fetchSessions
    } = useChatSessions({
        onError: (err) => {
            console.error('Chat sessions error:', err);
            setSnackbar({
                open: true,
                message: `Error loading chat sessions: ${err.message}`,
                severity: 'error'
            });
        }
    });
    
    // State for active chat
    const [hasActiveChat, setHasActiveChat] = useState(Boolean(chatflowid));
    
    // State for mobile drawer
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    
    // Create theme
    const theme = createAppTheme(darkMode ? 'dark' : 'light');
    
    // File upload state
    const [previews, setPreviews] = useState([]);
    
    // Voice recording state
    const [isRecording, setIsRecording] = useState(false);
    
    // Message input state
    const [messageInput, setMessageInput] = useState('');
    
    // Loading state for chat history
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    
    // Create refs
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Use regular chat hook for backend connection
    const {
        messages,
        setMessages,
        isLoading,
        isStreaming,
        error,
        sendMessage,
        clearChat,
        abortMessage,
        getPreviousInput,
        getNextInput,
        fetchChatHistory,
        sessionId
    } = useChat(chatflowid, {
        initialMessages,
        onError,
        onMessageStart,
        onMessageComplete,
        onMessageUpdate,
        onStreamStart,
        onStreamEnd,
        autoFocus: true,
        enableHistory: true,
        predictionId: predictionId,
        sessionId: validSessionId
    });
    
    // Custom handleActionClick function that includes sessionId
    const handleActionClick = useCallback((element, action) => {
        // Create message with the action label
        const content = element.label;
        
        // Add action to request and sessionId
        const options = { 
            action,
            sessionId
        };
        
        // Send message
        return sendMessage(content, [], options);
    }, [sendMessage, sessionId]);
    
    // Handle message input change
    const handleMessageInputChange = useCallback((e) => {
        setMessageInput(sanitizeInput(e.target.value));
    }, []);
    
    // Handle message send
    const handleSendMessage = useCallback(() => {
        if (messageInput.trim() || previews.length > 0) {
            // Create file uploads from previews
            const fileUploads = previews.map(preview => ({
                data: preview.data,
                type: preview.type,
                name: preview.name,
                mime: preview.mime
            }));
            
            // Send message with sessionId
            const options = {
                sessionId
            };
            
            // Send message
            sendMessage(messageInput, fileUploads, options);
            
            // Clear input and previews
            setMessageInput('');
            setPreviews([]);
        }
    }, [messageInput, previews, sendMessage, sessionId]);
    
    // Handle key down
    const handleKeyDown = useCallback((e) => {
        // Check if IME composition is in progress
        const isIMEComposition = e.isComposing || e.keyCode === 229;
        
        if (e.key === 'ArrowUp' && !isIMEComposition) {
            e.preventDefault();
            const previousInput = getPreviousInput(messageInput);
            setMessageInput(previousInput);
        } else if (e.key === 'ArrowDown' && !isIMEComposition) {
            e.preventDefault();
            const nextInput = getNextInput();
            setMessageInput(nextInput);
        } else if (e.key === 'Enter' && messageInput && !isIMEComposition) {
            if (!e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
        }
    }, [messageInput, getPreviousInput, getNextInput, handleSendMessage]);
    
    // Handle file upload with validation
    const handleFileUpload = useCallback((files) => {
        // Process files
        const filePromises = Array.from(files).map(file => {
            // Validate file
            const validation = validateFileUpload(file, {
                maxSizeMB: 10,
                allowedTypes: null
            });
            
            if (!validation.valid) {
                setSnackbar({
                    open: true,
                    message: validation.errors.join(', '),
                    severity: 'error'
                });
                return null;
            }
            
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve({
                        id: uuidv4(),
                        data: e.target.result,
                        preview: URL.createObjectURL(file),
                        type: 'file',
                        name: file.name,
                        mime: file.type
                    });
                };
                reader.readAsDataURL(file);
            });
        });
        
        // Add files to previews
        Promise.all(filePromises).then(newFiles => {
            // Filter out null values (failed validations)
            const validFiles = newFiles.filter(file => file !== null);
            if (validFiles.length > 0) {
                setPreviews(prev => [...prev, ...validFiles]);
            }
        });
    }, []);
    
    // Handle image upload with validation
    const handleImageUpload = useCallback((files) => {
        // Process images
        const imagePromises = Array.from(files).map(file => {
            // Validate file
            const validation = validateFileUpload(file, {
                maxSizeMB: 5,
                allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            });
            
            if (!validation.valid) {
                setSnackbar({
                    open: true,
                    message: validation.errors.join(', '),
                    severity: 'error'
                });
                return null;
            }
            
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve({
                        id: uuidv4(),
                        data: e.target.result,
                        preview: URL.createObjectURL(file),
                        type: 'image',
                        name: file.name,
                        mime: file.type
                    });
                };
                reader.readAsDataURL(file);
            });
        });
        
        // Add images to previews
        Promise.all(imagePromises).then(newImages => {
            // Filter out null values (failed validations)
            const validImages = newImages.filter(image => image !== null);
            if (validImages.length > 0) {
                setPreviews(prev => [...prev, ...validImages]);
            }
        });
    }, []);
    
    // Handle voice record
    const handleVoiceRecord = useCallback(() => {
        setIsRecording(true);
        // In a real implementation, this would start recording
    }, []);
    
    // Handle cancel recording
    const handleCancelRecording = useCallback(() => {
        setIsRecording(false);
        // In a real implementation, this would cancel recording
    }, []);
    
    // Handle stop recording
    const handleStopRecording = useCallback(() => {
        setIsRecording(false);
        // In a real implementation, this would stop recording and process the audio
        
        // Simulate adding an audio file
        const audioPreview = {
            id: uuidv4(),
            data: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
            preview: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
            type: 'audio',
            name: `audio_${Date.now()}.wav`,
            mime: 'audio/wav'
        };
        
        setPreviews(prev => [...prev, audioPreview]);
    }, []);
    
    // Handle delete preview
    const handleDeletePreview = useCallback((preview) => {
        // Revoke object URL to avoid memory leaks
        if (preview.preview) {
            URL.revokeObjectURL(preview.preview);
        }
        
        // Remove preview
        setPreviews(prev => prev.filter(p => p.id !== preview.id));
    }, []);
    
    // Handle message edit
    const handleMessageEdit = useCallback((message) => {
        setMessageInput(message.content);
        inputRef.current?.focus();
    }, []);
    
    // Handle message copy
    const handleMessageCopy = useCallback((content) => {
        // In a real implementation, this might show a notification
        setSnackbar({
            open: true,
            message: 'Copied to clipboard',
            severity: 'success'
        });
    }, []);
    
    // Function to manually trigger session refresh
    const refreshSessions = useCallback(() => {
        fetchSessions();
    }, [fetchSessions]);

    // Handle new chat
    const handleNewChat = useCallback(async () => {
        try {
            // Generate new sessionId first
            const newSessionId = uuidv4();
            
            // Create new session with the generated sessionId
            const session = await createSession('New Chat', newSessionId);
            
            if (!session) {
                throw new Error('Failed to create session');
            }
            
            setHasActiveChat(true);
            
            // Navigate to the new session using the generated sessionId
            navigate(`/chat-ai/${chatflowid}?sessionId=${newSessionId}`);
            
            // Clear chat for new session
            await clearChat();
            
            // Show snackbar
            setSnackbar({
                open: true,
                message: `New chat session created: ${session.title}`,
                severity: 'success'
            });
            
            // Close drawer on mobile
            if (isMobile) {
                setDrawerOpen(false);
            }
            
            // Refresh sessions list
            refreshSessions();
            
        } catch (err) {
            console.error('Error creating new chat:', err);
            setSnackbar({
                open: true,
                message: 'Failed to create new chat',
                severity: 'error'
            });
        }
    }, [chatflowid, createSession, isMobile, navigate, refreshSessions, clearChat]);
    
    // Handle home button click
    const handleHomeClick = useCallback(() => {
        setHasActiveChat(false);
        
        // Close drawer on mobile
        if (isMobile) {
            setDrawerOpen(false);
        }
    }, [isMobile]);
    
    // Handle refresh button click
    const handleRefreshClick = useCallback(() => {
        window.location.reload();
    }, []);
    
    // Handle settings button click
    const handleSettingsClick = useCallback(() => {
        // Show snackbar
        setSnackbar({
            open: true,
            message: 'Settings feature coming soon',
            severity: 'info'
        });
        
        // Close drawer on mobile
        if (isMobile) {
            setDrawerOpen(false);
        }
    }, [isMobile]);
    
    // Handle select chat
    const handleSelectChat = useCallback(async (selectedSessionId) => {
        // Find the session in the chat sessions
        const session = chatSessions.find(s => s.id === selectedSessionId);
        
        if (session) {
            try {
                // Set loading state
                setIsHistoryLoading(true);
                
                // Fetch chat history first
                const params = {
                    sessionId: selectedSessionId,
                    order: 'ASC',
                    feedback: true
                };
                
                const response = await chatmessageApi.getChatmessageFromPK(chatflowid, params);
                
                if (response.data) {
                    // Format messages
                    const formattedMessages = response.data.map(message => ({
                        id: message.id,
                        role: message.role === 'apiMessage' ? 'assistant' : 'user',
                        content: message.content,
                        timestamp: message.createdDate,
                        sourceDocuments: message.sourceDocuments,
                        usedTools: message.usedTools,
                        fileAnnotations: message.fileAnnotations,
                        agentReasoning: message.agentReasoning,
                        action: message.action,
                        artifacts: message.artifacts,
                        fileUploads: message.fileUploads,
                        sessionId: message.sessionId
                    }));

                    // Clear current messages and set new ones
                    setMessages(formattedMessages);

                    // Update state and navigate
                    setHasActiveChat(true);
                    navigate(`/chat-ai/${chatflowid}?sessionId=${selectedSessionId}`, {
                        replace: true // Replace current history entry to prevent navigation issues
                    });
                    
                    // Show success message
                    setSnackbar({
                        open: true,
                        message: `Loaded chat session: ${session.title || 'Untitled Chat'}`,
                        severity: 'success'
                    });
                    
                    // Close drawer on mobile
                    if (isMobile) {
                        setDrawerOpen(false);
                    }
                    
                    // Scroll to bottom after a short delay to ensure rendering
                    setTimeout(() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            } catch (err) {
                console.error('Error loading chat history:', err);
                setSnackbar({
                    open: true,
                    message: 'Error loading chat history',
                    severity: 'error'
                });
            } finally {
                setIsHistoryLoading(false);
            }
        }
    }, [chatflowid, chatSessions, isMobile, navigate, setMessages, fetchChatHistory, messagesEndRef]);
    
    // Handle prompt selection
    const handlePromptSelect = useCallback(async (prompt) => {
        if (prompt.id === 'prompt-library') {
            // Show snackbar
            setSnackbar({
                open: true,
                message: 'Prompt library feature coming soon',
                severity: 'info'
            });
            return;
        }
        
        try {
            // Generate new sessionId first
            const newSessionId = uuidv4();
            
            // Create new session with the generated sessionId
            const session = await createSession(prompt.title, newSessionId);
            
            if (!session) {
                throw new Error('Failed to create session');
            }
            
            setHasActiveChat(true);
            
            // Navigate to the new session using the generated sessionId
            navigate(`/chat-ai/${chatflowid}?sessionId=${newSessionId}`);
            
            // Clear chat and set input to prompt title
            await clearChat();
            setMessageInput(prompt.title);
            
            // Show snackbar
            setSnackbar({
                open: true,
                message: `New chat session created with prompt: ${prompt.title}`,
                severity: 'success'
            });
        } catch (err) {
            console.error('Error creating prompt chat:', err);
            setSnackbar({
                open: true,
                message: 'Failed to create chat with prompt',
                severity: 'error'
            });
        }
    }, [chatflowid, createSession, navigate, clearChat]);
    
    // Close snackbar
    const handleCloseSnackbar = useCallback(() => {
        setSnackbar({ ...snackbar, open: false });
    }, [snackbar]);
    
    // Toggle drawer
    const toggleDrawer = useCallback(() => {
        setDrawerOpen(!drawerOpen);
    }, [drawerOpen]);
    

    // Sidebar component - responsive design
    const sidebarContent = useMemo(() => (
        <Sidebar
            onNewChat={handleNewChat}
            onHome={handleHomeClick}
            onRefresh={handleRefreshClick}
            onSettings={handleSettingsClick}
            chatSessions={chatSessions}
            activeChatId={sessionId}
            onSelectChat={handleSelectChat}
        />
    ), [
        handleNewChat, 
        handleHomeClick, 
        handleRefreshClick, 
        handleSettingsClick, 
        chatSessions, 
        sessionId, 
        handleSelectChat
    ]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    height: '100vh',
                    width: '100vw',
                    overflow: 'hidden',
                    bgcolor: 'background.default'
                }}
            >
                {/* Desktop Sidebar */}
                {!isMobile && (
                    <Box
                        sx={{
                            width: 280,
                            flexShrink: 0,
                            display: { xs: 'none', md: 'block' },
                            borderRight: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper',
                            boxShadow: theme.shadows[3],
                            zIndex: 10
                        }}
                    >
                        {sidebarContent}
                    </Box>
                )}
                
                {/* Mobile Drawer */}
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            width: 280,
                            boxSizing: 'border-box',
                            bgcolor: 'background.paper'
                        }
                    }}
                >
                    {sidebarContent}
                </Drawer>
                
                {/* Main Content */}
                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    {hasActiveChat ? (
                        <>
                            {/* Chat header */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 1.5,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    bgcolor: 'background.paper',
                                    boxShadow: theme.shadows[1],
                                    zIndex: 5
                                }}
                            >
                                {/* Mobile menu button */}
                                {isMobile && (
                                    <IconButton 
                                        onClick={toggleDrawer} 
                                        sx={{ mr: 1 }}
                                        size="small"
                                    >
                                        {drawerOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
                                    </IconButton>
                                )}
                                
                                {/* Logo for mobile */}
                                {isMobile && (
                                    <Box 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            mr: 2
                                        }}
                                    >
                                        <IconBrandHipchat size={24} color={theme.palette.primary.main} />
                                        <Typography 
                                            variant="subtitle1" 
                                            sx={{ 
                                                ml: 1, 
                                                fontWeight: 600,
                                                display: { xs: 'none', sm: 'block' }
                                            }}
                                        >
                                            AIRA Chat
                                        </Typography>
                                    </Box>
                                )}
                                
                                <ChatHeader
                                    title={title}
                                    onClearChat={clearChat}
                                    onResetChat={clearChat}
                                    showSettings={showSettings}
                                    showExport={showExport}
                                    showShare={false}
                                    showClear={showClear}
                                    showReset={showReset}
                                    customActions={[
                                        ...customActions,
                                        {
                                            tooltip: 'Session ID',
                                            icon: <Box sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>ID</Box>,
                                            onClick: () => {
                                                setSnackbar({
                                                    open: true,
                                                    message: `Current Session ID: ${sessionId}`,
                                                    severity: 'info'
                                                });
                                            }
                                        }
                                    ]}
                                />
                            </Box>
                            
                            {/* Chat messages */}
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    overflow: 'hidden',
                                    p: { xs: 1, sm: 2 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    bgcolor: theme.palette.mode === 'dark' 
                                        ? 'rgba(0, 0, 0, 0.1)' 
                                        : 'rgba(0, 0, 0, 0.02)',
                                    backgroundImage: theme.palette.mode === 'dark'
                                        ? 'radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%)'
                                        : 'radial-gradient(circle at center, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0) 70%)'
                                }}
                            >
                                {/* Message list */}
                                <MessageList
                                    messages={messages}
                                    onMessageEdit={handleMessageEdit}
                                    onMessageCopy={handleMessageCopy}
                                    showAgentReasoning={showAgentReasoning}
                                    isLoading={isLoading || isHistoryLoading}
                                    isStreaming={isStreaming}
                                    messagesEndRef={messagesEndRef}
                                    onActionClick={handleActionClick}
                                />
                            </Box>
                            
                            {/* Chat input */}
                            <Box 
                                sx={{ 
                                    p: { xs: 1, sm: 2 },
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                    bgcolor: 'background.paper',
                                    boxShadow: theme.shadows[3],
                                    zIndex: 5
                                }}
                            >
                                <Box
                                    sx={{
                                        maxWidth: '900px',
                                        width: '100%',
                                        mx: 'auto'
                                    }}
                                >
                                    <ChatInput
                                        onSendMessage={handleSendMessage}
                                        onAbortMessage={abortMessage}
                                        disabled={false}
                                        loading={isLoading}
                                        isStreaming={isStreaming}
                                        placeholder="Type your message..."
                                        allowFiles={allowFiles}
                                        allowImages={allowImages}
                                        allowVoice={allowVoice}
                                        inputRef={inputRef}
                                        onKeyDown={handleKeyDown}
                                        value={messageInput || ''}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        previews={previews}
                                        onDeletePreview={handleDeletePreview}
                                        onFileUpload={handleFileUpload}
                                        onImageUpload={handleImageUpload}
                                        onVoiceRecord={handleVoiceRecord}
                                        isRecording={isRecording}
                                        onCancelRecording={handleCancelRecording}
                                        onStopRecording={handleStopRecording}
                                    />
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <>
                            {/* Mobile menu button for welcome screen */}
                            {isMobile && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        left: 16,
                                        zIndex: 10
                                    }}
                                >
                                    <IconButton 
                                        onClick={toggleDrawer} 
                                        sx={{ 
                                            bgcolor: 'background.paper',
                                            boxShadow: theme.shadows[2]
                                        }}
                                        size="small"
                                    >
                                        <IconMenu2 size={20} />
                                    </IconButton>
                                </Box>
                            )}
                            
                            <WelcomeScreen
                                onPromptSelect={handlePromptSelect}
                            />
                        </>
                    )}
                </Box>
                
                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={handleCloseSnackbar} 
                        severity={snackbar.severity}
                        sx={{ 
                            width: '100%',
                            boxShadow: theme.shadows[3]
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
};

Chat.propTypes = {
    chatflowid: PropTypes.string,
    initialMessages: PropTypes.array,
    title: PropTypes.string,
    darkMode: PropTypes.bool,
    showAgentReasoning: PropTypes.bool,
    allowFiles: PropTypes.bool,
    allowImages: PropTypes.bool,
    allowVoice: PropTypes.bool,
    showSettings: PropTypes.bool,
    showExport: PropTypes.bool,
    showShare: PropTypes.bool,
    showClear: PropTypes.bool,
    showReset: PropTypes.bool,
    customActions: PropTypes.array,
    onError: PropTypes.func,
    onMessageStart: PropTypes.func,
    onMessageComplete: PropTypes.func,
    onMessageUpdate: PropTypes.func,
    onStreamStart: PropTypes.func,
    onStreamEnd: PropTypes.func
};

export default Chat;
