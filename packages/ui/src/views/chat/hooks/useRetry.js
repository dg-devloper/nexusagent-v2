import { useState, useCallback } from 'react';

/**
 * Configuration for retry behavior
 */
const DEFAULT_CONFIG = {
    maxRetries: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
    backoffFactor: 2, // Exponential backoff multiplier
    shouldRetry: (error) => {
        // Default retry conditions
        if (!error.response) return true; // Network errors
        const { status } = error.response;
        return status >= 500 || status === 429; // Server errors or rate limiting
    }
};

/**
 * Calculate delay with exponential backoff and jitter
 * @param {number} attempt - Current attempt number
 * @param {Object} config - Retry configuration
 * @returns {number} - Delay in milliseconds
 */
const calculateDelay = (attempt, config) => {
    const delay = Math.min(
        config.initialDelay * Math.pow(config.backoffFactor, attempt),
        config.maxDelay
    );
    // Add random jitter (±10%)
    const jitter = delay * 0.1 * (Math.random() * 2 - 1);
    return delay + jitter;
};

/**
 * Hook for handling operation retries with exponential backoff
 * @param {Function} operation - Async operation to retry
 * @param {Object} options - Configuration options
 * @returns {Object} - Retry state and methods
 */
const useRetry = (operation, options = {}) => {
    const config = { ...DEFAULT_CONFIG, ...options };
    const [attempts, setAttempts] = useState(0);
    const [error, setError] = useState(null);
    const [isRetrying, setIsRetrying] = useState(false);
    const [lastDelay, setLastDelay] = useState(0);

    /**
     * Execute operation with retry logic
     */
    const execute = useCallback(async (...args) => {
        setError(null);
        setAttempts(0);
        
        try {
            return await operation(...args);
        } catch (err) {
            let currentAttempt = 0;
            
            while (currentAttempt < config.maxRetries) {
                if (!config.shouldRetry(err)) {
                    throw err; // Don't retry if condition not met
                }
                
                currentAttempt++;
                setAttempts(currentAttempt);
                setIsRetrying(true);
                setError(err);
                
                const delay = calculateDelay(currentAttempt, config);
                setLastDelay(delay);
                
                try {
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, delay));
                    // Try operation again
                    const result = await operation(...args);
                    setIsRetrying(false);
                    setError(null);
                    return result;
                } catch (retryErr) {
                    err = retryErr; // Update error for next iteration
                }
            }
            
            // Max retries reached
            setIsRetrying(false);
            setError(err);
            throw err;
        }
    }, [operation, config]);

    /**
     * Reset retry state
     */
    const reset = useCallback(() => {
        setAttempts(0);
        setError(null);
        setIsRetrying(false);
        setLastDelay(0);
    }, []);

    return {
        execute,
        reset,
        attempts,
        error,
        isRetrying,
        lastDelay,
        hasMoreRetries: attempts < config.maxRetries
    };
};

export default useRetry;
