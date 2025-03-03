import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    Button,
    Paper,
    alpha
} from '@mui/material';
import {
    IconAlertTriangle,
    IconRefresh,
    IconHome
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

/**
 * Error boundary component for handling React errors
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });

        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error caught by ErrorBoundary:', error, errorInfo);
        }

        // Call onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });

        // Call onRetry callback if provided
        if (this.props.onRetry) {
            this.props.onRetry();
        }
    };

    handleReset = () => {
        // Reset state
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });

        // Call onReset callback if provided
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 3,
                        minHeight: 400
                    }}
                >
                    <Paper
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        sx={{
                            p: 3,
                            maxWidth: 500,
                            width: '100%',
                            textAlign: 'center',
                            borderRadius: '16px',
                            bgcolor: (theme) => 
                                theme.palette.mode === 'dark'
                                    ? alpha(theme.palette.error.dark, 0.1)
                                    : alpha(theme.palette.error.light, 0.1),
                            border: '1px solid',
                            borderColor: 'error.main'
                        }}
                    >
                        <IconAlertTriangle
                            size={48}
                            color="error"
                            style={{ marginBottom: 16 }}
                        />
                        
                        <Typography 
                            variant="h5" 
                            color="error" 
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                        >
                            Something went wrong
                        </Typography>
                        
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            {this.props.message || 
                             "We're sorry, but something went wrong. Please try again or return to home."}
                        </Typography>
                        
                        {/* Error details in development */}
                        {process.env.NODE_ENV === 'development' && (
                            <Box
                                sx={{
                                    mt: 2,
                                    mb: 3,
                                    p: 2,
                                    bgcolor: 'background.paper',
                                    borderRadius: 1,
                                    overflow: 'auto',
                                    maxHeight: 200,
                                    textAlign: 'left'
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    component="pre"
                                    sx={{
                                        fontFamily: 'monospace',
                                        color: 'error.main'
                                    }}
                                >
                                    {this.state.error?.toString()}
                                    {'\n\n'}
                                    {this.state.errorInfo?.componentStack}
                                </Typography>
                            </Box>
                        )}
                        
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<IconRefresh size={20} />}
                                onClick={this.handleRetry}
                            >
                                Try Again
                            </Button>
                            
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<IconHome size={20} />}
                                onClick={this.handleReset}
                            >
                                Return Home
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    message: PropTypes.string,
    onError: PropTypes.func,
    onRetry: PropTypes.func,
    onReset: PropTypes.func
};

export default ErrorBoundary;
