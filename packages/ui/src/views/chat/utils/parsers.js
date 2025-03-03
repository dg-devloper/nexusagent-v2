// Data parsing utilities for the chat UI
import { v4 as uuidv4 } from 'uuid';

// Base URL for API requests
const baseURL = import.meta.env.VITE_BASE_URL || '';

/**
 * Parse agent reasoning data
 * @param {Array} data - Raw agent reasoning data
 * @param {Object} options - Parsing options
 * @returns {Array} - Parsed agent reasoning data
 */
export const parseAgentReasoning = (data, options = {}) => {
    const { chatflowid, chatId } = options;
    
    if (!data || !Array.isArray(data)) return [];
    
    return data.filter(agent => agent !== null && agent !== undefined).map(agent => {
        // Ensure all properties have appropriate default values
        return {
            id: agent.id || uuidv4(),
            agentName: agent.agentName || 'Agent',
            nodeName: agent.nodeName || '',
            instructions: agent.instructions || '',
            messages: parseMessages(agent.messages || [agent.message || '']),
            usedTools: parseTools(agent.usedTools || []),
            state: agent.state || {},
            nextAgent: agent.nextAgent,
            sourceDocuments: parseSourceDocuments(agent.sourceDocuments || []),
            artifacts: parseArtifacts(agent.artifacts || [], { chatflowid, chatId }),
            startTime: agent.startTime || new Date().toISOString(),
            endTime: agent.endTime,
            status: agent.status || 'completed',
            error: agent.error
        };
    });
};

/**
 * Parse message data
 * @param {Array|String} messages - Raw message data
 * @returns {Array} - Parsed message data
 */
export const parseMessages = (messages) => {
    if (typeof messages === 'string') {
        return [{
            id: uuidv4(),
            content: messages,
            type: 'thinking',
            timestamp: new Date().toISOString()
        }];
    }
    
    if (!messages || !Array.isArray(messages)) return [];
    
    return messages.filter(msg => msg !== null && msg !== undefined).map(msg => {
        if (typeof msg === 'string') {
            return {
                id: uuidv4(),
                content: msg,
                type: 'thinking',
                timestamp: new Date().toISOString()
            };
        }
        
        return {
            id: msg.id || uuidv4(),
            content: msg.content || msg.text || '',
            type: msg.type || 'thinking',
            timestamp: msg.timestamp || new Date().toISOString()
        };
    });
};

/**
 * Parse tool usage data
 * @param {Array} tools - Raw tool usage data
 * @returns {Array} - Parsed tool usage data
 */
export const parseTools = (tools) => {
    if (!tools || !Array.isArray(tools)) return [];
    
    return tools.filter(tool => tool !== null && tool !== undefined).map(tool => {
        if (typeof tool === 'string') {
            return {
                id: uuidv4(),
                tool: tool,
                input: null,
                output: null,
                timestamp: new Date().toISOString(),
                duration: 0
            };
        }
        
        return {
            id: tool.id || uuidv4(),
            tool: tool.tool || tool.name || '',
            input: tool.input || null,
            output: tool.output || null,
            timestamp: tool.timestamp || new Date().toISOString(),
            duration: tool.duration || 0
        };
    });
};

/**
 * Parse source document data
 * @param {Array} documents - Raw source document data
 * @returns {Array} - Parsed source document data
 */
export const parseSourceDocuments = (documents) => {
    if (!documents || !Array.isArray(documents)) return [];
    
    return documents.filter(doc => doc !== null && doc !== undefined).map(doc => ({
        id: doc.id || uuidv4(),
        title: doc.title || doc.metadata?.title || '',
        pageContent: doc.pageContent || '',
        metadata: doc.metadata || {}
    }));
};

/**
 * Parse artifact data
 * @param {Array} artifacts - Raw artifact data
 * @param {Object} options - Parsing options
 * @returns {Array} - Parsed artifact data
 */
export const parseArtifacts = (artifacts, options = {}) => {
    if (!artifacts || !Array.isArray(artifacts)) return [];
    
    const { chatflowid, chatId } = options;
    
    return artifacts.filter(artifact => artifact !== null && artifact !== undefined).map(artifact => {
        // Handle URL for images
        let data = artifact.data;
        if ((artifact.type === 'png' || artifact.type === 'jpeg') && 
            data && typeof data === 'string' && data.startsWith('FILE-STORAGE::')) {
            data = `${baseURL}/api/v1/get-upload-file?chatflowId=${chatflowid}&chatId=${chatId}&fileName=${data.replace('FILE-STORAGE::', '')}`;
        }
        
        return {
            id: artifact.id || uuidv4(),
            type: artifact.type || 'text',
            name: artifact.name || '',
            data: data || '',
            metadata: artifact.metadata || {}
        };
    });
};

/**
 * Parse chat message data
 * @param {Object} message - Raw chat message data
 * @param {Object} options - Parsing options
 * @returns {Object} - Parsed chat message data
 */
export const parseChatMessage = (message, options = {}) => {
    const { chatflowid, chatId } = options;
    
    if (!message) return null;
    
    return {
        id: message.id || uuidv4(),
        role: message.role || message.type || 'user',
        content: message.content || message.message || '',
        timestamp: message.timestamp || new Date().toISOString(),
        sourceDocuments: parseSourceDocuments(message.sourceDocuments || []),
        usedTools: parseTools(message.usedTools || []),
        fileAnnotations: message.fileAnnotations || [],
        agentReasoning: parseAgentReasoning(message.agentReasoning || [], { chatflowid, chatId }),
        action: message.action || null,
        artifacts: parseArtifacts(message.artifacts || [], { chatflowid, chatId }),
        feedback: message.feedback || null,
        fileUploads: message.fileUploads || [],
        isStreaming: message.isStreaming || false,
        isError: message.isError || false
    };
};

/**
 * Parse chat session data
 * @param {Object} session - Raw chat session data
 * @returns {Object} - Parsed chat session data
 */
export const parseChatSession = (session) => {
    if (!session) return null;
    
    return {
        id: session.id || uuidv4(),
        title: session.title || 'New Chat',
        createdAt: session.createdAt || new Date().toISOString(),
        updatedAt: session.updatedAt || new Date().toISOString(),
        messageCount: session.messageCount || 0,
        firstMessage: session.firstMessage || '',
        lastMessage: session.lastMessage || '',
        isPinned: session.isPinned || false,
        tags: session.tags || []
    };
};

/**
 * Format a chat message for display
 * @param {String} content - Message content
 * @param {String} role - Message role (user, assistant, system)
 * @param {Object} additionalData - Additional message data
 * @returns {Object} - Formatted message object
 */
export const formatChatMessage = (content, role, additionalData = {}) => {
    return {
        id: uuidv4(),
        role,
        content,
        timestamp: new Date().toISOString(),
        ...additionalData
    };
};

/**
 * Parse streaming event data
 * @param {Object} event - Streaming event data
 * @param {Object} options - Parsing options
 * @returns {Object} - Parsed event data
 */
export const parseStreamEvent = (event, options = {}) => {
    const { chatflowid, chatId } = options;
    
    if (!event || !event.data) return null;
    
    try {
        console.log('Raw event data:', event.data);
        let payload;
        
        // Handle different response formats
        try {
            // Try to parse as JSON first
            payload = JSON.parse(event.data);
            
            // If it's a regular JSON response (not streaming)
            if (payload.text) {
                return {
                    type: 'token',
                    content: payload.text
                };
            }
            
            // If it's a streaming JSON response
            if (payload.type || payload.event) {
                return {
                    type: payload.type || payload.event,
                    content: payload.data || payload.content
                };
            }
        } catch (err) {
            // If not JSON, treat as plain text token
            return {
                type: 'token',
                content: event.data
            };
        }
        
        console.log('Parsed event payload:', payload);
        
        // Handle both event and type fields for compatibility
        const eventType = payload.event || payload.type;
        const content = payload.data || payload.content;
        
        if (!eventType && content) {
            // If no event type but has content, treat as token
            return {
                type: 'token',
                content: content
            };
        }
        
        switch (eventType) {
            case 'token':
                return {
                    type: 'token',
                    content: typeof content === 'string' ? content : JSON.stringify(content)
                };
                
            case 'agentReasoning':
                return {
                    type: 'agentReasoning',
                    content: parseAgentReasoning(payload.data || payload.content || [], { chatflowid, chatId })
                };
                
            case 'sourceDocuments':
                return {
                    type: 'sourceDocuments',
                    content: parseSourceDocuments(payload.data || payload.content || [])
                };
                
            case 'usedTools':
                return {
                    type: 'usedTools',
                    content: parseTools(payload.data || payload.content || [])
                };
                
            case 'fileAnnotations':
                return {
                    type: 'fileAnnotations',
                    content: payload.data || payload.content || []
                };
                
            case 'artifacts':
                return {
                    type: 'artifacts',
                    content: parseArtifacts(payload.data || payload.content || [], { chatflowid, chatId })
                };
                
            case 'action':
                return {
                    type: 'action',
                    content: payload.data || payload.content || null
                };
                
            case 'nextAgent':
                return {
                    type: 'nextAgent',
                    content: payload.data || payload.content || null
                };
                
            case 'metadata':
                return {
                    type: 'metadata',
                    content: payload.data || payload.content || {}
                };
                
            case 'error':
                return {
                    type: 'error',
                    content: payload.data || payload.content || payload.error || 'Unknown error'
                };
                
            case 'abort':
                return {
                    type: 'abort',
                    content: payload.data || payload.content || null
                };
                
            case 'end':
                return {
                    type: 'end',
                    content: payload.data || payload.content || null
                };
                
            default:
                return {
                    type: 'unknown',
                    content: payload.data
                };
        }
    } catch (error) {
        console.error('Error parsing stream event:', error);
        return {
            type: 'error',
            content: 'Error parsing stream event'
        };
    }
};
