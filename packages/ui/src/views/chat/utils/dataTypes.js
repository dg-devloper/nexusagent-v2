/**
 * Type definitions for chat data structures
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} id - Unique identifier for the message
 * @property {string} role - Role of the message sender (user, assistant, system)
 * @property {string} content - Message content
 * @property {string} timestamp - ISO timestamp of when the message was created
 * @property {Array} [sourceDocuments] - Source documents referenced in the message
 * @property {Array} [usedTools] - Tools used in generating the message
 * @property {Array} [fileAnnotations] - File annotations associated with the message
 * @property {Array} [agentReasoning] - Agent reasoning steps
 * @property {Object} [action] - Action data associated with the message
 * @property {Array} [artifacts] - Artifacts generated with the message
 * @property {Array} [fileUploads] - Files uploaded with the message
 * @property {boolean} [isStreaming] - Whether the message is currently streaming
 * @property {boolean} [isError] - Whether the message represents an error
 * @property {string} [sessionId] - Session ID associated with the message
 */

/**
 * @typedef {Object} FileUpload
 * @property {string} data - File data (base64 encoded or URL)
 * @property {string} preview - Preview URL for the file
 * @property {string} type - File type (file, image, audio, etc.)
 * @property {string} name - File name
 * @property {string} mime - MIME type of the file
 */

/**
 * @typedef {Object} ChatSession
 * @property {string} id - Unique identifier for the session
 * @property {string} title - Session title
 * @property {string} createdAt - ISO timestamp of when the session was created
 * @property {string} updatedAt - ISO timestamp of when the session was last updated
 * @property {number} messageCount - Number of messages in the session
 * @property {string} firstMessage - First message in the session
 * @property {string} lastMessage - Last message in the session
 * @property {boolean} isPinned - Whether the session is pinned
 * @property {Array} tags - Tags associated with the session
 */

/**
 * @typedef {Object} MessageRequestData
 * @property {string} question - The user's message
 * @property {string} sessionId - Session ID for grouping messages
 * @property {Array<FileUpload>} uploads - File uploads
 * @property {boolean} streaming - Whether to use streaming
 * @property {Object} action - Action data if applicable
 */

/**
 * @typedef {Object} StreamEvent
 * @property {string} type - Event type (token, sourceDocuments, etc.)
 * @property {*} content - Event content
 */

/**
 * @typedef {Object} ChatOptions
 * @property {Array<ChatMessage>} initialMessages - Initial messages to display
 * @property {Function} onError - Callback for errors
 * @property {Function} onMessageStart - Callback for when a message starts
 * @property {Function} onMessageComplete - Callback for when a message completes
 * @property {Function} onMessageUpdate - Callback for message updates
 * @property {Function} onStreamStart - Callback for when streaming starts
 * @property {Function} onStreamEnd - Callback for when streaming ends
 * @property {boolean} autoFocus - Whether to auto-focus the input
 * @property {boolean} enableHistory - Whether to enable input history
 * @property {number} historyLength - Maximum number of history items to keep
 * @property {string} predictionId - Prediction ID for retrieving chat history
 * @property {string} sessionId - Session ID for grouping messages
 */

// Export empty object to make this a valid module
export default {};