// Animation utilities for the chat UI
import { keyframes } from '@emotion/react';

// Keyframes for animations - simplified and more subtle
export const keyframesAnimations = {
    fadeIn: keyframes`
        from { opacity: 0; }
        to { opacity: 1; }
    `,
    fadeOut: keyframes`
        from { opacity: 1; }
        to { opacity: 0; }
    `,
    slideUp: keyframes`
        from { transform: translateY(10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    `,
    slideDown: keyframes`
        from { transform: translateY(-10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    `,
    slideLeft: keyframes`
        from { transform: translateX(10px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    `,
    slideRight: keyframes`
        from { transform: translateX(-10px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    `,
    typing: keyframes`
        from { width: 0 }
        to { width: 100% }
    `,
    blink: keyframes`
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    `,
    rotate: keyframes`
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    `
};

// Animation presets for common components - more subtle and professional
export const animationPresets = {
    // Message bubble animations
    messageBubble: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { 
            type: "spring", 
            stiffness: 200, 
            damping: 25 
        }
    },
    
    // Agent card animations
    agentCard: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { 
            type: "spring", 
            stiffness: 200, 
            damping: 25 
        }
    },
    
    // Agent transition animations
    agentTransition: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { 
            type: "spring", 
            stiffness: 200, 
            damping: 25 
        }
    },
    
    // Typing indicator animation
    typingIndicator: {
        animate: { 
            opacity: [1, 0.6, 1],
            transition: { 
                repeat: Infinity, 
                duration: 1.2,
                ease: "easeInOut"
            }
        }
    },
    
    // Staggered children animation
    staggerChildren: {
        container: {
            initial: { opacity: 1 },
            animate: { opacity: 1 },
            transition: { staggerChildren: 0.05 }
        },
        item: {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { 
                type: "spring", 
                stiffness: 200, 
                damping: 25 
            }
        }
    },
    
    // Fade in animation
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 }
    },
    
    // Scale animation
    scale: {
        initial: { scale: 0.95 },
        animate: { scale: 1 },
        transition: { 
            type: "spring", 
            stiffness: 200, 
            damping: 25 
        }
    }
};

// Animation utilities
export const animationUtils = {
    // Delay animation for each item in a list
    staggerDelay: (index, baseDelay = 0.05) => index * baseDelay,
    
    // Create a typing animation configuration
    createTypingAnimation: (options = {}) => {
        const { 
            chunkSize = 3,
            speed = 15,
            instantComplete = true
        } = options;
        
        return {
            chunkSize,
            speed,
            instantComplete
        };
    }
};
