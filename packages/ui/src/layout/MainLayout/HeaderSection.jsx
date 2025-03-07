import PropTypes from 'prop-types'
import { Box, Stack, Grid, Typography, OutlinedInput, ListItemIcon, alpha, InputAdornment } from '@mui/material'
import { IconSearch } from '@tabler/icons-react'
import { useTheme } from '@emotion/react'

const brandColor = '#2b63d9'

const HeaderSection = ({ children, onSearchChange, title, subtitle, icon }) => {
    const theme = useTheme()

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
                <Grid container alignItems='center' spacing={3}>
                    <Grid item>
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
                            <ListItemIcon
                                sx={{
                                    color: '#fff',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    minWidth: 'auto'
                                }}
                            >
                                {itemIcon}
                            </ListItemIcon>
                        </Box>
                    </Grid>
                    <Grid item xs>
                        <Stack spacing={1}>
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
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        display: 'flex',
                        gap: '1.5rem',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                    }}
                >
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
                        <OutlinedInput
                            size='small'
                            sx={{
                                borderRadius: '16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#fff',
                                width: '350px',
                                height: '56px',
                                fontSize: '0.95rem',
                                transition: 'all 0.3s ease-in-out',
                                position: 'relative',
                                margiinLeft: '2rem',
                                zIndex: 1,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none'
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                                },
                                '&.Mui-focused': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
                                },
                                '& input': {
                                    padding: '8px 24px 8px 0',
                                    letterSpacing: '0.03em',
                                    '&::placeholder': {
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        opacity: 1,
                                        letterSpacing: '0.01em'
                                    }
                                },
                                '& .MuiInputAdornment-root': {
                                    marginRight: '12px',
                                    height: '100%',
                                    maxHeight: 'none'
                                }
                            }}
                            startAdornment={
                                <InputAdornment position='start'>
                                    <Box
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '48px',
                                            height: '100%',
                                            borderRight: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}
                                    >
                                        <IconSearch
                                            style={{
                                                color: 'inherit',
                                                width: 22,
                                                height: 22,
                                                strokeWidth: 1.5
                                            }}
                                        />
                                    </Box>
                                </InputAdornment>
                            }
                            variant='outlined'
                            type='search'
                            placeholder='Search name or category...'
                            onChange={onSearchChange}
                        />
                    </Box>

                    {children}
                </Box>
            </Stack>
        </Box>
    )
}

HeaderSection.propTypes = {
    children: PropTypes.node,
    onSearchChange: PropTypes.func,
    onButtonClick: PropTypes.func,
    title: PropTypes.string,
    icon: PropTypes.any,
    subtitle: PropTypes.string
}

export default HeaderSection
