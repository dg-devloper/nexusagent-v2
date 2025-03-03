import { Typography } from '@mui/material'
import { Box } from '@mui/material'
import NavGroup from './NavGroup'
import menuItem from '@/menu-items'
import { useSelector } from 'react-redux'

const MenuList = () => {
    const customization = useSelector((state) => state.customization)
    const isOpen = customization.opened

    const items = Array.isArray(menuItem?.items) ? menuItem.items : []

    const navItems = items.map((item, index) => {
        if (!item) return null

        if (!item.id || !item.title || !item.type) {
            return null
        }

        if (item.type === 'group' && (!Array.isArray(item.children) || item.children.length === 0)) {
            return null
        }

        if (item.type === 'group') {
            return <NavGroup key={`${item.id}-${index}`} item={item} />
        }

        return null
    }).filter(Boolean)

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'padding 0.15s ease-in-out',
                pt: 0,
                pb: 2,
                px: 0,
                '& > *:first-of-type': {
                    '& .MuiBox-root': {
                        mt: 0
                    }
                },
                '& .MuiListSubheader-root': {
                    color: 'rgb(99, 115, 129)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    lineHeight: 1.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    transition: 'all 0.15s ease-in-out',
                    fontFamily: "'Public Sans', sans-serif"
                },
                '& .MuiListItemButton-root': {
                    minHeight: '48px',
                    borderRadius: '8px',
                    mx: isOpen ? 2 : 1.5,
                    color: 'rgb(33, 43, 54)',
                    transition: 'all 0.15s ease-in-out',
                    '&:hover': {
                        backgroundColor: 'rgba(145, 158, 171, 0.08)',
                        color: 'rgb(33, 43, 54)',
                        '& .MuiListItemIcon-root': {
                            color: 'rgb(33, 43, 54)'
                        }
                    },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                        color: 'rgb(25, 118, 210)',
                        '& .MuiListItemIcon-root': {
                            color: 'rgb(25, 118, 210)'
                        },
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.12)'
                        }
                    }
                },
                '& .MuiListItemIcon-root': {
                    minWidth: 36,
                    color: 'rgb(99, 115, 129)',
                    transition: 'color 0.15s ease-in-out',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                '& .MuiListItemText-root': {
                    margin: 0,
                    opacity: isOpen ? 1 : 0,
                    transition: 'opacity 0.15s ease-in-out',
                    '& .MuiTypography-root': {
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        lineHeight: 1.57,
                        fontFamily: "'Public Sans', sans-serif",
                        color: 'inherit',
                        transition: 'color 0.15s ease-in-out'
                    }
                },
                '& .MuiChip-root': {
                    height: 20,
                    minWidth: 20,
                    padding: '0 6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    backgroundColor: 'rgba(145, 158, 171, 0.16)',
                    color: 'rgb(99, 115, 129)',
                    marginLeft: 1,
                    fontFamily: "'Public Sans', sans-serif",
                    transition: 'all 0.15s ease-in-out'
                }
            }}
        >
            {navItems}
        </Box>
    )
}

export default MenuList
