/**
 * Validation utilities for chat data
 */
import { v4 as uuidv4 } from 'uuid';

// Maximum file size in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = {
    // Images
    'image/jpeg': { maxSize: 5 * 1024 * 1024, ext: ['jpg', 'jpeg'] },
    'image/png': { maxSize: 5 * 1024 * 1024, ext: ['png'] },
    'image/gif': { maxSize: 5 * 1024 * 1024, ext: ['gif'] },
    'image/webp': { maxSize: 5 * 1024 * 1024, ext: ['webp'] },
    // Documents
    'application/pdf': { maxSize: 10 * 1024 * 1024, ext: ['pdf'] },
    'application/msword': { maxSize: 10 * 1024 * 1024, ext: ['doc'] },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { maxSize: 10 * 1024 * 1024, ext: ['docx'] },
    'text/plain': { maxSize: 1 * 1024 * 1024, ext: ['txt'] },
    'text/markdown': { maxSize: 1 * 1024 * 1024, ext: ['md'] },
    // Code
    'text/javascript': { maxSize: 1 * 1024 * 1024, ext: ['js'] },
    'text/typescript': { maxSize: 1 * 1024 * 1024, ext: ['ts'] },
    'text/jsx': { maxSize: 1 * 1024 * 1024, ext: ['jsx'] },
    'text/tsx': { maxSize: 1 * 1024 * 1024, ext: ['tsx'] },
    'text/css': { maxSize: 1 * 1024 * 1024, ext: ['css'] },
    'text/html': { maxSize: 1 * 1024 * 1024, ext: ['html', 'htm'] }
};

// Dangerous file extensions that could contain malware
const DANGEROUS_EXTENSIONS = [
    'exe', 'dll', 'so', 'bat', 'cmd', 'sh', 'app',
    'msi', 'dmg', 'pkg', 'deb', 'rpm', 'apk', 'ipa'
];

/**
 * Validate and standardize session ID
 * @param {string} sessionId - Session ID to validate
 * @returns {string} - Valid session ID
 */
export const validateSessionId = (sessionId) => {
    if (!sessionId || typeof sessionId !== 'string') {
        return uuidv4(); // Generate a new ID if invalid
    }
    return sessionId;
};

/**
 * Check if a file extension is potentially dangerous
 * @param {string} filename - Name of the file to check
 * @returns {boolean} - True if the file extension is dangerous
 */
const hasDangerousExtension = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    return DANGEROUS_EXTENSIONS.includes(ext);
};

/**
 * Validate file type and size
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result
 */
export const validateFileUpload = (file, options = {}) => {
    const {
        maxSizeMB = 10,
        allowedTypes = null
    } = options;

    const errors = [];
    const maxSize = maxSizeMB * 1024 * 1024;

    // Check if file exists
    if (!file) {
        return {
            valid: false,
            errors: ['No file provided']
        };
    }

    // Check file size
    if (file.size > maxSize) {
        errors.push(`File size exceeds ${maxSizeMB}MB limit`);
    }

    // Check if file type is allowed
    if (allowedTypes) {
        if (!allowedTypes.includes(file.type)) {
            errors.push(`File type ${file.type} is not allowed`);
        }
    } else {
        // If no specific types are provided, check against ALLOWED_FILE_TYPES
        const fileType = ALLOWED_FILE_TYPES[file.type];
        if (!fileType) {
            errors.push(`File type ${file.type} is not supported`);
        } else if (file.size > fileType.maxSize) {
            errors.push(`${file.type} files must be under ${fileType.maxSize / (1024 * 1024)}MB`);
        }
    }

    // Check for dangerous extensions
    if (hasDangerousExtension(file.name)) {
        errors.push('File type not allowed for security reasons');
    }

    // Validate file name
    if (!/^[a-zA-Z0-9-_. ]+$/.test(file.name)) {
        errors.push('File name contains invalid characters');
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Validate and standardize message request data
 * @param {Object} data - Request data to validate
 * @param {string} sessionId - Current session ID
 * @returns {Object} - Validated request data
 */
export const validateRequestData = (data, sessionId) => {
    const validSessionId = validateSessionId(data.sessionId || sessionId);
    
    // Create a standardized request object
    const requestData = {
        question: data.question || '',
        sessionId: validSessionId,
        streaming: data.streaming !== false, // Default to true
    };
    
    // Add uploads if present and valid
    if (data.uploads && Array.isArray(data.uploads) && data.uploads.length > 0) {
        requestData.uploads = data.uploads.map(upload => validateFileUpload(upload));
    }
    
    // Add action if present
    if (data.action && typeof data.action === 'object') {
        requestData.action = data.action;
    }
    
    // Add any additional properties
    Object.keys(data).forEach(key => {
        if (!['question', 'sessionId', 'streaming', 'uploads', 'action'].includes(key)) {
            requestData[key] = data[key];
        }
    });
    
    return requestData;
};

/**
 * Validate and standardize chat message data
 * @param {Object} message - Message data to validate
 * @returns {Object} - Validated message data
 */
export const validateMessage = (message) => {
    if (!message || typeof message !== 'object') {
        throw new Error('Invalid message data');
    }
    
    // Create a standardized message object
    return {
        id: message.id || uuidv4(),
        role: message.role || 'user',
        content: message.content || '',
        timestamp: message.timestamp || new Date().toISOString(),
        sessionId: message.sessionId || '',
        isStreaming: !!message.isStreaming,
        isError: !!message.isError,
        // Optional fields
        ...(message.sourceDocuments && { sourceDocuments: message.sourceDocuments }),
        ...(message.usedTools && { usedTools: message.usedTools }),
        ...(message.fileAnnotations && { fileAnnotations: message.fileAnnotations }),
        ...(message.agentReasoning && { agentReasoning: message.agentReasoning }),
        ...(message.action && { action: message.action }),
        ...(message.artifacts && { artifacts: message.artifacts }),
        ...(message.fileUploads && { fileUploads: message.fileUploads }),
        ...(message.feedback && { feedback: message.feedback })
    };
};

/**
 * Validate API response data
 * @param {Object} response - API response to validate
 * @returns {Object} - Validated response data
 */
export const validateApiResponse = (response) => {
    if (!response || typeof response !== 'object') {
        throw new Error('Invalid API response');
    }
    
    // Extract text content from response
    let text = '';
    if (response.text) {
        text = response.text;
    } else if (response.json) {
        text = '```json\n' + JSON.stringify(response.json, null, 2) + '\n```';
    } else {
        text = JSON.stringify(response, null, 2);
    }
    
    // Create a standardized response object
    return {
        text,
        chatId: response.chatId || '',
        chatMessageId: response.chatMessageId || '',
        sessionId: response.sessionId || '',
        // Optional fields
        ...(response.sourceDocuments && { sourceDocuments: response.sourceDocuments }),
        ...(response.usedTools && { usedTools: response.usedTools }),
        ...(response.fileAnnotations && { fileAnnotations: response.fileAnnotations }),
        ...(response.agentReasoning && { agentReasoning: response.agentReasoning }),
        ...(response.action && { action: response.action }),
        ...(response.artifacts && { artifacts: response.artifacts })
    };
};

/**
 * Validate stream event data
 * @param {Object} event - Stream event to validate
 * @returns {Object|null} - Validated event data or null if invalid
 */
export const validateStreamEvent = (event) => {
    if (!event || !event.data) return null;
    
    try {
        const payload = JSON.parse(event.data);
        
        if (!payload.event || !payload.data) {
            return null;
        }
        
        return {
            type: payload.event,
            content: payload.data
        };
    } catch (error) {
        console.error('Error validating stream event:', error);
        return null;
    }
};

export default {
    validateSessionId,
    validateRequestData,
    validateFileUpload,
    validateMessage,
    validateApiResponse,
    validateStreamEvent
};
