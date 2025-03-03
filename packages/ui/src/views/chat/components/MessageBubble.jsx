import React, { useState, useRef, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Menu,
    MenuItem,
    Paper,
    Avatar,
    Collapse,
    Chip,
    alpha,
    Divider
} from '@mui/material';
import {
    IconCopy,
    IconEdit,
    IconDots,
    IconCheck,
    IconClock,
    IconRefresh,
    IconUser,
    IconRobot,
    IconSun,
    IconChevronDown,
    IconBrandOpenai,
    IconBrandGoogle,
    IconBrandMeta,
    IconBrandEdge,
    IconMickeyFilled,
    IconBrandCodesandbox,
    IconCode,
    IconBrandHipchat,
    IconPaperclip
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

import { effects } from '../utils/theme';
import { animationPresets } from '../utils/animations';
import StreamingMarkdown from './StreamingMarkdown';
import FeedbackButtons from './FeedbackButtons';
import { AgentReasoningView } from './AgentReasoning';
import ResultHeader from './ResultHeader';
import SearchStatus from './SearchStatus';
import ResultTable from './ResultTable';

/**
 * MessageBubble component displays a single message in the chat interface
 * Memoized to prevent unnecessary re-renders
 */
const MessageBubble = memo(({ 
    message, 
    onEdit, 
    showAgentReasoning = true,
    onCopy,
    isLast = false,
    onActionClick
}) => {
    const [showSteps, setShowSteps] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const contentRef = useRef(null);
    
    // Validate message properties
    if (!message || typeof message !== 'object') {
        console.error('Invalid message object:', message);
        return null;
    }

    const isUser = message.role === 'user';
    const isAssistant = message.role === 'assistant';
    const isSystem = message.role === 'system';
    const isError = message.isError;
    const isStreaming = message.isStreaming;

    // Log message state for debugging
    console.debug('Message state:', {
        id: message.id,
        role: message.role,
        content: message.content?.substring(0, 100) + '...',
        isStreaming,
        isError
    });
    
    const hasAgentReasoning = showAgentReasoning && 
                             message.agentReasoning && 
                             message.agentReasoning.length > 0;
    
    // Handle copy - memoized to prevent recreation on each render
    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setIsCopied(true);
            if (onCopy) onCopy(message.content);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
        setMenuAnchor(null);
    }, [message.content, onCopy]);
    
    // Handle edit - memoized to prevent recreation on each render
    const handleEdit = useCallback(() => {
        if (onEdit) onEdit(message);
        setMenuAnchor(null);
    }, [message, onEdit]);
    
    // Get avatar content - memoized to prevent recreation on each render
    const getAvatarContent = useCallback(() => {
        if (isUser) return <IconUser size={20} />;
        if (isAssistant) {
            // Determine which model icon to show based on source or other properties
            if (message.source && message.source.toLowerCase().includes('openai')) {
                return <IconBrandOpenai size={20} />;
            } else if (message.source && message.source.toLowerCase().includes('google')) {
                return <IconBrandGoogle size={20} />;
            } else if (message.source && message.source.toLowerCase().includes('anthropic')) {
                return <IconBrandEdge size={20} />;
            } else if (message.source && message.source.toLowerCase().includes('mistral')) {
                return <IconMickeyFilled size={20} />;
            } else if (message.source && message.source.toLowerCase().includes('meta')) {
                return <IconBrandMeta size={20} />;
            } else if (message.source && message.source.toLowerCase().includes('code')) {
                return <IconCode size={20} />;
            } else {
                return <IconBrandHipchat size={20} />;
            }
        }
        return null;
    }, [isUser, isAssistant, message.source]);
    
    // Get avatar color - memoized to prevent recreation on each render
    const getAvatarColor = useCallback(() => {
        if (isUser) return 'primary.main';
        if (isAssistant) {
            // Different colors based on model
            if (message.source && message.source.toLowerCase().includes('openai')) {
                return '#10a37f'; // OpenAI green
            } else if (message.source && message.source.toLowerCase().includes('google')) {
                return '#4285F4'; // Google blue
            } else if (message.source && message.source.toLowerCase().includes('anthropic')) {
                return '#b83c82'; // Anthropic purple
            } else if (message.source && message.source.toLowerCase().includes('mistral')) {
                return '#5436DA'; // Mistral purple
            } else if (message.source && message.source.toLowerCase().includes('meta')) {
                return '#0668E1'; // Meta blue
            } else {
                return 'secondary.main';
            }
        }
        if (isSystem) return 'info.main';
        return 'text.disabled';
    }, [isUser, isAssistant, isSystem, message.source]);
    
    // Get message background - memoized to prevent recreation on each render
    const getMessageBackground = useCallback(() => {
        if (isUser) return (theme) => alpha(theme.palette.primary.main, 0.08);
        if (isError) return (theme) => alpha(theme.palette.error.main, 0.08);
        return 'background.paper';
    }, [isUser, isError]);
    
    // Get message text color - memoized to prevent recreation on each render
    const getMessageTextColor = useCallback(() => {
        if (isUser) return 'text.primary';
        if (isError) return 'error.main';
        return 'text.primary';
    }, [isUser, isError]);
    
    // Handle toggle steps - memoized to prevent recreation on each render
    const handleToggleSteps = useCallback(() => {
        setShowSteps(prev => !prev);
    }, []);
    
    // Check if message has a result table
    const hasResultTable = message.resultTable && 
                          message.resultTable.data && 
                          message.resultTable.data.length > 0;
    
    // Check if message has search steps
    const hasSearchSteps = message.searchSteps && 
                          message.searchSteps.length > 0;
    
    // Check if message is a result message
    const isResultMessage = message.isResult || 
                           message.title === 'Results' || 
                           hasResultTable;
    
    // Get model name from source - memoized to prevent recreation on each render
    const getModelName = useCallback(() => {
        if (!message.source) return null;
        
        const source = message.source.toLowerCase();
        if (source.includes('gpt-4')) return 'GPT-4';
        if (source.includes('gpt-3.5')) return 'GPT-3.5';
        if (source.includes('claude')) return 'Claude';
        if (source.includes('gemini')) return 'Gemini';
        if (source.includes('mistral')) return 'Mistral AI';
        if (source.includes('llama')) return 'Llama';
        if (source.includes('palm')) return 'PaLM';
        
        // Return the original source if no specific model is detected
        return message.source;
    }, [message.source]);
    
    // Format timestamp - memoized to prevent recreation on each render
    const formattedTimestamp = useCallback(() => {
        return format(new Date(message.timestamp || Date.now()), 'h:mm a');
    }, [message.timestamp]);
    
    return (
        <motion.div
            {...animationPresets.messageBubble}
            style={{
                display: 'flex',
                flexDirection: isUser ? 'row-reverse' : 'row',
                gap: '12px',
                position: 'relative',
                width: '100%'
            }}
        >
            {/* Avatar */}
            <Box sx={{ pt: 0.5 }}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20
                    }}
                >
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '12px',
                            bgcolor: getAvatarColor(),
                            color: 'white',
                            boxShadow: effects.shadows.md
                        }}
                    >
                        {getAvatarContent()}
                    </Avatar>
                </motion.div>
            </Box>
            
            {/* Message Content */}
            <Box sx={{ 
                maxWidth: isUser ? '85%' : '90%', 
                position: 'relative',
                width: isUser ? 'auto' : '100%'
            }}>
                {/* Message Header - Role and Timestamp */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        mb: 0.5
                    }}
                >
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: isUser ? 'primary.main' : 'text.secondary',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                        }}
                    >
                        {isUser ? 'You' : 'AI Assistant'}
                    </Typography>
                    
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: 'text.disabled',
                            fontSize: '0.7rem'
                        }}
                    >
                        {formattedTimestamp()}
                    </Typography>
                </Box>
                
                {/* Source and Steps Indicator - Only for assistant messages */}
                {isAssistant && message.source && (
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            mb: 0.5
                        }}
                    >
                        <Chip
                            label={getModelName() || message.source}
                            size="small"
                            sx={{ 
                                height: 20,
                                fontSize: '0.65rem',
                                fontWeight: 500,
                                bgcolor: (theme) => alpha(getAvatarColor(), 0.1),
                                color: getAvatarColor(),
                                border: '1px solid',
                                borderColor: (theme) => alpha(getAvatarColor(), 0.2),
                                '& .MuiChip-label': {
                                    px: 1
                                }
                            }}
                        />
                    </Box>
                )}
                
                {/* Steps Indicator */}
                {isAssistant && message.steps && message.steps > 0 && (
                    <Box 
                        sx={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            mb: 0.5,
                            px: 1.5,
                            py: 0.25,
                            borderRadius: '12px',
                            bgcolor: (theme) => 
                                theme.palette.mode === 'dark' 
                                    ? alpha(theme.palette.background.default, 0.5)
                                    : alpha(theme.palette.background.default, 0.8),
                            border: '1px solid',
                            borderColor: 'divider',
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                        onClick={handleToggleSteps}
                    >
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                fontWeight: 500,
                                fontSize: '0.7rem',
                                color: 'text.secondary'
                            }}
                        >
                            Took {message.steps} {message.steps === 1 ? 'step' : 'steps'}
                        </Typography>
                        <motion.div
                            animate={{ rotate: showSteps ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ marginLeft: '4px' }}
                        >
                            <IconChevronDown size={12} color="text.disabled" />
                        </motion.div>
                    </Box>
                )}
                
                {isResultMessage ? (
                    <Box>
                        <ResultHeader 
                            title={message.title || 'Results'}
                            showSteps={hasSearchSteps}
                            onToggleSteps={handleToggleSteps}
                            stepsVisible={showSteps}
                            icon={<IconSun size={20} />}
                            description={message.description || ''}
                        />
                        
                        <Collapse in={showSteps}>
                            {hasSearchSteps && (
                                <SearchStatus 
                                    steps={message.searchSteps}
                                    currentStep={message.currentStep || 0}
                                    isComplete={!isStreaming}
                                />
                            )}
                        </Collapse>
                        
                        {message.content && !hasResultTable && (
                            <Paper
                                ref={contentRef}
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: '12px',
                                    background: 'background.paper',
                                    color: 'text.primary',
                                    boxShadow: effects.shadows.md,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    mt: 1
                                }}
                            >
                                {isStreaming ? (
                                    <StreamingMarkdown 
                                        content={message.content} 
                                        isComplete={!isStreaming}
                                    />
                                ) : (
                                    <StreamingMarkdown 
                                        content={message.content} 
                                        isComplete={true}
                                        options={{ instantComplete: true }}
                                    />
                                )}
                            </Paper>
                        )}
                        
                        {hasResultTable && (
                            <ResultTable 
                                data={message.resultTable.data}
                                columns={message.resultTable.columns}
                                maxRows={message.resultTable.maxRows || 4}
                                caption={message.resultTable.caption}
                                showRowCount={message.resultTable.showRowCount !== false}
                            />
                        )}
                    </Box>
                ) : (
                    <Paper
                        ref={contentRef}
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: '16px',
                            background: getMessageBackground(),
                            color: getMessageTextColor(),
                            boxShadow: isUser ? 'none' : effects.shadows.sm,
                            border: '1px solid',
                            borderColor: (theme) => 
                                isUser 
                                    ? alpha(theme.palette.primary.main, 0.2)
                                    : alpha(theme.palette.divider, 0.8),
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Message Text */}
                        <Box>
                            {message.content ? (
                                <StreamingMarkdown 
                                    content={message.content} 
                                    isComplete={!isStreaming}
                                    options={{ 
                                        instantComplete: !isStreaming,
                                        chunkSize: 3, // Increase chunk size for smoother rendering
                                        speed: 10 // Slightly faster typing speed
                                    }}
                                />
                            ) : (
                                <Typography color="text.secondary" fontSize="0.9rem">
                                    {isError ? 'Error: Failed to load message content' : 'No content available'}
                                </Typography>
                            )}
                        </Box>
                        
                        {/* File Uploads */}
                        {message.fileUploads && message.fileUploads.length > 0 && (
                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {message.fileUploads.map((file, index) => (
                                <Chip
                                    key={file.id || index}
                                    label={file.name}
                                    variant="outlined"
                                    size="small"
                                    sx={{ 
                                        borderRadius: '8px',
                                        bgcolor: (theme) => 
                                            theme.palette.mode === 'dark' 
                                                ? alpha(theme.palette.background.paper, 0.2)
                                                : alpha(theme.palette.background.paper, 0.8),
                                        color: 'text.primary',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                    avatar={
                                        file.type === 'image' ? (
                                            <Box
                                                component="img"
                                                src={file.preview}
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: '4px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            <IconPaperclip size={16} />
                                        )
                                    }
                                />
                            ))}
                        </Box>
                        )}
                        
                        {/* Message Status */}
                        {isStreaming && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: 12,
                                    bottom: 12,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    opacity: 0.7
                                }}
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    <IconClock size={14} />
                                </motion.div>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: '0.7rem',
                                        color: 'text.secondary'
                                    }}
                                >
                                    Generating...
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                )}
                
                {/* Agent Reasoning */}
                {hasAgentReasoning && (
                    <Box sx={{ mt: 1.5 }}>
                        <AgentReasoningView
                            agentReasoning={message.agentReasoning}
                            chatflowid={message.chatflowid}
                            chatId={message.chatId}
                        />
                    </Box>
                )}
                
                {/* Message Actions */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: isUser ? 'flex-start' : 'flex-end',
                        mt: 0.5,
                        gap: 0.5
                    }}
                >
                    {isUser && onEdit && (
                        <Tooltip title="Edit message">
                            <IconButton
                                size="small"
                                onClick={handleEdit}
                                sx={{
                                    color: 'text.disabled',
                                    '&:hover': {
                                        color: 'primary.main',
                                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
                                    }
                                }}
                            >
                                <IconEdit size={16} />
                            </IconButton>
                        </Tooltip>
                    )}
                    
                    <>
                        {/* Feedback buttons - only for completed assistant messages */}
                        {isAssistant && !isStreaming && !isError && (
                            <FeedbackButtons messageId={message.id} />
                        )}
                        
                        <Tooltip title={isCopied ? 'Copied!' : 'Copy message'}>
                            <IconButton
                                size="small"
                                onClick={handleCopy}
                                sx={{
                                    color: isCopied ? 'success.main' : 'text.disabled',
                                    '&:hover': {
                                        color: isCopied ? 'success.main' : 'primary.main',
                                        bgcolor: (theme) => 
                                            isCopied 
                                                ? alpha(theme.palette.success.main, 0.1)
                                                : alpha(theme.palette.primary.main, 0.1)
                                    }
                                }}
                            >
                                {isCopied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                            </IconButton>
                        </Tooltip>
                    </>
                </Box>
            </Box>
        </motion.div>
    );
});

MessageBubble.propTypes = {
    message: PropTypes.object.isRequired,
    onEdit: PropTypes.func,
    showAgentReasoning: PropTypes.bool,
    onCopy: PropTypes.func,
    isLast: PropTypes.bool,
    onActionClick: PropTypes.func
};

// Display name for debugging
MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
