import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    TextField,
    IconButton,
    Paper,
    Chip,
    CircularProgress,
    Tooltip,
    Typography,
    alpha,
    Divider
} from '@mui/material';
import {
    IconSend,
    IconMicrophone,
    IconPaperclip,
    IconPhoto,
    IconX,
    IconSquareFilled,
    IconMoodSmile,
    IconDotsVertical,
    IconKeyboard
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { effects } from '../utils/theme';

/**
 * ChatInput component handles user input and file uploads
 */
const ChatInput = ({
    onSendMessage,
    onAbortMessage,
    disabled = false,
    loading = false,
    isStreaming = false,
    placeholder = 'Type your message...',
    allowFiles = true,
    allowImages = true,
    allowVoice = true,
    inputRef,
    onKeyDown,
    value,
    onChange,
    previews = [],
    onDeletePreview,
    onFileUpload,
    onImageUpload,
    onVoiceRecord,
    isRecording = false,
    onCancelRecording,
    onStopRecording
}) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    
    // Focus input on mount and when value changes
    useEffect(() => {
        if (inputRef?.current && !disabled) {
            const input = inputRef.current.querySelector('textarea');
            if (input) {
                input.focus();
                // Move cursor to end
                const len = value?.length || 0;
                input.selectionStart = len;
                input.selectionEnd = len;
            }
        }
    }, [inputRef, disabled, value]);
    
    // Handle drag events
    const handleDrag = (e) => {
        if (disabled || !allowFiles) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true);
        } else if (e.type === 'dragleave') {
            setIsDragActive(false);
        }
    };
    
    // Handle drop event
    const handleDrop = (e) => {
        if (disabled || !allowFiles) return;
        
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            if (onFileUpload) {
                onFileUpload(e.dataTransfer.files);
            }
        }
    };
    
    // Handle file input change
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            if (onFileUpload) {
                onFileUpload(e.target.files);
            }
        }
        // Reset file input
        e.target.value = null;
    };
    
    // Handle image input change
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            if (onImageUpload) {
                onImageUpload(e.target.files);
            }
        }
        // Reset file input
        e.target.value = null;
    };
    
    // Handle send button click
    const handleSendClick = () => {
        if (onSendMessage && !disabled) {
            onSendMessage(value);
        }
    };
    
    // Handle abort button click
    const handleAbortClick = () => {
        if (onAbortMessage) {
            onAbortMessage();
        }
    };
    
    // Handle file upload button click
    const handleFileUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    
    // Handle image upload button click
    const handleImageUploadClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    };
    
    // Handle voice record button click
    const handleVoiceRecordClick = () => {
        if (onVoiceRecord) {
            onVoiceRecord();
        }
    };
    
    // Handle cancel recording button click
    const handleCancelRecordingClick = () => {
        if (onCancelRecording) {
            onCancelRecording();
        }
    };
    
    // Handle stop recording button click
    const handleStopRecordingClick = () => {
        if (onStopRecording) {
            onStopRecording();
        }
    };
    
    // Handle key down
    const handleKeyDown = (e) => {
        if (onKeyDown) {
            onKeyDown(e);
        }
    };
    
    // Handle input change
    const handleChange = (e) => {
        e.persist(); // Ensure the event persists for the callback
        if (onChange) {
            onChange(e);
        }
    };
    
    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%'
            }}
            onDragEnter={handleDrag}
        >
            {/* Drag overlay */}
            {isDragActive && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        borderRadius: '16px',
                        border: '2px dashed',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        fontSize: '1rem',
                        fontWeight: 'medium'
                    }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <IconPaperclip size={32} />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Drop files here to upload
                        </Typography>
                    </Box>
                </Box>
            )}
            
            {/* Previews */}
            {previews.length > 0 && (
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        mb: 1.5,
                        p: 1.5,
                        borderRadius: '12px',
                        bgcolor: (theme) => 
                            theme.palette.mode === 'dark' 
                                ? alpha(theme.palette.background.paper, 0.6)
                                : alpha(theme.palette.background.paper, 0.8),
                        border: '1px solid',
                        borderColor: 'divider',
                        backdropFilter: 'blur(8px)'
                    }}
                >
                    {previews.map((preview, index) => (
                        <Chip
                            key={index}
                            label={preview.name}
                            onDelete={() => onDeletePreview && onDeletePreview(preview)}
                            variant="outlined"
                            size="small"
                            sx={{
                                borderRadius: '8px',
                                bgcolor: (theme) => 
                                    theme.palette.mode === 'dark' 
                                        ? alpha(theme.palette.background.paper, 0.8)
                                        : alpha(theme.palette.background.default, 0.8),
                                border: '1px solid',
                                borderColor: 'divider',
                                px: 0.5,
                                '& .MuiChip-deleteIcon': {
                                    color: 'text.secondary',
                                    '&:hover': {
                                        color: 'error.main'
                                    }
                                }
                            }}
                            avatar={
                                preview.type === 'image' ? (
                                    <Box
                                        component="img"
                                        src={preview.preview}
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
                </Paper>
            )}
            
            {/* Recording UI */}
            {isRecording ? (
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: '16px',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: (theme) => 
                            theme.palette.mode === 'dark' 
                                ? alpha(theme.palette.background.paper, 0.8)
                                : alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: 'blur(8px)',
                        boxShadow: effects.shadows.md
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: 'error.main'
                                }}
                            />
                        </motion.div>
                        <Typography variant="body2" fontWeight={500}>Recording voice message...</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            onClick={handleCancelRecordingClick}
                            size="small"
                            color="error"
                            sx={{
                                border: '1px solid',
                                borderColor: 'error.main',
                                bgcolor: (theme) => alpha(theme.palette.error.main, 0.1)
                            }}
                        >
                            <IconX size={18} />
                        </IconButton>
                        <IconButton
                            onClick={handleStopRecordingClick}
                            size="small"
                            color="primary"
                            sx={{
                                border: '1px solid',
                                borderColor: 'primary.main',
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
                            }}
                        >
                            <IconSend size={18} />
                        </IconButton>
                    </Box>
                </Paper>
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: '8px 16px',
                        borderRadius: '16px',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: (theme) => 
                            theme.palette.mode === 'dark' 
                                ? alpha(theme.palette.background.paper, 0.8)
                                : alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: 'blur(8px)',
                        boxShadow: effects.shadows.sm
                    }}
                >
                    {/* Left buttons */}
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Emoji">
                            <IconButton
                                disabled={disabled || loading}
                                size="small"
                                sx={{ 
                                    color: 'text.secondary',
                                    '&:hover': {
                                        color: 'primary.main',
                                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
                                    }
                                }}
                            >
                                <IconMoodSmile size={20} />
                            </IconButton>
                        </Tooltip>
                        
                        {allowFiles && (
                            <Tooltip title="Attach file">
                                <IconButton
                                    onClick={handleFileUploadClick}
                                    disabled={disabled || loading}
                                    size="small"
                                    sx={{ 
                                        color: 'text.secondary',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
                                        }
                                    }}
                                >
                                    <IconPaperclip size={20} />
                                </IconButton>
                            </Tooltip>
                        )}
                        
                        {allowImages && (
                            <Tooltip title="Attach image">
                                <IconButton
                                    onClick={handleImageUploadClick}
                                    disabled={disabled || loading}
                                    size="small"
                                    sx={{ 
                                        color: 'text.secondary',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
                                        }
                                    }}
                                >
                                    <IconPhoto size={20} />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    
                    {/* Input field */}
                    <Box sx={{ flex: 1, mx: 1 }}>
                        <TextField
                            inputRef={inputRef}
                            fullWidth
                            placeholder={loading ? 'Waiting for response...' : placeholder}
                            disabled={disabled || loading}
                            value={value || ''}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            variant="standard"
                            sx={{
                                '& .MuiInputBase-root': {
                                    fontSize: '0.95rem',
                                    '&:before, &:after': {
                                        display: 'none'
                                    }
                                },
                                '& .MuiInputBase-input': {
                                    py: 1
                                }
                            }}
                            InputProps={{
                                disableUnderline: true,
                                autoFocus: true
                            }}
                            multiline
                            maxRows={4}
                        />
                    </Box>
                    
                    {/* Right buttons */}
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                        {allowVoice && !loading && !isStreaming && (
                            <Tooltip title="Voice message">
                                <IconButton
                                    onClick={handleVoiceRecordClick}
                                    disabled={disabled}
                                    size="small"
                                    sx={{ 
                                        color: 'text.secondary',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
                                        }
                                    }}
                                >
                                    <IconMicrophone size={20} />
                                </IconButton>
                            </Tooltip>
                        )}
                        
                        {loading || isStreaming ? (
                            <Tooltip title="Stop generation">
                                <IconButton
                                    onClick={handleAbortClick}
                                    size="small"
                                    color="error"
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'error.main',
                                        bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                                        '&:hover': {
                                            bgcolor: (theme) => alpha(theme.palette.error.main, 0.2)
                                        }
                                    }}
                                >
                                    <IconSquareFilled size={14} />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip title="Send message">
                                <span>
                                    <IconButton
                                        onClick={handleSendClick}
                                        disabled={disabled || (!value && previews.length === 0)}
                                        size="small"
                                        color="primary"
                                        sx={{
                                            bgcolor: (theme) => 
                                                (!value && previews.length === 0)
                                                    ? alpha(theme.palette.action.disabled, 0.1)
                                                    : alpha(theme.palette.primary.main, 0.1),
                                            '&:hover': {
                                                bgcolor: (theme) => 
                                                    (!value && previews.length === 0)
                                                        ? alpha(theme.palette.action.disabled, 0.1)
                                                        : alpha(theme.palette.primary.main, 0.2)
                                            }
                                        }}
                                    >
                                        <IconSend size={20} />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                    </Box>
                    
                    {/* Hidden file inputs */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        multiple
                    />
                    <input
                        type="file"
                        ref={imageInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                        accept="image/*"
                        multiple
                    />
                </Paper>
            )}
            
            {/* Keyboard shortcuts hint */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 1,
                    gap: 0.5
                }}
            >
                <IconKeyboard size={14} color="text.disabled" />
                <Typography
                    variant="caption"
                    sx={{
                        color: 'text.disabled',
                        fontSize: '0.7rem'
                    }}
                >
                    Press Enter to send, Shift+Enter for new line
                </Typography>
            </Box>
        </Box>
    );
};

ChatInput.propTypes = {
    onSendMessage: PropTypes.func.isRequired,
    onAbortMessage: PropTypes.func,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    isStreaming: PropTypes.bool,
    placeholder: PropTypes.string,
    allowFiles: PropTypes.bool,
    allowImages: PropTypes.bool,
    allowVoice: PropTypes.bool,
    inputRef: PropTypes.object,
    onKeyDown: PropTypes.func,
    value: PropTypes.string,
    onChange: PropTypes.func,
    previews: PropTypes.array,
    onDeletePreview: PropTypes.func,
    onFileUpload: PropTypes.func,
    onImageUpload: PropTypes.func,
    onVoiceRecord: PropTypes.func,
    isRecording: PropTypes.bool,
    onCancelRecording: PropTypes.func,
    onStopRecording: PropTypes.func
};

export default ChatInput;
