import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import { Box, List, Typography } from '@mui/material'
import NavItem from '../NavItem'
import NavCollapse from '../NavCollapse'
import { useSelector } from 'react-redux'

const NavGroup = ({ item }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const isOpen = customization.opened

    if (!Array.isArray(item?.children)) {
        return null
    }

    const items = item.children.map((menu, index) => {
        if (!menu) return null

        if (!menu.id || !menu.title || !menu.type) {
            return null
        }

        switch (menu.type.toLowerCase()) {
            case 'collapse':
                return <NavCollapse key={`${menu.id}-${index}`} menu={menu} level={1} />
            case 'item':
                return <NavItem key={`${menu.id}-${index}`} item={menu} level={1} />
            default:
                return null
        }
    }).filter(Boolean)

    if (!items?.length) {
        return null
    }

    return (
        <List
            subheader={
                item.title && isOpen && (
                    <Box 
                        sx={{ 
                            px: 3,
                            py: 2,
                            mt: 2,
                            mb: 0.5,
                            marginLeft: 0
                        }}
                    >
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                lineHeight: 1.5,
                                textTransform: 'uppercase',
                                color: 'rgb(99, 115, 129)',
                                letterSpacing: '0.1em',
                                fontFamily: "'Public Sans', sans-serif",
                                userSelect: 'none',
                                display: 'block'
                            }}
                        >
                            {item.title}
                        </Typography>
                    </Box>
                )
            }
            sx={{
                mb: 0,
                py: 0,
                marginLeft: 0,
                '& .MuiListItemButton-root': {
                    minHeight: '48px',
                    borderRadius: '8px',
                    mx: 1.5,
                    mb: 0.5,
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
                    marginRight: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.15s ease-in-out'
                },
                '& .MuiListItemText-root': {
                    margin: 0,
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
            {items}
        </List>
    )
}

NavGroup.propTypes = {
    item: PropTypes.object
}

export default NavGroup
