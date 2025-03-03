import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { Typography, Link } from '@mui/material'

const MarkdownPreview = ({ content }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                // Customize heading styles
                h1: ({ node, ...props }) => <Typography variant="h1" gutterBottom {...props} />,
                h2: ({ node, ...props }) => <Typography variant="h2" gutterBottom {...props} />,
                h3: ({ node, ...props }) => <Typography variant="h3" gutterBottom {...props} />,
                h4: ({ node, ...props }) => <Typography variant="h4" gutterBottom {...props} />,
                h5: ({ node, ...props }) => <Typography variant="h5" gutterBottom {...props} />,
                h6: ({ node, ...props }) => <Typography variant="h6" gutterBottom {...props} />,
                
                // Customize paragraph style
                p: ({ node, ...props }) => <Typography variant="body1" paragraph {...props} />,
                
                // Customize link style
                a: ({ node, ...props }) => <Link color="primary" {...props} />,
                
                // Add syntax highlighting for code blocks
                code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    )
                }
            }}
        >
            {content}
        </ReactMarkdown>
    )
}

export default memo(MarkdownPreview)