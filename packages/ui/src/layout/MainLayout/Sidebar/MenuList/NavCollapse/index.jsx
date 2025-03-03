import PropTypes from 'prop-types'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import { 
    Collapse, 
    List, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Typography,
    Box
} from '@mui/material'
import NavItem from '../NavItem'
import { IconChevronRight } from '@tabler/icons-react'

const NavCollapse = ({ menu, level }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const [open, setOpen] = useState(false)
    const isOpen = customization.opened

    const handleClick = () => {
        setOpen(!open)
    }

    const menus = menu.children?.map((item, index) => {
        if (!item) return null

        if (!item.id || !item.title || !item.type) {
            return null
        }

        switch (item.type.toLowerCase()) {
            case 'collapse':
                return <NavCollapse key={`${item.id}-${index}`} menu={item} level={level + 1} />
            case 'item':
                return <NavItem key={`${item.id}-${index}`} item={item} level={level + 1} />
            default:
                return null
        }
    }).filter(Boolean)

    if (!menus?.length) {
        return null
    }

    const Icon = menu.icon
    const menuIcon = menu?.icon ? (
        <Icon style={{ width: 20, height: 20 }} />
    ) : null

    const isSelected = open

    return (
        <>
            <ListItemButton
                sx={{
                    minHeight: '48px',
                    position: 'relative',
                    textTransform: 'capitalize',
                    borderRadius: '8px',
                    mb: 0.5,
                    mx: 1.5,
                    alignItems: 'center',
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    backgroundColor: 'transparent',
                    py: 1,
                    pl: isOpen ? '24px' : '12px',
                    pr: isOpen ? 2 : '12px',
                    color: isSelected ? 'rgb(25, 118, 210)' : 'rgb(33, 43, 54)',
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
                }}
                selected={isSelected}
                onClick={handleClick}
            >
                <ListItemIcon 
                    sx={{ 
                        minWidth: isOpen ? 36 : 0,
                        mr: isOpen ? 1.5 : 0,
                        justifyContent: 'center',
                        color: isSelected ? 'rgb(25, 118, 210)' : 'rgb(99, 115, 129)',
                        transition: 'all 0.15s ease-in-out'
                    }}
                >
                    {menuIcon}
                </ListItemIcon>
                {isOpen && (
                    <Box 
                        sx={{ 
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <ListItemText
                            primary={
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        fontSize: '0.875rem',
                                        fontWeight: isSelected ? 600 : 500,
                                        color: 'inherit',
                                        lineHeight: 1.57,
                                        fontFamily: "'Public Sans', sans-serif",
                                        transition: 'all 0.15s ease-in-out'
                                    }}
                                >
                                    {menu.title}
                                </Typography>
                            }
                        />
                        <IconChevronRight
                            style={{
                                width: 18,
                                height: 18,
                                marginLeft: 'auto',
                                transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.15s ease-in-out',
                                color: 'inherit'
                            }}
                        />
                    </Box>
                )}
            </ListItemButton>
            <Collapse 
                in={open} 
                timeout={150}
                unmountOnExit
            >
                <List
                    component="div"
                    disablePadding
                    sx={{
                        position: 'relative',
                        marginLeft: 0,
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            left: isOpen ? '32px' : '16px',
                            top: 0,
                            height: '100%',
                            width: '1px',
                            opacity: 1,
                            background: 'rgba(145, 158, 171, 0.24)'
                        },
                        '& .MuiListItemButton-root': {
                            pl: isOpen ? '48px' : '36px',
                            py: 1,
                            minHeight: '44px',
                            '&:before': {
                                content: '""',
                                position: 'absolute',
                                left: isOpen ? '32px' : '16px',
                                top: '50%',
                                width: '12px',
                                height: '1px',
                                backgroundColor: 'rgba(145, 158, 171, 0.24)'
                            }
                        }
                    }}
                >
                    {menus}
                </List>
            </Collapse>
        </>
    )
}

NavCollapse.propTypes = {
    menu: PropTypes.object,
    level: PropTypes.number
}

export default NavCollapse
