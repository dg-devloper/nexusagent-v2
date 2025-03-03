import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import chatmessageApi from '@/api/chatmessage';

/**
 * Custom hook for managing chat sessions
 * @param {Object} options - Configuration options
 * @returns {Object} - Chat sessions state and methods
 */
const useChatSessions = (options = {}) => {
    const {
        onError,
        autoLoad = true
    } = options;
    
    const navigate = useNavigate();
    
    // Chat sessions state
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Fetch all chat sessions
    const fetchSessions = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Get the chatflow ID from the URL
            const chatflowId = window.location.pathname.split('/').pop();
            
            console.log(`Fetching chat sessions for chatflowId: ${chatflowId}`);
            
            // Get all chat messages for the chatflow
            const response = await chatmessageApi.getAllChatmessageFromChatflow(chatflowId);
            
            // Group messages by sessionId
            const sessions = {};
            const messages = response.data || [];
            
            messages.forEach(message => {
                if (message.sessionId) {
                    if (!sessions[message.sessionId]) {
                        sessions[message.sessionId] = {
                            id: message.sessionId,
                            title: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
                            firstMessage: message.content,
                            lastMessage: message.content,
                            createdAt: message.createdDate,
                            updatedAt: message.createdDate,
                            isPinned: false,
                            messageCount: 1
                        };
                    } else {
                        sessions[message.sessionId].messageCount++;
                        
                        // Update lastMessage if this message is newer
                        if (new Date(message.createdDate) > new Date(sessions[message.sessionId].updatedAt)) {
                            sessions[message.sessionId].lastMessage = message.content;
                            sessions[message.sessionId].updatedAt = message.createdDate;
                        }
                        
                        // Update firstMessage if this message is older
                        if (new Date(message.createdDate) < new Date(sessions[message.sessionId].createdAt)) {
                            sessions[message.sessionId].firstMessage = message.content;
                            sessions[message.sessionId].createdAt = message.createdDate;
                        }
                    }
                }
            });
            
            // Convert to array and sort by updatedAt
            const sessionsArray = Object.values(sessions).sort((a, b) => 
                new Date(b.updatedAt) - new Date(a.updatedAt)
            );
            
            setSessions(sessionsArray);
            
            setIsLoading(false);
            return sessionsArray;
        } catch (err) {
            console.error('Error fetching chat sessions:', err);
            setError('Failed to fetch chat sessions');
            setIsLoading(false);
            
            if (onError) {
                onError(err);
            }
            
            return [];
        }
    }, [onError]);
    
    // Create a new chat session
    const createSession = useCallback(async (title = 'New Chat', sessionId) => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Get the chatflow ID from the URL
            const chatflowId = window.location.pathname.split('/').pop();
            
            // Create a session object
            const sessionData = {
                id: sessionId || uuidv4(), // Use provided sessionId or generate new one
                title,
                firstMessage: '',
                lastMessage: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isPinned: false,
                messageCount: 0
            };
            
            // Add new session to state
            setSessions(prev => [sessionData, ...prev]);
            
            setIsLoading(false);
            return sessionData;
        } catch (err) {
            console.error('Error creating chat session:', err);
            setError('Failed to create chat session');
            setIsLoading(false);
            
            if (onError) {
                onError(err);
            }
            
            return null;
        }
    }, [navigate, onError]);
    
    // Update an existing chat session
    const updateSession = useCallback(async (sessionId, data) => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Update session in state
            const updatedSession = { id: sessionId, ...data };
            
            setSessions(prev => 
                prev.map(session => 
                    session.id === sessionId ? { ...session, ...updatedSession } : session
                )
            );
            
            setIsLoading(false);
            return updatedSession;
        } catch (err) {
            console.error('Error updating chat session:', err);
            setError('Failed to update chat session');
            setIsLoading(false);
            
            if (onError) {
                onError(err);
            }
            
            return null;
        }
    }, [onError]);
    
    // Delete a chat session
    const deleteSession = useCallback(async (sessionId) => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Get the chatflow ID from the URL
            const chatflowId = window.location.pathname.split('/').pop();
            
            // Delete all messages with this sessionId
            await chatmessageApi.deleteChatmessage(chatflowId, { sessionId });
            
            // Remove session from state
            setSessions(prev => prev.filter(session => session.id !== sessionId));
            
            setIsLoading(false);
            return true;
        } catch (err) {
            console.error('Error deleting chat session:', err);
            setError('Failed to delete chat session');
            setIsLoading(false);
            
            if (onError) {
                onError(err);
            }
            
            return false;
        }
    }, [onError]);
    
    // Select a chat session
    const selectSession = useCallback((sessionId) => {
        // Get the chatflow ID from the URL
        const chatflowId = window.location.pathname.split('/').pop();
        navigate(`/chat-ai/${chatflowId}?sessionId=${sessionId}`);
    }, [navigate]);
    
    // Load chat sessions when component mounts
    useEffect(() => {
        let isMounted = true;
        
        if (autoLoad && isMounted) {
            // Only fetch sessions once on mount
            fetchSessions();
        }
        
        return () => {
            isMounted = false;
        };
    }, [autoLoad]); // Remove fetchSessions from dependencies to prevent infinite loop
    
    return {
        sessions,
        isLoading,
        error,
        fetchSessions,
        createSession,
        updateSession,
        deleteSession,
        selectSession
    };
};

export default useChatSessions;
