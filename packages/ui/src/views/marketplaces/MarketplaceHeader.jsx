import PropTypes from 'prop-types'
import { Box, Stack, Typography, InputBase, IconButton, Paper, alpha, Tabs, Tab, styled } from '@mui/material'
import { IconSearch } from '@tabler/icons-react'

const brandColor = '#2b63d9'

const StyledTab = styled(Tab)({
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.875rem',
    color: 'rgb(100, 116, 139)',
    '&.Mui-selected': {
        color: brandColor,
        fontWeight: 600
    }
})

const MarketplaceHeader = ({ onSearchChange, title, subtitle, icon, children, activeTab, onTabChange }) => {
    const Icon = icon
    const itemIcon = <Icon stroke={2} size='1.5rem' style={{ color: '#fff' }} />

    return (
        <Box
            sx={{
                borderRadius: '24px',
                background: `linear-gradient(135deg, ${brandColor} 0%, ${alpha(brandColor, 0.8)} 100%)`,
                padding: '3rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 10px 40px -10px ${alpha(brandColor, 0.4)}`,
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle at top left, ${alpha('#fff', 0.12)} 0%, transparent 50%)`,
                    pointerEvents: 'none'
                },
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: '20%',
                    right: '10%',
                    width: '300px',
                    height: '300px',
                    background: `radial-gradient(circle, ${alpha('#fff', 0.08)} 0%, transparent 50%)`,
                    pointerEvents: 'none'
                }
            }}
        >
            <Stack spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
                <Stack direction="row" spacing={3} alignItems="center">
                    <Box
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(8px)',
                            color: 'white',
                            padding: '16px',
                            borderRadius: '16px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transform: 'rotate(-5deg)'
                        }}
                    >
                        {itemIcon}
                    </Box>
                    <Stack spacing={1} flex={1}>
                        <Typography 
                            variant='h3' 
                            sx={{ 
                                color: '#fff',
                                fontWeight: 700,
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                letterSpacing: '-0.02em'
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography 
                            sx={{ 
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '1rem',
                                maxWidth: '600px',
                                lineHeight: 1.6
                            }}
                        >
                            {subtitle}
                        </Typography>
                    </Stack>
                    {children}
                </Stack>

                <Stack spacing={3}>
                    <Box
                        sx={{
                            position: 'relative',
                            padding: '4px 8px 4px 4px',
                            '&:before': {
                                content: '""',
                                position: 'absolute',
                                top: -1,
                                left: -1,
                                right: -1,
                                bottom: -1,
                                background: `linear-gradient(135deg, ${alpha('#fff', 0.2)} 0%, ${alpha('#fff', 0.1)} 100%)`,
                                borderRadius: '18px',
                                filter: 'blur(4px)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease-in-out'
                            },
                            '&:hover:before': {
                                opacity: 1
                            }
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: '2px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                maxWidth: 400,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '16px'
                            }}
                        >
                            <IconButton sx={{ p: '10px', color: 'rgba(255, 255, 255, 0.6)' }}>
                                <IconSearch size={20} />
                            </IconButton>
                            <InputBase
                                sx={{
                                    ml: 1,
                                    flex: 1,
                                    color: '#fff',
                                    '& input::placeholder': {
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        opacity: 1
                                    }
                                }}
                                placeholder="Search plugins and integrations..."
                                onChange={onSearchChange}
                            />
                        </Paper>
                    </Box>

                    <Tabs 
                        value={activeTab} 
                        onChange={onTabChange}
                        sx={{
                            minHeight: 'auto',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '12px',
                            padding: '4px',
                            '& .MuiTabs-indicator': {
                                height: '100%',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)'
                            }
                        }}
                    >
                        <StyledTab 
                            label="All" 
                            sx={{ 
                                color: '#fff',
                                minHeight: '40px',
                                zIndex: 1,
                                '&.Mui-selected': {
                                    color: '#fff'
                                }
                            }}
                        />
                        <StyledTab 
                            label="Plugins" 
                            sx={{ 
                                color: '#fff',
                                minHeight: '40px',
                                zIndex: 1,
                                '&.Mui-selected': {
                                    color: '#fff'
                                }
                            }}
                        />
                        <StyledTab 
                            label="Integrations" 
                            sx={{ 
                                color: '#fff',
                                minHeight: '40px',
                                zIndex: 1,
                                '&.Mui-selected': {
                                    color: '#fff'
                                }
                            }}
                        />
                    </Tabs>
                </Stack>
            </Stack>
        </Box>
    )
}

MarketplaceHeader.propTypes = {
    onSearchChange: PropTypes.func,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    icon: PropTypes.any,
    children: PropTypes.node,
    activeTab: PropTypes.number,
    onTabChange: PropTypes.func
}

export default MarketplaceHeader