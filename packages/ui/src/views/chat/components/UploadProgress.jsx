import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    LinearProgress,
    Typography,
    IconButton,
    Tooltip,
    Paper,
    alpha
} from '@mui/material';
import {
    IconX,
    IconRefresh,
    IconCheck,
    IconAlertTriangle,
    IconFileUpload,
    IconPaperclip
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

/**
 * Format file size in bytes to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size
 */
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * UploadProgress component displays upload status and progress
 */
const UploadProgress = ({ uploads, onRetry, onRemove }) => {
    return (
        <Box sx={{ width: '100%' }}>
            {uploads.map((upload) => (
                <Paper
                    key={upload.id}
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    sx={{
                        p: 2,
                        mb: 1,
                        borderRadius: '12px',
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: (theme) => {
                            switch (upload.status) {
                                case 'complete':
                                    return alpha(theme.palette.success.main, 0.2);
                                case 'error':
                                    return alpha(theme.palette.error.main, 0.2);
                                default:
                                    return theme.palette.divider;
                            }
                        }
                    }}
                >
                    {/* File Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ mr: 1 }}>
                            {upload.type.startsWith('image/') ? (
                                <Box
                                    component="img"
                                    src={URL.createObjectURL(upload.file)}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '8px',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <IconPaperclip size={24} />
                            )}
                        </Box>
                        
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle2" noWrap>
                                {upload.name}
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ color: 'text.secondary' }}
                            >
                                {formatFileSize(upload.size)}
                            </Typography>
                        </Box>
                        
                        {/* Status Icon */}
                        <Box sx={{ ml: 2 }}>
                            {upload.status === 'complete' && (
                                <IconCheck 
                                    size={20} 
                                    color="success" 
                                />
                            )}
                            {upload.status === 'error' && (
                                <IconAlertTriangle 
                                    size={20} 
                                    color="error" 
                                />
                            )}
                            {upload.status === 'uploading' && (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ 
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'linear'
                                    }}
                                >
                                    <IconFileUpload size={20} />
                                </motion.div>
                            )}
                        </Box>
                        
                        {/* Actions */}
                        <Box sx={{ ml: 1 }}>
                            {upload.status === 'error' && (
                                <Tooltip title="Retry upload">
                                    <IconButton
                                        size="small"
                                        onClick={() => onRetry(upload.id)}
                                        sx={{
                                            color: 'warning.main',
                                            '&:hover': {
                                                bgcolor: (theme) => 
                                                    alpha(theme.palette.warning.main, 0.1)
                                            }
                                        }}
                                    >
                                        <IconRefresh size={20} />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title="Remove">
                                <IconButton
                                    size="small"
                                    onClick={() => onRemove(upload.id)}
                                    sx={{
                                        color: 'error.main',
                                        '&:hover': {
                                            bgcolor: (theme) => 
                                                alpha(theme.palette.error.main, 0.1)
                                        }
                                    }}
                                >
                                    <IconX size={20} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    
                    {/* Progress Bar */}
                    {(upload.status === 'uploading' || upload.status === 'pending') && (
                        <Box sx={{ width: '100%', mt: 1 }}>
                            <LinearProgress
                                variant="determinate"
                                value={upload.progress}
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    bgcolor: (theme) => 
                                        alpha(theme.palette.primary.main, 0.1),
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 3
                                    }
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    mt: 0.5,
                                    display: 'block',
                                    textAlign: 'right',
                                    color: 'text.secondary'
                                }}
                            >
                                {upload.progress}%
                            </Typography>
                        </Box>
                    )}
                    
                    {/* Error Message */}
                    {upload.status === 'error' && upload.error && (
                        <Typography
                            variant="caption"
                            sx={{
                                mt: 1,
                                display: 'block',
                                color: 'error.main'
                            }}
                        >
                            {upload.error}
                        </Typography>
                    )}
                </Paper>
            ))}
        </Box>
    );
};

UploadProgress.propTypes = {
    uploads: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            size: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
            progress: PropTypes.number.isRequired,
            status: PropTypes.oneOf(['pending', 'uploading', 'complete', 'error']).isRequired,
            error: PropTypes.string,
            file: PropTypes.instanceOf(File).isRequired
        })
    ).isRequired,
    onRetry: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
};

export default UploadProgress;
