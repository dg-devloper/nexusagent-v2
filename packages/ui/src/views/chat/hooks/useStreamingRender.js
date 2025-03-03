// Custom hook for streaming text rendering with typing animation
import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for streaming text rendering with typing animation
 * @param {string} content - The content to render
 * @param {boolean} isComplete - Whether the streaming is complete
 * @param {Object} options - Configuration options
 * @returns {Object} - Streaming render state and controls
 */
const useStreamingRender = (content, isComplete, options = {}) => {
    const { 
        chunkSize = 1,         // Number of characters to render at once (reduced for smoother animation)
        speed = 15,            // Speed of typing animation in milliseconds (slightly slower for more natural feel)
        instantComplete = true, // Whether to instantly complete when isComplete is true
        initialDelay = 200,    // Initial delay before starting animation (added for more natural feel)
        cursor = '▌',          // Cursor character
        enabled = true,        // Whether the animation is enabled
        variableSpeed = true,  // Whether to use variable speed for more natural typing
        minSpeed = 10,         // Minimum speed for variable typing
        maxSpeed = 30          // Maximum speed for variable typing
    } = options;
    
    const [displayedContent, setDisplayedContent] = useState('');
    const contentRef = useRef(content || '');
    const charIndexRef = useRef(0);
    const timeoutRef = useRef(null);
    
    // Reset when content changes
    useEffect(() => {
        if (!content) {
            setDisplayedContent('');
            charIndexRef.current = 0;
            return;
        }

        contentRef.current = content;
        
        // If not streaming or instant complete is enabled, show full content immediately
        if (!enabled || (isComplete && instantComplete)) {
            setDisplayedContent(contentRef.current);
            charIndexRef.current = contentRef.current.length;
            return;
        }
        
        // Otherwise, start from current position
        charIndexRef.current = Math.min(charIndexRef.current, contentRef.current.length);
        setDisplayedContent(contentRef.current.substring(0, charIndexRef.current));
        
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        // Start animation after initial delay
        const startAnimation = () => {
            const animateTyping = () => {
                if (charIndexRef.current < contentRef.current.length) {
                    // Increment by chunks for better performance
                    const nextIndex = Math.min(charIndexRef.current + chunkSize, contentRef.current.length);
                    charIndexRef.current = nextIndex;
                    setDisplayedContent(contentRef.current.substring(0, nextIndex));
                    
                    // Calculate variable speed for more natural typing
                    let typingSpeed = speed;
                    if (variableSpeed) {
                        // Slow down at punctuation for more natural pauses
                        const currentChar = contentRef.current[charIndexRef.current - 1];
                        if (['.', '!', '?', ',', ';', ':'].includes(currentChar)) {
                            typingSpeed = maxSpeed * 2; // Longer pause at punctuation
                        } else if ([' ', '\n'].includes(currentChar)) {
                            typingSpeed = maxSpeed; // Slight pause at spaces and newlines
                        } else {
                            // Random variation for natural rhythm
                            typingSpeed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
                        }
                    }
                    
                    // Schedule next frame with variable speed
                    timeoutRef.current = setTimeout(animateTyping, typingSpeed);
                }
            };
            
            animateTyping();
        };
        
        timeoutRef.current = setTimeout(startAnimation, initialDelay);
        
        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [content, isComplete, instantComplete, chunkSize, speed, initialDelay, enabled, minSpeed, maxSpeed, variableSpeed]);
    
    // Compute derived state
    const isTyping = charIndexRef.current < contentRef.current.length;
    const progress = contentRef.current.length > 0 
        ? (charIndexRef.current / contentRef.current.length) * 100 
        : 100;
    
    // Force complete the animation
    const complete = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        charIndexRef.current = contentRef.current.length;
        setDisplayedContent(contentRef.current);
    };
    
    // Pause the animation
    const pause = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };
    
    // Resume the animation
    const resume = () => {
        if (isTyping) {
            const animateTyping = () => {
                if (charIndexRef.current < contentRef.current.length) {
                    // Increment by chunks for better performance
                    const nextIndex = Math.min(charIndexRef.current + chunkSize, contentRef.current.length);
                    charIndexRef.current = nextIndex;
                    setDisplayedContent(contentRef.current.substring(0, nextIndex));
                    
                    // Calculate variable speed for more natural typing
                    let typingSpeed = speed;
                    if (variableSpeed) {
                        // Slow down at punctuation for more natural pauses
                        const currentChar = contentRef.current[charIndexRef.current - 1];
                        if (['.', '!', '?', ',', ';', ':'].includes(currentChar)) {
                            typingSpeed = maxSpeed * 2; // Longer pause at punctuation
                        } else if ([' ', '\n'].includes(currentChar)) {
                            typingSpeed = maxSpeed; // Slight pause at spaces and newlines
                        } else {
                            // Random variation for natural rhythm
                            typingSpeed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
                        }
                    }
                    
                    // Schedule next frame with variable speed
                    timeoutRef.current = setTimeout(animateTyping, typingSpeed);
                }
            };
            
            timeoutRef.current = setTimeout(animateTyping, speed);
        }
    };
    
    return {
        displayedContent,
        isTyping,
        progress,
        cursor,
        complete,
        pause,
        resume
    };
};

export default useStreamingRender;
