import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress } from '@mui/material';
import MessageBubble from './MessageBubble';

/**
 * Simple message list component
 */
const MessageList = ({
    messages = [],
    onMessageEdit,
    onMessageCopy,
    showAgentReasoning = true,
    onActionClick,
    isLoading = false,
    isStreaming = false,
    messagesEndRef
}) => {
    // Scroll to bottom when messages change or when streaming
    useEffect(() => {
        if (messagesEndRef?.current) {
            const shouldScroll = isStreaming || messages.length > 0;
            if (shouldScroll) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [messages.length, isStreaming, messages]);
    
    return (
        <Box
            sx={{
                height: '100%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                p: { xs: 1, sm: 2 }
            }}
        >
            {messages.filter(message => message && message.content).map((message, index) => (
                <MessageBubble
                    key={message.id || `msg-${index}`}
                    message={message}
                    onEdit={onMessageEdit}
                    onCopy={onMessageCopy}
                    showAgentReasoning={showAgentReasoning}
                    isLast={index === messages.length - 1}
                    onActionClick={onActionClick}
                />
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        p: 2
                    }}
                >
                    <CircularProgress size={24} />
                </Box>
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
        </Box>
    );
};

MessageList.propTypes = {
    messages: PropTypes.array,
    onMessageEdit: PropTypes.func,
    onMessageCopy: PropTypes.func,
    showAgentReasoning: PropTypes.bool,
    onActionClick: PropTypes.func,
    isLoading: PropTypes.bool,
    isStreaming: PropTypes.bool,
    messagesEndRef: PropTypes.object
};

export default MessageList;
