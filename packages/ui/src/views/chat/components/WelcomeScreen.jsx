import React from 'react';
import PropTypes from 'prop-types';
import { 
    Box, 
    Typography, 
    Button, 
    Paper, 
    Grid,
    Chip,
    Avatar
} from '@mui/material';
import { 
    IconBrandOpenai, 
    IconMessage, 
    IconDatabase, 
    IconList,
    IconChartBar
} from '@tabler/icons-react';

import { effects } from '../utils/theme';

/**
 * WelcomeScreen component displays when there are no active chats
 */
const WelcomeScreen = ({ 
    title = 'Talk Data to Me',
    subtitle = 'Choose a prompt below or write your own to start chatting',
    onPromptSelect,
    customPrompts = []
}) => {
    // Default prompts if none provided
    const defaultPrompts = [
        {
            id: 'clean-account',
            title: 'Clean account fields',
            description: 'Identify and clean up account data fields'
        },
        {
            id: 'clean-contact',
            title: 'Clean contact fields',
            description: 'Identify and clean up contact data fields'
        },
        {
            id: 'create-master',
            title: 'Create master \'People\' list',
            description: 'Create a master list of people from your data'
        },
        {
            id: 'account-fit',
            title: 'Account Fit Score',
            description: 'Calculate account fit scores based on your criteria'
        },
        {
            id: 'match-leads',
            title: 'Match leads to account',
            description: 'Match lead records to the appropriate accounts'
        },
        {
            id: 'prompt-library',
            title: 'See prompt library',
            description: 'Browse all available prompt templates',
            icon: <IconList size={20} />
        }
    ];
    
    // Combine default and custom prompts
    const prompts = [...defaultPrompts, ...customPrompts];
    
    // Handle prompt selection
    const handlePromptClick = (prompt) => {
        if (onPromptSelect) {
            onPromptSelect(prompt);
        }
    };
    
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                p: 3
            }}
        >
            {/* Logo and Title */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 3
                }}
            >
                <Avatar
                    sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'background.paper',
                        boxShadow: effects.shadows.sm,
                        mb: 2
                    }}
                >
                    <IconBrandOpenai size={28} />
                </Avatar>
                
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    {title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 450 }}>
                    {subtitle}
                </Typography>
            </Box>
            
            {/* Prompt Section */}
            <Box sx={{ width: '100%', maxWidth: 700, mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                    Ask about:
                </Typography>
                
                <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                    {prompts.map((prompt) => (
                        <Grid item xs={12} sm={6} md={4} key={prompt.id}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    borderRadius: '8px',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        boxShadow: effects.shadows.sm,
                                        borderColor: 'primary.main',
                                        transform: 'translateY(-1px)'
                                    }
                                }}
                                onClick={() => handlePromptClick(prompt)}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    {prompt.icon || <IconMessage size={16} />}
                                    <Typography variant="subtitle2" fontWeight={500} sx={{ ml: 0.75, fontSize: '0.875rem' }}>
                                        {prompt.title}
                                    </Typography>
                                </Box>
                                
                                {prompt.description && (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                        {prompt.description}
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            
            {/* Recent Sessions Section */}
            <Box sx={{ width: '100%', maxWidth: 700 }}>
                <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                    Recent Sessions:
                </Typography>
                
                <Paper
                    elevation={0}
                    sx={{
                        p: 1.5,
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            No recent sessions found. Start a new chat to begin.
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

WelcomeScreen.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    onPromptSelect: PropTypes.func,
    customPrompts: PropTypes.array
};

export default WelcomeScreen;
