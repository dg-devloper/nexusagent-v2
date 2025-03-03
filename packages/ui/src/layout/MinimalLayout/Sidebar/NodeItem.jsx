import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import {
    ListItemButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    Chip,
    Box
} from '@mui/material'
import { baseURL } from '@/store/constant'
import LlamaindexPNG from '@/assets/images/llamaindex.png'

const NodeItem = ({ node, onDragStart }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === 'dark'

    const handleDragStart = (event) => {
        // Create a simple node preview
        const dragPreview = document.createElement('div')
        dragPreview.style.width = '200px'
        dragPreview.style.padding = '6px 10px'
        dragPreview.style.backgroundColor = isDarkMode ? theme.palette.background.paper : '#fff'
        dragPreview.style.borderRadius = '8px'
        dragPreview.style.display = 'flex'
        dragPreview.style.alignItems = 'center'
        dragPreview.style.gap = '10px'
        dragPreview.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
        dragPreview.style.position = 'fixed'
        dragPreview.style.top = '-1000px'
        dragPreview.style.left = '-1000px'

        // Add icon
        const icon = document.createElement('img')
        icon.src = `${baseURL}/api/v1/node-icon/${node.name}`
        icon.style.width = '24px'
        icon.style.height = '24px'
        icon.style.objectFit = 'contain'
        dragPreview.appendChild(icon)

        // Add text
        const text = document.createElement('div')
        text.style.flex = '1'
        text.style.overflow = 'hidden'

        const title = document.createElement('div')
        title.textContent = node.label
        title.style.fontSize = '13px'
        title.style.fontWeight = '500'
        title.style.color = isDarkMode ? '#fff' : '#000'
        text.appendChild(title)

        const desc = document.createElement('div')
        desc.textContent = node.description
        desc.style.fontSize = '11px'
        desc.style.color = isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
        desc.style.whiteSpace = 'nowrap'
        desc.style.overflow = 'hidden'
        desc.style.textOverflow = 'ellipsis'
        text.appendChild(desc)

        dragPreview.appendChild(text)
        document.body.appendChild(dragPreview)

        event.dataTransfer.setDragImage(dragPreview, 100, 20)
        setTimeout(() => document.body.removeChild(dragPreview), 0)
        
        onDragStart(event, node)
    }

    return (
        <ListItemButton
            draggable
            onDragStart={handleDragStart}
            sx={{
                p: 1,
                borderRadius: '8px',
                mb: 0.5,
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : theme.palette.background.paper,
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease-in-out',
                cursor: 'grab',
                '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[2],
                    borderColor: theme.palette.primary.main,
                    '& .node-icon': {
                        transform: 'scale(1.1)',
                        boxShadow: theme.shadows[3]
                    }
                },
                '&:active': {
                    cursor: 'grabbing'
                }
            }}
        >
            <ListItem alignItems='center' sx={{ p: 0 }}>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Box
                        className="node-icon"
                        sx={{
                            p: 1,
                            width: 36,
                            height: 36,
                            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                            border: '1px solid',
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <img
                            style={{
                                width: '22px',
                                height: '22px',
                                objectFit: 'contain',
                                transition: 'transform 0.2s ease-in-out',
                                pointerEvents: 'none'
                            }}
                            alt={node.name}
                            src={`${baseURL}/api/v1/node-icon/${node.name}`}
                        />
                    </Box>
                </ListItemAvatar>
                <ListItemText
                    sx={{ ml: 1 }}
                    primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant='body2' sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                                {node.label}
                            </Typography>
                            {node.badge && (
                                <Chip
                                    label={node.badge}
                                    size='small'
                                    color={node.badge === 'DEPRECATING' ? 'warning' : 'info'}
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        '& .MuiChip-label': {
                                            px: 1
                                        }
                                    }}
                                />
                            )}
                            {node.tags && node.tags.includes('LlamaIndex') && (
                                <Box
                                    sx={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <img
                                        src={LlamaindexPNG}
                                        alt='LlamaIndex'
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    }
                    secondary={
                        <Typography
                            variant='caption'
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                color: theme.palette.text.secondary,
                                mt: 0.25,
                                lineHeight: 1.3,
                                fontSize: '0.75rem'
                            }}
                        >
                            {node.description}
                        </Typography>
                    }
                />
            </ListItem>
        </ListItemButton>
    )
}

NodeItem.propTypes = {
    node: PropTypes.object.isRequired,
    onDragStart: PropTypes.func.isRequired
}

export default NodeItem