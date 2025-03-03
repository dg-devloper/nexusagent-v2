// Custom hook for handling agent reasoning data
import { useState, useEffect, useMemo } from 'react';
import { parseAgentReasoning } from '../utils/parsers';

/**
 * Custom hook for handling agent reasoning data
 * @param {Array} data - Raw agent reasoning data
 * @param {Object} options - Configuration options
 * @returns {Object} - Agent reasoning state and controls
 */
const useAgentReasoning = (data, options = {}) => {
    const { 
        chatflowid,
        chatId,
        autoExpand = false,
        initialExpandedAgents = []
    } = options;
    
    // Parse the agent reasoning data
    const parsedData = useMemo(() => {
        return parseAgentReasoning(data, { chatflowid, chatId });
    }, [data, chatflowid, chatId]);
    
    // State for expanded agents
    const [expandedAgents, setExpandedAgents] = useState(initialExpandedAgents);
    
    // State for expanded reasoning
    const [isReasoningExpanded, setIsReasoningExpanded] = useState(autoExpand);
    
    // Update expanded agents when data changes
    useEffect(() => {
        if (autoExpand && parsedData.length > 0) {
            // Auto-expand all agents
            setExpandedAgents(parsedData.map(agent => agent.id));
        }
    }, [parsedData, autoExpand]);
    
    // Calculate statistics
    const stats = useMemo(() => {
        if (!parsedData || parsedData.length === 0) return null;
        
        const agentCount = parsedData.filter(a => !a.nextAgent).length;
        const toolCount = parsedData.reduce((sum, agent) => 
            sum + (agent.usedTools?.length || 0), 0);
        const messageCount = parsedData.reduce((sum, agent) => 
            sum + (agent.messages?.length || 0), 0);
        const artifactCount = parsedData.reduce((sum, agent) => 
            sum + (agent.artifacts?.length || 0), 0);
        
        return { 
            agentCount, 
            toolCount, 
            messageCount,
            artifactCount,
            hasTools: toolCount > 0,
            hasArtifacts: artifactCount > 0
        };
    }, [parsedData]);
    
    // Toggle agent expansion
    const toggleAgent = (agentId) => {
        setExpandedAgents(prev => {
            if (prev.includes(agentId)) {
                return prev.filter(id => id !== agentId);
            } else {
                return [...prev, agentId];
            }
        });
    };
    
    // Expand all agents
    const expandAllAgents = () => {
        setExpandedAgents(parsedData.map(agent => agent.id));
    };
    
    // Collapse all agents
    const collapseAllAgents = () => {
        setExpandedAgents([]);
    };
    
    // Toggle reasoning expansion
    const toggleReasoningExpanded = () => {
        setIsReasoningExpanded(prev => !prev);
    };
    
    // Check if an agent is expanded
    const isAgentExpanded = (agentId) => {
        return expandedAgents.includes(agentId);
    };
    
    // Get agents by status
    const getAgentsByStatus = (status) => {
        return parsedData.filter(agent => agent.status === status);
    };
    
    // Get completed agents
    const completedAgents = useMemo(() => {
        return getAgentsByStatus('completed');
    }, [parsedData]);
    
    // Get running agents
    const runningAgents = useMemo(() => {
        return getAgentsByStatus('running');
    }, [parsedData]);
    
    // Get error agents
    const errorAgents = useMemo(() => {
        return getAgentsByStatus('error');
    }, [parsedData]);
    
    // Get agent transitions
    const transitions = useMemo(() => {
        return parsedData.filter(agent => agent.nextAgent);
    }, [parsedData]);
    
    return {
        agents: parsedData,
        expandedAgents,
        isReasoningExpanded,
        stats,
        completedAgents,
        runningAgents,
        errorAgents,
        transitions,
        toggleAgent,
        expandAllAgents,
        collapseAllAgents,
        toggleReasoningExpanded,
        isAgentExpanded
    };
};

export default useAgentReasoning;
