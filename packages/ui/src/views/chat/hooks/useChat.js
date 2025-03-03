// Custom hook for managing chat state and interactions
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { formatChatMessage, parseChatMessage, parseStreamEvent } from '../utils/parsers';
import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import chatmessageApi from '@/api/chatmessage';
import predictionApi from '@/api/prediction';
import { throttle } from 'lodash';

// Base URL for API requests
const baseURL = import.meta.env.VITE_UI_BASE_URL || '';

// Maximum number of retries for failed requests
const MAX_RETRIES = 3;
// Delay between retries (in ms)
const RETRY_DELAY = 1000;

/**
 * Custom hook for managing chat state and interactions
 */
const useChat = (chatflowid, options = {}) => {
    const {
        initialMessages = [],
        onError,
        onMessageStart,
        onMessageComplete,
        onMessageUpdate,
        onStreamStart,
        onStreamEnd,
        autoFocus = true,
        enableHistory = true,
        historyLength = 10,
        predictionId,
        sessionId: initialSessionId
    } = options;
    
    // Chat state
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamController, setStreamController] = useState(null);
    const [sessionId, setSessionId] = useState(initialSessionId || '');
    
    // Refs
    const abortControllerRef = useRef(null);
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const retryCountRef = useRef(0);
    
    // Input history
    const [inputHistory, setInputHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [tempInput, setTempInput] = useState('');

    // Load chat history when sessionId changes
    useEffect(() => {
        const loadHistory = async () => {
            if (!chatflowid || !sessionId) return;
            
            try {
                setIsLoading(true);
                
                const response = await chatmessageApi.getChatmessageFromPK(chatflowid, {
                    sessionId,
                    order: 'ASC',
                    feedback: true
                });
                
                if (response.data && Array.isArray(response.data)) {
                    const formattedMessages = response.data.map(message => ({
                        id: message.id,
                        role: message.role === 'apiMessage' ? 'assistant' : 'user',
                        content: message.content,
                        timestamp: message.createdDate,
                        sourceDocuments: message.sourceDocuments,
                        usedTools: message.usedTools,
                        fileAnnotations: message.fileAnnotations,
                        agentReasoning: message.agentReasoning,
                        action: message.action,
                        artifacts: message.artifacts,
                        fileUploads: message.fileUploads,
                        sessionId: message.sessionId,
                        feedback: message.feedback
                    }));
                    
                    setMessages(formattedMessages);
                } else {
                    setMessages([{
                        id: uuidv4(),
                        role: 'assistant',
                        content: 'Hi there! How can I help?',
                        timestamp: new Date().toISOString(),
                        sessionId
                    }]);
                }
            } catch (err) {
                console.error('Error loading chat history:', err);
                setError('Failed to load chat history');
                if (onError) onError(err);
                
                setMessages([{
                    id: uuidv4(),
                    role: 'assistant',
                    content: 'Hi there! How can I help?',
                    timestamp: new Date().toISOString(),
                    sessionId
                }]);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadHistory();
    }, [chatflowid, sessionId, onError]);

    // Extract sessionId from URL query parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlSessionId = urlParams.get('sessionId');
        
        if (urlSessionId) {
            setSessionId(urlSessionId);
        }
    }, []);

    // Handle stream events
    const handleStreamEvent = useCallback((parsedEvent, params) => {
        if (!parsedEvent) return;
        
        switch (parsedEvent.type) {
            case 'token':
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.role === 'assistant') {
                        lastMessage.content = (lastMessage.content || '') + parsedEvent.content;
                    }
                    return newMessages;
                });
                
                if (onMessageUpdate) {
                    onMessageUpdate({ type: 'token', content: parsedEvent.content });
                }
                break;
                
            case 'sourceDocuments':
            case 'usedTools':
            case 'fileAnnotations':
            case 'agentReasoning':
            case 'artifacts':
            case 'action':
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.role === 'assistant') {
                        lastMessage[parsedEvent.type] = parsedEvent.content;
                    }
                    return newMessages;
                });
                
                if (onMessageUpdate) {
                    onMessageUpdate({ type: parsedEvent.type, content: parsedEvent.content });
                }
                break;
                
            case 'metadata':
                if (parsedEvent.content.chatMessageId) {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMessage = newMessages[newMessages.length - 1];
                        if (lastMessage.role === 'assistant') {
                            lastMessage.id = parsedEvent.content.chatMessageId;
                        }
                        return newMessages;
                    });
                }
                break;
                
            case 'error':
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.role === 'assistant') {
                        lastMessage.content = parsedEvent.content;
                        lastMessage.isError = true;
                        lastMessage.isStreaming = false;
                    }
                    return newMessages;
                });
                
                setError(parsedEvent.content);
                setIsLoading(false);
                setIsStreaming(false);
                
                if (onError) {
                    onError(new Error(parsedEvent.content));
                }
                break;
                
            case 'end':
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.role === 'assistant') {
                        lastMessage.isStreaming = false;
                        if (onMessageComplete) {
                            onMessageComplete(lastMessage);
                        }
                    }
                    return newMessages;
                });
                
                setIsLoading(false);
                setIsStreaming(false);
                
                if (onStreamEnd) {
                    onStreamEnd();
                }
                break;
                
            default:
                console.log('Unknown event type:', parsedEvent.type);
                break;
        }
    }, [onMessageUpdate, onMessageComplete, onStreamEnd, onError]);

    // Send message
    const sendMessage = useCallback(async (content, attachments = [], requestOptions = {}) => {
        if ((!content || !content.trim()) && (!attachments || attachments.length === 0)) {
            return false;
        }
        
        setIsLoading(true);
        setError(null);
        
        const userMessage = formatChatMessage(content, 'user', { 
            fileUploads: attachments,
            sessionId: requestOptions.sessionId || sessionId
        });
        
        setMessages(prev => [...prev, userMessage]);
        
        try {
            // Add empty assistant message and set streaming state
            setIsStreaming(true);
            setMessages(prev => {
                const assistantMessage = formatChatMessage('', 'assistant', { 
                    isStreaming: true,
                    sessionId: requestOptions.sessionId || sessionId
                });
                
                // Call onMessageStart callback
                if (onMessageStart) {
                    onMessageStart(assistantMessage);
                }
                
                return [...prev, assistantMessage];
            });
            
            // Create abort controller
            abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;
            
            // Get authentication credentials
            const username = localStorage.getItem('username');
            const password = localStorage.getItem('password');
            const token = localStorage.getItem('site');
            
            // Fetch event stream
            await fetchEventSource(`${baseURL}/api/v1/internal-prediction/stream/${chatflowid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'x-request-from': 'internal',
                    ...(username && password ? {
                        'Authorization': 'Basic ' + btoa(username + ':' + password)
                    } : {}),
                    ...(token ? {
                        'Authorization': token
                    } : {})
                },
                body: JSON.stringify({
                    question: content,
                    sessionId: requestOptions.sessionId || sessionId,
                    ...requestOptions
                }),
                signal,
                onopen(response) {
                    // Check if we got a valid response
                    if (response.ok) {
                        const contentType = response.headers.get('content-type');
                        if (contentType && (
                            contentType.includes('text/event-stream') ||
                            contentType.includes('application/json')  // Accept JSON too as server might not set correct type
                        )) {
                            return; // Everything's good
                        }
                    }
                    
                    if (response.status === 401 || response.status === 403) {
                        throw new Error('Unauthorized. Please check your credentials.');
                    } else if (response.status === 404) {
                        throw new Error('Chat session not found.');
                    } else if (response.status >= 500) {
                        throw new Error('Server error. Please try again later.');
                    } else {
                        throw new Error(`Failed to connect to server: ${response.status} ${response.statusText}`);
                    }
                },
                onmessage(event) {
                    try {
                        console.log('Received event:', event);
                        const parsedEvent = parseStreamEvent(event, { 
                            chatflowid,
                            sessionId: requestOptions.sessionId || sessionId
                        });
                        
                        console.log('Parsed event:', parsedEvent);
                        if (parsedEvent) {
                            handleStreamEvent(parsedEvent, requestOptions);
                        }
                    } catch (err) {
                        console.error('Error handling stream event:', err);
                    }
                },
                onclose() {
                    console.log('Stream closed');
                    setIsLoading(false);
                    setIsStreaming(false);
                    
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMessage = newMessages[newMessages.length - 1];
                        if (lastMessage && lastMessage.role === 'assistant') {
                            lastMessage.isStreaming = false;
                            
                            // Call onMessageComplete callback
                            if (onMessageComplete) {
                                onMessageComplete(lastMessage);
                            }
                        }
                        return newMessages;
                    });
                    
                    if (onStreamEnd) {
                        onStreamEnd();
                    }
                },
                onerror(err) {
                    console.error('Stream error:', err);
                    setError(err.message || 'Failed to get response');
                    setIsLoading(false);
                    setIsStreaming(false);
                    
                    if (onError) {
                        onError(err);
                    }
                }
            });
            
            return true;
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.message || 'Failed to send message');
            setIsLoading(false);
            if (onError) onError(err);
            return false;
        }
    }, [chatflowid, sessionId, onMessageComplete, onError]);

    // Clear chat
    const clearChat = useCallback(async () => {
        try {
            if (chatflowid && sessionId) {
                await chatmessageApi.deleteChatmessage(chatflowid, { sessionId });
            }
            
            setMessages([{
                id: uuidv4(),
                role: 'assistant',
                content: 'Hi there! How can I help?',
                timestamp: new Date().toISOString(),
                sessionId
            }]);
            
            setError(null);
            return true;
        } catch (err) {
            console.error('Error clearing chat:', err);
            setError('Failed to clear chat');
            if (onError) onError(err);
            return false;
        }
    }, [chatflowid, sessionId, onError]);

    // Abort message
    const abortMessage = useCallback(async () => {
        try {
            if (chatflowid && sessionId) {
                await chatmessageApi.abortMessage(chatflowid, sessionId);
            }
            
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
            
            setIsLoading(false);
            setIsStreaming(false);
            return true;
        } catch (err) {
            console.error('Error aborting message:', err);
            setIsLoading(false);
            setIsStreaming(false);
            return false;
        }
    }, [chatflowid, sessionId]);

    return {
        messages,
        setMessages,
        inputRef,
        messagesEndRef,
        sendMessage,
        clearChat,
        abortMessage,
        isLoading,
        isStreaming,
        error,
        sessionId
    };
};

export default useChat;
