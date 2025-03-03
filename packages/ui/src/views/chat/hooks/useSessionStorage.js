import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DB_NAME = 'chatSessions';
const DB_VERSION = 1;
const STORE_NAME = 'sessions';

/**
 * Hook for managing session persistence with IndexedDB
 * @returns {Object} Session storage methods and state
 */
const useSessionStorage = () => {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState(null);
    const dbRef = useRef(null);

    // Initialize database
    useEffect(() => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            setError('Failed to open database');
        };

        request.onsuccess = (event) => {
            dbRef.current = event.target.result;
            setIsReady(true);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create sessions store
            const store = db.createObjectStore(STORE_NAME, {
                keyPath: 'id'
            });
            
            // Create indexes
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('title', 'title', { unique: false });
            store.createIndex('chatflowId', 'chatflowId', { unique: false });
        };

        // Cleanup
        return () => {
            if (dbRef.current) {
                dbRef.current.close();
            }
        };
    }, []);

    /**
     * Save session to storage
     * @param {Object} session - Session to save
     */
    const saveSession = useCallback(async (session) => {
        if (!isReady) throw new Error('Database not ready');

        try {
            const transaction = dbRef.current.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const timestamp = new Date().toISOString();
            const sessionData = {
                ...session,
                timestamp,
                lastUpdated: timestamp
            };

            await new Promise((resolve, reject) => {
                const request = store.put(sessionData);
                request.onsuccess = () => resolve(sessionData);
                request.onerror = () => reject(request.error);
            });

            return sessionData;
        } catch (err) {
            console.error('Error saving session:', err);
            setError('Failed to save session');
            throw err;
        }
    }, [isReady]);

    /**
     * Get session by ID
     * @param {string} id - Session ID
     */
    const getSession = useCallback(async (id) => {
        if (!isReady) throw new Error('Database not ready');

        try {
            const transaction = dbRef.current.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            return await new Promise((resolve, reject) => {
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (err) {
            console.error('Error getting session:', err);
            setError('Failed to get session');
            throw err;
        }
    }, [isReady]);

    /**
     * Get all sessions
     * @param {Object} options - Query options
     */
    const getAllSessions = useCallback(async (options = {}) => {
        if (!isReady) throw new Error('Database not ready');

        const {
            chatflowId,
            limit,
            orderBy = 'timestamp',
            order = 'desc'
        } = options;

        try {
            const transaction = dbRef.current.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index(orderBy);

            let request;
            if (chatflowId) {
                const chatflowIndex = store.index('chatflowId');
                request = chatflowIndex.getAll(chatflowId);
            } else {
                request = index.getAll();
            }

            const sessions = await new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });

            // Sort and limit results
            const sortedSessions = sessions.sort((a, b) => {
                const aValue = a[orderBy];
                const bValue = b[orderBy];
                return order === 'desc' 
                    ? bValue.localeCompare(aValue)
                    : aValue.localeCompare(bValue);
            });

            return limit ? sortedSessions.slice(0, limit) : sortedSessions;
        } catch (err) {
            console.error('Error getting sessions:', err);
            setError('Failed to get sessions');
            throw err;
        }
    }, [isReady]);

    /**
     * Delete session by ID
     * @param {string} id - Session ID
     */
    const deleteSession = useCallback(async (id) => {
        if (!isReady) throw new Error('Database not ready');

        try {
            const transaction = dbRef.current.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            await new Promise((resolve, reject) => {
                const request = store.delete(id);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch (err) {
            console.error('Error deleting session:', err);
            setError('Failed to delete session');
            throw err;
        }
    }, [isReady]);

    /**
     * Export sessions to JSON
     */
    const exportSessions = useCallback(async () => {
        if (!isReady) throw new Error('Database not ready');

        try {
            const sessions = await getAllSessions();
            const blob = new Blob(
                [JSON.stringify(sessions, null, 2)],
                { type: 'application/json' }
            );
            return blob;
        } catch (err) {
            console.error('Error exporting sessions:', err);
            setError('Failed to export sessions');
            throw err;
        }
    }, [isReady, getAllSessions]);

    /**
     * Import sessions from JSON
     * @param {File} file - JSON file to import
     */
    const importSessions = useCallback(async (file) => {
        if (!isReady) throw new Error('Database not ready');

        try {
            const content = await file.text();
            const sessions = JSON.parse(content);

            const transaction = dbRef.current.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            // Import each session
            const imports = sessions.map(session => {
                const sessionData = {
                    ...session,
                    id: session.id || uuidv4(),
                    timestamp: session.timestamp || new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                };
                return new Promise((resolve, reject) => {
                    const request = store.put(sessionData);
                    request.onsuccess = () => resolve(sessionData);
                    request.onerror = () => reject(request.error);
                });
            });

            return await Promise.all(imports);
        } catch (err) {
            console.error('Error importing sessions:', err);
            setError('Failed to import sessions');
            throw err;
        }
    }, [isReady]);

    return {
        isReady,
        error,
        saveSession,
        getSession,
        getAllSessions,
        deleteSession,
        exportSessions,
        importSessions
    };
};

export default useSessionStorage;
