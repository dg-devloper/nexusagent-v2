import PropTypes from 'prop-types'
import { forwardRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import { 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Typography,
    useMediaQuery,
    Chip,
    Box
} from '@mui/material'
import { MENU_OPEN, SET_MENU } from '@/store/actions'
import config from '@/config'

const NavItem = ({ item, level }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const customization = useSelector((state) => state.customization)
    const matchesSM = useMediaQuery(theme.breakpoints.down('lg'))
    const isOpen = customization.opened

    if (!item?.id || !item?.title || !item?.type) {
        return null
    }

    const Icon = item.icon
    const itemIcon = item?.icon ? (
        <Icon style={{ width: 20, height: 20 }} />
    ) : null

    let itemTarget = '_self'
    if (item.target) {
        itemTarget = '_blank'
    }

    let listItemProps = {
        component: forwardRef((props, ref) => (
            <Link ref={ref} {...props} to={`${config.basename}${item.url}`} target={itemTarget} />
        ))
    }
    if (item?.external) {
        listItemProps = { component: 'a', href: item.url, target: itemTarget }
    }

    const itemHandler = (id) => {
        dispatch({ type: MENU_OPEN, id })
        if (matchesSM) dispatch({ type: SET_MENU, opened: false })
    }

    useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === item.id)
        if (currentIndex > -1) {
            dispatch({ type: MENU_OPEN, id: item.id })
        }
    }, [])

    const isSelected = customization.isOpen.findIndex((id) => id === item.id) > -1

    return (
        <ListItemButton
            {...listItemProps}
            disabled={item.disabled}
            onClick={() => itemHandler(item.id)}
            selected={isSelected}
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
                {itemIcon}
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
                                {item.title}
                            </Typography>
                        }
                    />
                    {item.chip && (
                        <Chip
                            label={item.chip}
                            size="small"
                            sx={{
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
                            }}
                        />
                    )}
                </Box>
            )}
        </ListItemButton>
    )
}

NavItem.propTypes = {
    item: PropTypes.object,
    level: PropTypes.number
}

export default NavItem
