import { useState } from 'react';
import chatmessagefeedback from '@/api/chatmessagefeedback';

/**
 * Hook for managing message feedback state and interactions
 * @param {string} messageId - The ID of the message to provide feedback for
 * @returns {Object} Feedback state and methods
 */
const useFeedback = (messageId) => {
    const [feedbackState, setFeedbackState] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Submit feedback for a message
     * @param {boolean} isPositive - Whether the feedback is positive
     */
    const submitFeedback = async (isPositive) => {
        if (!messageId || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const feedback = {
                isPositive,
                timestamp: new Date().toISOString()
            };

            // If there's existing feedback, update it
            if (feedbackState !== null) {
                await chatmessagefeedback.updateFeedback(messageId, feedback);
            } else {
                // Otherwise add new feedback
                await chatmessagefeedback.addFeedback(messageId, feedback);
            }

            setFeedbackState(isPositive);
        } catch (err) {
            console.error('Failed to submit feedback:', err);
            setError(err.message || 'Failed to submit feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        feedbackState,
        isSubmitting,
        error,
        submitFeedback
    };
};

export default useFeedback;
