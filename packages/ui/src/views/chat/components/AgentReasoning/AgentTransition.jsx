import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { IconArrowRight } from '@tabler/icons-react';

import { effects } from '../../utils/theme';
import { animationPresets } from '../../utils/animations';

/**
 * AgentTransition component displays the transition between agents in the reasoning process
 */
const AgentTransition = ({ nextAgent, index }) => {
    return (
        <motion.div
            {...animationPresets.agentTransition}
            transition={{ 
                ...animationPresets.agentTransition.transition,
                delay: index * 0.1 
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 2,
                    position: 'relative'
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '1px',
                        bgcolor: 'divider',
                        zIndex: 0
                    }}
                />
                
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        px: 2,
                        py: 1,
                        borderRadius: '8px', // Consistent border radius
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: effects.shadows.sm,
                        zIndex: 1
                    }}
                >
                    <Box sx={{ mr: 1, display: 'flex' }}>
                        <motion.div
                            animate={{ 
                                x: [0, 5, 0], // Reduced movement
                                opacity: [1, 0.9, 1] // Subtler opacity change
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 2, // Slower animation
                                ease: "easeInOut"
                            }}
                        >
                            <IconArrowRight size={16} />
                        </motion.div>
                    </Box>
                    
                    <Typography variant="body2" fontWeight={500}>
                        Passing to {nextAgent}
                    </Typography>
                </Box>
            </Box>
        </motion.div>
    );
};

AgentTransition.propTypes = {
    nextAgent: PropTypes.string.isRequired,
    index: PropTypes.number
};

AgentTransition.defaultProps = {
    index: 0
};

export default AgentTransition;
