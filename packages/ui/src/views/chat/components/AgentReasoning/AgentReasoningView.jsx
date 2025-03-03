import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
    Box, 
    Typography, 
    Chip, 
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
    IconChevronDown, 
    IconRobot, 
    IconTool, 
    IconList,
    IconPhoto,
    IconMaximize,
    IconMinimize
} from '@tabler/icons-react';

import { effects } from '../../utils/theme';
import { animationPresets } from '../../utils/animations';
import useAgentReasoning from '../../hooks/useAgentReasoning';
import AgentReasoningTimeline from './AgentReasoningTimeline';

/**
 * AgentReasoningView component is the main component for displaying agent reasoning data
 */
const AgentReasoningView = ({ 
    agentReasoning, 
    chatflowid, 
    chatId, 
    initialExpanded = false 
}) => {
    // Use the agent reasoning hook
    const {
        agents,
        expandedAgents,
        isReasoningExpanded,
        stats,
        toggleAgent,
        expandAllAgents,
        collapseAllAgents,
        toggleReasoningExpanded
    } = useAgentReasoning(agentReasoning, {
        chatflowid,
        chatId,
        autoExpand: false,
        initialExpandedAgents: []
    });
    
    // State for dialogs
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState(null);
    const [dialogTitle, setDialogTitle] = useState('');
    const [fullscreenMode, setFullscreenMode] = useState(false);
    
    // Handle tool click
    const handleToolClick = (tool, title = 'Tool Details') => {
        setDialogContent(
            <Box sx={{ maxWidth: '100%', overflow: 'auto' }}>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {JSON.stringify(tool, null, 2)}
                </pre>
            </Box>
        );
        setDialogTitle(title);
        setDialogOpen(true);
    };
    
    // Handle source click
    const handleSourceClick = (source) => {
        setDialogContent(
            <Box sx={{ maxWidth: '100%', overflow: 'auto' }}>
                <Typography variant="subtitle1" gutterBottom>
                    {source.title || 'Source Document'}
                </Typography>
                <Paper 
                    variant="outlined" 
                    sx={{ p: 2, bgcolor: 'background.default', borderRadius: '8px' }}
                >
                    <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                        {source.pageContent}
                    </Typography>
                </Paper>
                {source.metadata && Object.keys(source.metadata).length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Metadata
                        </Typography>
                        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                            {JSON.stringify(source.metadata, null, 2)}
                        </pre>
                    </Box>
                )}
            </Box>
        );
        setDialogTitle('Source Document');
        setDialogOpen(true);
    };
    
    // Toggle fullscreen mode
    const toggleFullscreen = () => {
        setFullscreenMode(prev => !prev);
    };
    
    // If no agent reasoning data, don't render anything
    if (!agentReasoning || agentReasoning.length === 0) {
        return null;
    }
    
    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            {/* Header with toggle and statistics */}
            <Box
                onClick={toggleReasoningExpanded}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: 'background.default',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main'
                    }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <motion.div
                        animate={{ rotate: isReasoningExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <IconChevronDown size={18} />
                    </motion.div>
                    
                    <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                        {isReasoningExpanded ? "Hide AI Reasoning" : "Show AI Reasoning"}
                    </Typography>
                </Box>
                
                {stats && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                            size="small"
                            label={`${stats.agentCount} ${stats.agentCount === 1 ? 'Agent' : 'Agents'}`}
                            icon={<IconRobot size={14} />}
                            variant="outlined"
                            sx={{ borderRadius: '8px' }}
                        />
                        {stats.hasTools && (
                            <Chip
                                size="small"
                                label={`${stats.toolCount} ${stats.toolCount === 1 ? 'Tool' : 'Tools'}`}
                                icon={<IconTool size={14} />}
                                variant="outlined"
                                sx={{ borderRadius: '8px' }}
                            />
                        )}
                        <Chip
                            size="small"
                            label={`${stats.messageCount} ${stats.messageCount === 1 ? 'Step' : 'Steps'}`}
                            icon={<IconList size={14} />}
                            variant="outlined"
                            sx={{ borderRadius: '8px' }}
                        />
                        {stats.hasArtifacts && (
                            <Chip
                                size="small"
                                label={`${stats.artifactCount} ${stats.artifactCount === 1 ? 'Artifact' : 'Artifacts'}`}
                                icon={<IconPhoto size={14} />}
                                variant="outlined"
                                sx={{ borderRadius: '8px' }}
                            />
                        )}
                    </Box>
                )}
            </Box>
            
            {/* Content */}
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                    opacity: isReasoningExpanded ? 1 : 0,
                    height: isReasoningExpanded ? 'auto' : 0
                }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
            >
                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        position: 'relative'
                    }}
                >
                    {/* Fullscreen toggle */}
                    <Box 
                        sx={{ 
                            position: 'absolute', 
                            top: 10, 
                            right: 10, 
                            zIndex: 2 
                        }}
                    >
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={fullscreenMode ? <IconMinimize size={16} /> : <IconMaximize size={16} />}
                            onClick={toggleFullscreen}
                            sx={{ borderRadius: '8px' }}
                        >
                            {fullscreenMode ? 'Exit Fullscreen' : 'Fullscreen'}
                        </Button>
                    </Box>
                    
                    {/* Expand/Collapse buttons */}
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            justifyContent: 'flex-start', 
                            gap: 1, 
                            mb: 2,
                            mt: 1
                        }}
                    >
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={expandAllAgents}
                            sx={{ borderRadius: '8px' }}
                        >
                            Expand All
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={collapseAllAgents}
                            sx={{ borderRadius: '8px' }}
                        >
                            Collapse All
                        </Button>
                    </Box>
                    
                    {/* Agent reasoning timeline */}
                    <AgentReasoningTimeline 
                        agentReasoning={agents}
                        expandedAgents={expandedAgents}
                        onToggleAgent={toggleAgent}
                        chatflowid={chatflowid}
                        chatId={chatId}
                        onToolClick={handleToolClick}
                        onSourceClick={handleSourceClick}
                    />
                </Box>
            </motion.div>
            
            {/* Dialog for tool and source details */}
            <Dialog 
                open={dialogOpen} 
                onClose={() => setDialogOpen(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent dividers>
                    {dialogContent}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            
            {/* Fullscreen dialog */}
            <Dialog
                open={fullscreenMode}
                onClose={() => setFullscreenMode(false)}
                fullScreen
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Agent Reasoning</Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<IconMinimize size={16} />}
                        onClick={() => setFullscreenMode(false)}
                    >
                        Exit Fullscreen
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={expandAllAgents}
                        >
                            Expand All
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={collapseAllAgents}
                        >
                            Collapse All
                        </Button>
                    </Box>
                    
                    <AgentReasoningTimeline 
                        agentReasoning={agents}
                        expandedAgents={expandedAgents}
                        onToggleAgent={toggleAgent}
                        chatflowid={chatflowid}
                        chatId={chatId}
                        onToolClick={handleToolClick}
                        onSourceClick={handleSourceClick}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

AgentReasoningView.propTypes = {
    agentReasoning: PropTypes.array,
    chatflowid: PropTypes.string,
    chatId: PropTypes.string,
    initialExpanded: PropTypes.bool
};

export default AgentReasoningView;
