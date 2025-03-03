import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

import AgentCard from './AgentCard';
import AgentTransition from './AgentTransition';

/**
 * AgentReasoningTimeline component displays the timeline of agent reasoning steps
 */
const AgentReasoningTimeline = ({ 
    agentReasoning, 
    expandedAgents, 
    onToggleAgent, 
    chatflowid, 
    chatId,
    onToolClick,
    onSourceClick
}) => {
    // Filter out agents and transitions
    const agents = agentReasoning.filter(agent => !agent.nextAgent);
    const transitions = agentReasoning.filter(agent => agent.nextAgent);
    
    // Combine agents and transitions in order
    const timelineItems = [...agents, ...transitions].sort((a, b) => {
        // Sort by startTime if available
        if (a.startTime && b.startTime) {
            return new Date(a.startTime) - new Date(b.startTime);
        }
        
        // Otherwise, keep the original order
        return agentReasoning.indexOf(a) - agentReasoning.indexOf(b);
    });
    
    return (
        <Box sx={{ position: 'relative', py: 2 }}>
            {/* Timeline line */}
            <Box
                sx={{
                    position: 'absolute',
                    left: '24px',
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    bgcolor: 'divider',
                    zIndex: 0
                }}
            />
            
            {timelineItems.map((item, index) => (
                <Fragment key={item.id || `item-${index}`}>
                    {item.nextAgent ? (
                        <AgentTransition 
                            nextAgent={item.nextAgent} 
                            index={index}
                        />
                    ) : (
                        <AgentCard 
                            agent={item} 
                            index={index}
                            isExpanded={expandedAgents.includes(item.id)}
                            onToggle={onToggleAgent}
                            chatflowid={chatflowid}
                            chatId={chatId}
                            onToolClick={onToolClick}
                            onSourceClick={onSourceClick}
                        />
                    )}
                </Fragment>
            ))}
        </Box>
    );
};

AgentReasoningTimeline.propTypes = {
    agentReasoning: PropTypes.array.isRequired,
    expandedAgents: PropTypes.array.isRequired,
    onToggleAgent: PropTypes.func.isRequired,
    chatflowid: PropTypes.string,
    chatId: PropTypes.string,
    onToolClick: PropTypes.func,
    onSourceClick: PropTypes.func
};

export default AgentReasoningTimeline;
