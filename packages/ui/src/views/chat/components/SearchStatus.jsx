import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { IconSearch, IconDatabase } from '@tabler/icons-react';

/**
 * SearchStatus component displays the current search/processing status
 */
const SearchStatus = ({ 
    steps = [], 
    currentStep = 0,
    isComplete = false
}) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default',
                width: '100%'
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {steps.map((step, index) => {
                    const isActive = index === currentStep && !isComplete;
                    const isCompleted = isComplete || index < currentStep;
                    
                    return (
                        <Box 
                            key={index}
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1.5,
                                opacity: isActive || isCompleted ? 1 : 0.5
                            }}
                        >
                            {isActive && (
                                <CircularProgress size={16} thickness={6} />
                            )}
                            
                            {!isActive && (
                                step.icon || (
                                    index === 0 ? 
                                        <IconSearch size={16} /> : 
                                        <IconDatabase size={16} />
                                )
                            )}
                            
                            <Typography 
                                variant="body2"
                                sx={{ 
                                    color: isActive ? 'primary.main' : 'text.primary',
                                    fontWeight: isActive ? 500 : 400
                                }}
                            >
                                {step.label}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
};

SearchStatus.propTypes = {
    steps: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            icon: PropTypes.node
        })
    ),
    currentStep: PropTypes.number,
    isComplete: PropTypes.bool
};

export default SearchStatus;
