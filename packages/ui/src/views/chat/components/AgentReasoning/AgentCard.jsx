import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Avatar, 
    Divider, 
    Chip,
    Paper,
    Collapse
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
    IconChevronDown, 
    IconTool, 
    IconDeviceSdCard,
    IconRobot
} from '@tabler/icons-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';

import { effects } from '../../utils/theme';
import { animationPresets } from '../../utils/animations';

/**
 * AgentCard component displays information about a single agent in the reasoning process
 */
const AgentCard = ({ 
    agent, 
    index, 
    isExpanded, 
    onToggle, 
    chatflowid, 
    chatId,
    onToolClick,
    onSourceClick
}) => {
    const [hoveredTool, setHoveredTool] = useState(null);
    const [hoveredSource, setHoveredSource] = useState(null);
    
    // Determine agent color based on node name
    const getAgentColor = (nodeName) => {
        const colors = {
            'OpenAI': '#10a37f',
            'LangChain': '#3b82f6',
            'Anthropic': '#d53f8c',
            'default': '#7c3aed'
        };
        
        // Extract model name from nodeName
        const modelMatch = nodeName?.match(/(OpenAI|LangChain|Anthropic)/i);
        return modelMatch ? colors[modelMatch[1]] : colors.default;
    };
    
    const agentColor = getAgentColor(agent.nodeName);
    
    // Get agent icon
    const getAgentIcon = (nodeName, instructions) => {
        // In a real implementation, this would return the actual icon URL
        // For now, we'll just return a placeholder
        return null;
    };
    
    // Render markdown content
    const renderMarkdown = (content) => (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeMathjax]}
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                                margin: '1em 0',
                                borderRadius: '8px',
                                padding: '1em'
                            }}
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code
                            className={className}
                            style={{
                                padding: '0.2em 0.4em',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(0, 0, 0, 0.1)'
                            }}
                            {...props}
                        >
                            {children}
                        </code>
                    );
                }
            }}
        >
            {content}
        </ReactMarkdown>
    );
    
    // Check if agent has any content to display
    const hasContent = agent.messages?.length > 0 || 
                      agent.usedTools?.length > 0 || 
                      agent.sourceDocuments?.length > 0 ||
                      agent.artifacts?.length > 0 ||
                      agent.instructions;
    
    return (
        <motion.div
            {...animationPresets.agentCard}
            transition={{ 
                ...animationPresets.agentCard.transition,
                delay: index * 0.1 
            }}
        >
            <Card
                sx={{
                    mb: 2,
                    overflow: 'hidden',
                    borderRadius: '8px', // Consistent border radius
                    boxShadow: effects.shadows.sm, // Lighter shadow
                    border: '1px solid',
                    borderColor: 'divider',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '3px', // Thinner accent
                        height: '100%',
                        backgroundColor: agentColor
                    }
                }}
            >
                <CardContent sx={{ p: 0 }}>
                    {/* Header */}
                    <Box
                        onClick={() => hasContent && onToggle(agent.id)}
                        sx={{
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: hasContent ? 'pointer' : 'default',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                                bgcolor: hasContent ? 'action.hover' : 'transparent'
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                src={getAgentIcon(agent.nodeName, agent.instructions)}
                                sx={{ 
                                    width: 40, 
                                    height: 40,
                                    bgcolor: agentColor,
                                    boxShadow: effects.shadows.sm
                                }}
                            >
                                <IconRobot size={24} color="white" />
                            </Avatar>
                            
                            <Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {agent.agentName || 'Agent'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {agent.nodeName || 'Processing'}
                                </Typography>
                            </Box>
                        </Box>
                        
                        {hasContent && (
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <IconChevronDown size={20} />
                            </motion.div>
                        )}
                    </Box>
                    
                    {/* Content */}
                    {hasContent && (
                        <Collapse in={isExpanded}>
                            <Divider />
                            <Box sx={{ p: 2 }}>
                                {/* Instructions */}
                                {agent.instructions && (
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            bgcolor: 'background.default',
                                            borderRadius: '12px'
                                        }}
                                    >
                                        <Typography variant="overline" color="text.secondary" display="block" gutterBottom>
                                            INSTRUCTIONS
                                        </Typography>
                                        <Typography variant="body2">
                                            {agent.instructions}
                                        </Typography>
                                    </Paper>
                                )}
                                
                                {/* Messages */}
                                {agent.messages && agent.messages.length > 0 && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="overline" color="text.secondary" display="block" gutterBottom>
                                            THINKING PROCESS
                                        </Typography>
                                        
                                        {agent.messages.map((msg, msgIndex) => (
                                            <motion.div
                                                key={msgIndex}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: msgIndex * 0.1 }}
                                            >
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        mb: 1.5,
                                                        bgcolor: 'background.default',
                                                        borderRadius: '12px',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: effects.shadows.md
                                                        }
                                                    }}
                                                >
                                                    {renderMarkdown(msg.content)}
                                                </Paper>
                                            </motion.div>
                                        ))}
                                    </Box>
                                )}
                                
                                {/* Tools */}
                                {agent.usedTools && agent.usedTools.length > 0 && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="overline" color="text.secondary" display="block" gutterBottom>
                                            TOOLS USED
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {agent.usedTools.map((tool, toolIndex) => (
                                                tool && (
                                                    <Chip
                                                        key={toolIndex}
                                                        icon={<IconTool size={16} />}
                                                        label={tool.tool}
                                                        variant="outlined"
                                                        onClick={() => onToolClick && onToolClick(tool)}
                                                        onMouseEnter={() => setHoveredTool(toolIndex)}
                                                        onMouseLeave={() => setHoveredTool(null)}
                                                        sx={{
                                                            borderRadius: '8px',
                                                            transition: 'all 0.2s',
                                                            transform: hoveredTool === toolIndex ? 'translateY(-2px)' : 'none',
                                                            boxShadow: hoveredTool === toolIndex ? effects.shadows.sm : 'none',
                                                            '&:hover': {
                                                                bgcolor: 'action.hover'
                                                            }
                                                        }}
                                                    />
                                                )
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                                
                                {/* State */}
                                {agent.state && Object.keys(agent.state).length > 0 && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="overline" color="text.secondary" display="block" gutterBottom>
                                            STATE
                                        </Typography>
                                        
                                        <Chip
                                            icon={<IconDeviceSdCard size={16} />}
                                            label="View State"
                                            variant="outlined"
                                            onClick={() => onToolClick && onToolClick(agent.state, 'State')}
                                            sx={{
                                                borderRadius: '8px',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    bgcolor: 'action.hover',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: effects.shadows.sm
                                                }
                                            }}
                                        />
                                    </Box>
                                )}
                                
                                {/* Source Documents */}
                                {agent.sourceDocuments && agent.sourceDocuments.length > 0 && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="overline" color="text.secondary" display="block" gutterBottom>
                                            SOURCES
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {agent.sourceDocuments.map((source, sourceIndex) => (
                                                <Chip
                                                    key={sourceIndex}
                                                    label={source.title || `Source ${sourceIndex + 1}`}
                                                    variant="outlined"
                                                    onClick={() => onSourceClick && onSourceClick(source)}
                                                    onMouseEnter={() => setHoveredSource(sourceIndex)}
                                                    onMouseLeave={() => setHoveredSource(null)}
                                                    sx={{
                                                        borderRadius: '8px',
                                                        transition: 'all 0.2s',
                                                        transform: hoveredSource === sourceIndex ? 'translateY(-2px)' : 'none',
                                                        boxShadow: hoveredSource === sourceIndex ? effects.shadows.sm : 'none',
                                                        '&:hover': {
                                                            bgcolor: 'action.hover'
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                                
                                {/* Artifacts */}
                                {agent.artifacts && agent.artifacts.length > 0 && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="overline" color="text.secondary" display="block" gutterBottom>
                                            ARTIFACTS
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                            {agent.artifacts.map((artifact, artifactIndex) => (
                                                <motion.div
                                                    key={artifactIndex}
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                >
                                                    {artifact.type === 'png' || artifact.type === 'jpeg' ? (
                                                        <Box
                                                            sx={{
                                                                position: 'relative',
                                                                borderRadius: '12px',
                                                                overflow: 'hidden',
                                                                boxShadow: effects.shadows.md,
                                                                '&:hover::after': {
                                                                    opacity: 1
                                                                },
                                                                '&::after': {
                                                                    content: '"View"',
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    background: 'rgba(0,0,0,0.5)',
                                                                    color: 'white',
                                                                    opacity: 0,
                                                                    transition: 'opacity 0.2s'
                                                                }
                                                            }}
                                                            onClick={() => window.open(artifact.data, '_blank')}
                                                        >
                                                            <img 
                                                                src={artifact.data} 
                                                                alt="Generated artifact" 
                                                                style={{ 
                                                                    width: '100%', 
                                                                    maxWidth: '200px',
                                                                    height: 'auto',
                                                                    display: 'block'
                                                                }} 
                                                            />
                                                        </Box>
                                                    ) : (
                                                        <Paper
                                                            elevation={0}
                                                            sx={{
                                                                p: 2,
                                                                borderRadius: '12px',
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                maxWidth: '100%',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            {renderMarkdown(artifact.data)}
                                                        </Paper>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Collapse>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

AgentCard.propTypes = {
    agent: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    chatflowid: PropTypes.string,
    chatId: PropTypes.string,
    onToolClick: PropTypes.func,
    onSourceClick: PropTypes.func
};

export default AgentCard;
