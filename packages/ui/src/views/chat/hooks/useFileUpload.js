import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import chatmessageApi from '@/api/chatmessage';

/**
 * Hook for managing file uploads with progress tracking and error handling
 * @returns {Object} File upload state and methods
 */
const useFileUpload = () => {
    const [uploads, setUploads] = useState([]);
    const [error, setError] = useState(null);

    /**
     * Upload a file with progress tracking
     * @param {File} file - The file to upload
     * @returns {Promise<string>} The upload ID
     */
    const uploadFile = async (file) => {
        try {
            // Get storage path from API
            const { data: { path } } = await chatmessageApi.getStoragePath();
            
            // Create upload object
            const upload = {
                id: uuidv4(),
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                progress: 0,
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            
            // Add to uploads state
            setUploads(prev => [...prev, upload]);
            
            // Create form data
            const formData = new FormData();
            formData.append('file', file);
            
            // Upload with progress tracking
            await axios.post(path, formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    
                    setUploads(prev => 
                        prev.map(u => 
                            u.id === upload.id 
                                ? { 
                                    ...u, 
                                    progress, 
                                    status: 'uploading',
                                    updatedAt: new Date().toISOString()
                                }
                                : u
                        )
                    );
                }
            });
            
            // Update status on completion
            setUploads(prev =>
                prev.map(u =>
                    u.id === upload.id
                        ? { 
                            ...u, 
                            status: 'complete', 
                            progress: 100,
                            completedAt: new Date().toISOString()
                        }
                        : u
                )
            );
            
            return upload.id;
        } catch (err) {
            console.error('Upload error:', err);
            
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            
            // Update upload status
            setUploads(prev =>
                prev.map(u =>
                    u.id === upload.id
                        ? { 
                            ...u, 
                            status: 'error',
                            error: errorMessage,
                            updatedAt: new Date().toISOString()
                        }
                        : u
                )
            );
            
            throw new Error(errorMessage);
        }
    };

    /**
     * Retry a failed upload
     * @param {string} uploadId - The ID of the upload to retry
     */
    const retryUpload = useCallback(async (uploadId) => {
        const upload = uploads.find(u => u.id === uploadId);
        if (!upload || upload.status !== 'error') return;
        
        try {
            // Reset upload state
            setUploads(prev =>
                prev.map(u =>
                    u.id === uploadId
                        ? { ...u, status: 'pending', progress: 0, error: null }
                        : u
                )
            );
            
            // Attempt upload again
            await uploadFile(upload.file);
        } catch (err) {
            // Error handling done in uploadFile
            console.error('Retry failed:', err);
        }
    }, [uploads]);

    /**
     * Remove an upload from the list
     * @param {string} uploadId - The ID of the upload to remove
     */
    const removeUpload = useCallback((uploadId) => {
        setUploads(prev => prev.filter(u => u.id !== uploadId));
    }, []);

    /**
     * Clear all uploads
     */
    const clearUploads = useCallback(() => {
        setUploads([]);
        setError(null);
    }, []);

    return {
        uploads,
        error,
        uploadFile,
        retryUpload,
        removeUpload,
        clearUploads
    };
};

export default useFileUpload;
