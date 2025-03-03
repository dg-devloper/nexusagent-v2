/**
 * Optimization utilities for chat UI
 */
import { throttle, debounce } from 'lodash';

/**
 * Throttled function for updating UI during streaming
 * Limits the frequency of updates to improve performance
 * @param {Function} callback - Function to throttle
 * @param {number} wait - Throttle wait time in ms
 * @returns {Function} - Throttled function
 */
export const createThrottledUpdater = (callback, wait = 50) => {
    return throttle(callback, wait, { leading: true, trailing: true });
};

/**
 * Debounced function for handling user input
 * Delays processing until user stops typing
 * @param {Function} callback - Function to debounce
 * @param {number} wait - Debounce wait time in ms
 * @returns {Function} - Debounced function
 */
export const createDebouncedHandler = (callback, wait = 300) => {
    return debounce(callback, wait);
};

/**
 * Batch updates to state to reduce re-renders
 * @param {Function} setStateFn - React setState function
 * @param {Array} updates - Array of updates to apply
 * @param {Function} transformFn - Optional transform function for each item
 */
export const batchStateUpdates = (setStateFn, updates, transformFn = (x) => x) => {
    setStateFn(prevState => {
        const newState = [...prevState];
        updates.forEach(update => {
            const transformedUpdate = transformFn(update);
            // Apply update based on its type
            if (typeof transformedUpdate === 'function') {
                transformedUpdate(newState);
            } else {
                newState.push(transformedUpdate);
            }
        });
        return newState;
    });
};

/**
 * Memoize expensive computations
 * @param {Function} fn - Function to memoize
 * @returns {Function} - Memoized function
 */
export const memoize = (fn) => {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};

/**
 * Validate and sanitize user input
 * @param {string} input - User input to validate
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
    if (!input) return '';
    
    // Basic sanitization - remove potentially harmful characters
    return input
        .trim()
        .replace(/[<>]/g, (match) => match === '<' ? '&lt;' : '&gt;');
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result
 */
export const validateFile = (file, options = {}) => {
    const {
        maxSizeMB = 10,
        allowedTypes = null
    } = options;
    
    const result = {
        valid: true,
        errors: []
    };
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
        result.valid = false;
        result.errors.push(`File size exceeds maximum allowed size of ${maxSizeMB}MB`);
    }
    
    // Check file type if specified
    if (allowedTypes && !allowedTypes.includes(file.type)) {
        result.valid = false;
        result.errors.push(`File type ${file.type} is not allowed`);
    }
    
    return result;
};

/**
 * Create a virtualized window for large lists
 * Only renders items that are visible in the viewport
 * @param {Array} items - Full list of items
 * @param {number} startIndex - Start index of visible window
 * @param {number} endIndex - End index of visible window
 * @returns {Array} - Visible items
 */
export const createVirtualWindow = (items, startIndex, endIndex) => {
    return items.slice(Math.max(0, startIndex), Math.min(items.length, endIndex));
};

/**
 * Calculate visible window indices based on scroll position
 * @param {number} scrollTop - Current scroll position
 * @param {number} viewportHeight - Height of the viewport
 * @param {number} itemHeight - Height of each item
 * @param {number} totalItems - Total number of items
 * @param {number} buffer - Number of items to buffer above and below
 * @returns {Object} - Start and end indices
 */
export const calculateVisibleWindow = (scrollTop, viewportHeight, itemHeight, totalItems, buffer = 5) => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const endIndex = Math.min(
        totalItems,
        Math.ceil((scrollTop + viewportHeight) / itemHeight) + buffer
    );
    
    return { startIndex, endIndex };
};

export default {
    createThrottledUpdater,
    createDebouncedHandler,
    batchStateUpdates,
    memoize,
    sanitizeInput,
    validateFile,
    createVirtualWindow,
    calculateVisibleWindow
};