import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import useStreamingRender from '../hooks/useStreamingRender';

/**
 * StreamingMarkdown component renders markdown content with a typing animation
 */
const StreamingMarkdown = ({ 
    content, 
    isComplete, 
    options = {},
    markdownComponents = {}
}) => {
    const { 
        displayedContent, 
        isTyping,
        cursor
    } = useStreamingRender(content || '', isComplete, {
        ...options,
        instantComplete: isComplete || options.instantComplete,
        enabled: !isComplete
    });
    
    // Default markdown components
    const defaultComponents = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                        margin: '1em 0',
                        borderRadius: '8px',
                        padding: '1em'
                    }}
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code
                    className={className}
                    style={{
                        padding: '0.2em 0.4em',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)'
                    }}
                    {...props}
                >
                    {children}
                </code>
            );
        }
    };
    
    // Merge default components with custom components
    const mergedComponents = {
        ...defaultComponents,
        ...markdownComponents
    };
    
    return (
        <>
            <ReactMarkdown
                children={displayedContent || ''}
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeMathjax]}
                components={mergedComponents}
            />
            
            {isTyping && (
                <Box component="span" sx={{ display: 'inline-block', ml: 0.5 }}>
                    <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        style={{ 
                            display: 'inline-block',
                            height: '1em',
                            width: '0.5em',
                            backgroundColor: 'currentColor',
                            verticalAlign: 'text-bottom'
                        }}
                    />
                </Box>
            )}
        </>
    );
};

StreamingMarkdown.propTypes = {
    content: PropTypes.string.isRequired,
    isComplete: PropTypes.bool,
    options: PropTypes.object,
    markdownComponents: PropTypes.object
};

StreamingMarkdown.defaultProps = {
    isComplete: false,
    options: {},
    markdownComponents: {}
};

export default StreamingMarkdown;
