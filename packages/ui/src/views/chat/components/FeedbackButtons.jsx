import React from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { IconThumbUp, IconThumbDown } from '@tabler/icons-react';
import useFeedback from '../hooks/useFeedback';

/**
 * FeedbackButtons component for message feedback
 */
const FeedbackButtons = ({ messageId }) => {
    const {
        feedbackState,
        isSubmitting,
        error,
        submitFeedback
    } = useFeedback(messageId);

    // Don't render if no messageId provided
    if (!messageId) return null;

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                opacity: 0.7,
                '&:hover': {
                    opacity: 1
                },
                transition: 'opacity 0.2s ease-in-out'
            }}
        >
            {isSubmitting ? (
                <CircularProgress size={20} />
            ) : (
                <>
                    <Tooltip 
                        title={error || "Helpful"} 
                        placement="top"
                    >
                        <IconButton
                            onClick={() => submitFeedback(true)}
                            color={feedbackState === true ? 'primary' : 'default'}
                            size="small"
                            disabled={isSubmitting}
                        >
                            <IconThumbUp size={20} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip 
                        title={error || "Not helpful"} 
                        placement="top"
                    >
                        <IconButton
                            onClick={() => submitFeedback(false)}
                            color={feedbackState === false ? 'primary' : 'default'}
                            size="small"
                            disabled={isSubmitting}
                        >
                            <IconThumbDown size={20} />
                        </IconButton>
                    </Tooltip>
                </>
            )}
        </Box>
    );
};

FeedbackButtons.propTypes = {
    messageId: PropTypes.string.isRequired
};

export default FeedbackButtons;
