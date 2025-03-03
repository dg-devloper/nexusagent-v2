import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

// material-ui
import { styled, alpha } from '@mui/material/styles'
import { Box, Button, Grid, Typography, useTheme } from '@mui/material'

// project imports
import MainCard from '@/ui-component/cards/MainCard'

// icons
import { IconTool, IconEdit } from '@tabler/icons-react'

const brandColor = '#2b63d9'

const CardWrapper = styled(MainCard)(({ theme }) => ({
    background: `linear-gradient(135deg, ${alpha(brandColor, 0.03)} 0%, ${theme.palette.background.paper} 100%)`,
    color: theme.palette.text.primary,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: `0 8px 32px -4px ${alpha(brandColor, 0.08)}`,
    cursor: 'pointer',
    '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: `radial-gradient(circle at top right, ${alpha(brandColor, 0.12)}, transparent 70%)`,
        opacity: 0,
        transition: 'opacity 0.3s ease-in-out'
    },
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 48px ${alpha(brandColor, 0.16)}`,
        '&:before': {
            opacity: 1
        },
        '& .card-icon': {
            transform: 'scale(1.1) rotate(5deg)',
            boxShadow: `0 8px 24px ${alpha(brandColor, 0.24)}`
        },
        '& .edit-button': {
            transform: 'translateY(-2px)',
            backgroundColor: brandColor,
            color: '#fff'
        }
    },
    height: '100%',
    minHeight: '200px',
    maxHeight: '300px',
    width: '100%',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-line',
    transition: 'all 0.3s ease-in-out',
    border: `1px solid ${alpha(brandColor, 0.1)}`,
    borderRadius: '16px'
}))

const ItemCard = ({ data, images, onClick }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    return (
        <CardWrapper content={false} onClick={onClick}>
            <Box sx={{ height: '100%', p: 3, position: 'relative' }}>
                <Grid container direction='column' sx={{ height: '100%' }}>
                    <Box display='flex' flexDirection='column' sx={{ width: '100%', position: 'relative', zIndex: 1 }}>
                        <Box
                            className="card-icon"
                            sx={{
                                width: 48,
                                height: 48,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '14px',
                                backgroundColor: alpha(brandColor, 0.1),
                                border: `1px solid ${alpha(brandColor, 0.2)}`,
                                mb: 2,
                                transition: 'all 0.3s ease-in-out',
                                backgroundImage: data.iconSrc ? `url(${data.iconSrc})` : 'none',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center center'
                            }}
                        >
                            {!data.iconSrc && <IconTool size={28} color={brandColor} />}
                        </Box>
                        <Typography
                            sx={{
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: 'rgb(51, 65, 85)',
                                mb: 1
                            }}
                        >
                            {data.templateName || data.name}
                        </Typography>
                        {data.description && (
                            <Typography
                                sx={{
                                    display: '-webkit-box',
                                    overflowWrap: 'break-word',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    color: 'rgb(100, 116, 139)',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.6,
                                    mb: 2
                                }}
                            >
                                {data.description}
                            </Typography>
                        )}
                    </Box>
                    <Box 
                        sx={{ 
                            mt: 'auto',
                            pt: 2,
                            borderTop: `1px solid ${alpha(brandColor, 0.1)}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        {images && images.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {images.slice(0, 3).map((img, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '8px',
                                            backgroundColor: alpha(brandColor, 0.05),
                                            border: `1px solid ${alpha(brandColor, 0.1)}`,
                                            padding: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={img}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain'
                                            }}
                                            alt=""
                                        />
                                    </Box>
                                ))}
                                {images.length > 3 && (
                                    <Typography
                                        sx={{
                                            color: 'rgb(100, 116, 139)',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        +{images.length - 3}
                                    </Typography>
                                )}
                            </Box>
                        )}
                        <Button 
                            className="edit-button"
                            sx={{ 
                                minWidth: 'auto',
                                backgroundColor: alpha(brandColor, 0.05),
                                color: brandColor,
                                border: `1px solid ${alpha(brandColor, 0.15)}`,
                                borderRadius: '10px',
                                px: 2,
                                py: 1,
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    backgroundColor: brandColor,
                                    color: '#fff'
                                }
                            }}
                            startIcon={<IconEdit size={18} />}
                        >
                            Edit
                        </Button>
                    </Box>
                </Grid>
            </Box>
        </CardWrapper>
    )
}

ItemCard.propTypes = {
    data: PropTypes.object,
    images: PropTypes.array,
    onClick: PropTypes.func
}

export default ItemCard
