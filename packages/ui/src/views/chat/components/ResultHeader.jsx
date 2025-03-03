import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
    Box, 
    Typography, 
    Button, 
    Collapse, 
    IconButton,
    Tooltip
} from '@mui/material';
import { 
    IconChevronDown, 
    IconChevronUp, 
    IconWand,
    IconSun
} from '@tabler/icons-react';

/**
 * ResultHeader component displays the header for result sections
 */
const ResultHeader = ({ 
    title = 'Results', 
    showSteps = true,
    onToggleSteps,
    stepsVisible = false,
    icon = null,
    description = ''
}) => {
    const [isExpanded, setIsExpanded] = useState(Boolean(description));
    
    // Handle toggle description
    const handleToggleDescription = () => {
        setIsExpanded(prev => !prev);
    };
    
    // Handle toggle steps
    const handleToggleSteps = () => {
        if (onToggleSteps) {
            onToggleSteps(!stepsVisible);
        }
    };
    
    return (
        <Box sx={{ width: '100%', mb: description ? 0 : 2 }}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 1
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {icon || <IconSun size={20} />}
                    
                    <Typography 
                        variant="subtitle1" 
                        fontWeight={500}
                    >
                        {title}
                    </Typography>
                    
                    {description && (
                        <Tooltip title={isExpanded ? "Hide details" : "Show details"}>
                            <IconButton 
                                size="small" 
                                onClick={handleToggleDescription}
                                sx={{ p: 0.5 }}
                            >
                                {isExpanded ? 
                                    <IconChevronUp size={16} /> : 
                                    <IconChevronDown size={16} />
                                }
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
                
                {showSteps && (
                    <Button
                        variant="text"
                        size="small"
                        startIcon={<IconWand size={16} />}
                        onClick={handleToggleSteps}
                        sx={{ 
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            color: 'text.secondary',
                            '&:hover': {
                                backgroundColor: 'action.hover'
                            }
                        }}
                    >
                        {stepsVisible ? 'Hide steps' : 'Show steps'}
                    </Button>
                )}
            </Box>
            
            {description && (
                <Collapse in={isExpanded}>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                            mb: 2,
                            fontSize: '0.875rem',
                            lineHeight: 1.5
                        }}
                    >
                        {description}
                    </Typography>
                </Collapse>
            )}
        </Box>
    );
};

ResultHeader.propTypes = {
    title: PropTypes.string,
    showSteps: PropTypes.bool,
    onToggleSteps: PropTypes.func,
    stepsVisible: PropTypes.bool,
    icon: PropTypes.node,
    description: PropTypes.string
};

export default ResultHeader;
