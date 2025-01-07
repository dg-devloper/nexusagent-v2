import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

// material-ui
import { styled, useTheme } from '@mui/material/styles'
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material'

// project imports
import Header from './Header'
import Sidebar from './Sidebar'
import { drawerWidth, headerHeight } from '@/store/constant'
import { SET_MENU } from '@/store/actions'
import { useAuth } from '@/hooks/useAuth'

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
        backgroundColor: 'transparent',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        transition: theme.transitions.create('all', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginRight: 0,
        [theme.breakpoints.up('md')]: {
            marginLeft: -drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px',
            marginRight: '10px'
        }
    }),
    ...(open && {
        backgroundColor: 'transparent',
        transition: theme.transitions.create('all', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0,
        marginRight: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: `calc(100% - ${drawerWidth}px)`
    })
}))

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const navigate = useNavigate()
    const { user, token, getData } = useAuth()
    const theme = useTheme()
    const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'))

    // Handle left drawer
    const leftDrawerOpened = useSelector((state) => state.customization.opened)
    const dispatch = useDispatch()
    const handleLeftDrawerToggle = () => {
        dispatch({ type: SET_MENU, opened: !leftDrawerOpened })
    }

    /* eslint-disable */
    useEffect(() => {
        if (!token) {
            navigate('/login')
        }

        if (token) {
            getData()
        }
    }, [])

    useEffect(() => {
        setTimeout(() => dispatch({ type: SET_MENU, opened: !matchDownMd }), 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownMd])

    return (
        <>
            {user.isAuthenticated && (
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />

                    {/* drawer */}
                    <Sidebar drawerOpen={leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

                    {/* main content */}
                    <Main theme={theme} open={leftDrawerOpened}>
                        {/* header */}
                        <AppBar
                            enableColorOnDark
                            position='sticky'
                            color='inherit'
                            elevation={0}
                            sx={{
                                bgcolor: theme.palette.background.default,
                                transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
                            }}
                        >
                            <Toolbar
                                sx={{
                                    height: `${headerHeight}px`,
                                    borderBottom: '1px solid',
                                    borderColor: theme.palette.primary[200] + 75
                                }}
                            >
                                <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                            </Toolbar>
                        </AppBar>

                        <Outlet />
                    </Main>
                </Box>
            )}
        </>
    )
}

export default MainLayout
