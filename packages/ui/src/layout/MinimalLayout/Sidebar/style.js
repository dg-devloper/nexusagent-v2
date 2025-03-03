import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const SidebarContainer = styled(Box)(({ theme }) => ({
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[100],
    '& .MuiOutlinedInput-root': {
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
            backgroundColor: theme.palette.background.paper
        },
        '&.Mui-focused': {
            backgroundColor: theme.palette.background.paper
        }
    },
    '& .MuiAccordion-root': {
        backgroundColor: 'transparent',
        '&:before': {
            display: 'none'
        },
        '&.Mui-expanded': {
            margin: 0
        }
    },
    '& .MuiAccordionSummary-root': {
        minHeight: 42,
        padding: '0 8px',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
        borderRadius: '8px',
        marginBottom: theme.spacing(0.5),
        transition: 'all 0.2s ease-in-out',
        '&.Mui-expanded': {
            minHeight: 42,
            marginBottom: theme.spacing(0.5)
        },
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-1px)'
        }
    },
    '& .MuiListItemButton-root': {
        borderRadius: '8px',
        marginBottom: theme.spacing(0.5),
        padding: '6px 8px',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : theme.palette.background.paper,
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[2],
            borderColor: theme.palette.primary.main
        },
        '& .MuiListItemAvatar-root': {
            minWidth: 40,
            '& > div': {
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& img': {
                    width: '20px',
                    height: '20px',
                    objectFit: 'contain'
                }
            }
        },
        '& .MuiListItemText-root': {
            margin: 0,
            '& .MuiTypography-root': {
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: theme.palette.text.primary
            },
            '& .MuiTypography-caption': {
                fontSize: '0.75rem',
                color: theme.palette.text.secondary,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.4
            }
        },
        '& .MuiChip-root': {
            height: 20,
            fontSize: '0.75rem',
            fontWeight: 600,
            borderRadius: '10px',
            '& .MuiChip-label': {
                px: 1.25
            }
        }
    }
}))