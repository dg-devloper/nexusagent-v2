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
    backgroundColor: theme.palette.background.default,
    width: '100%',
    minHeight: '100vh',
    flexGrow: 1,
    padding: '20px',
    marginTop: headerHeight,
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${open ? drawerWidth : 72}px)`,
        marginLeft: 0,
        ...(open && {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
            })
        })
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 0,
        padding: '16px'
    }
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

    useEffect(() => {
        if (!token) {
            navigate('/login', { replace: true })
        }

        if (token) {
            getData(() => {
                navigate('/login', { replace: true })
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        dispatch({ type: SET_MENU, opened: !matchDownMd })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownMd])

    return (
        <>
            {user.isAuthenticated && (
                <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                    <CssBaseline />

                    {/* drawer */}
                    <Sidebar drawerOpen={leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

                    {/* main content */}
                    <Main theme={theme} open={leftDrawerOpened}>
                        {/* header */}
                        <AppBar
                            position='fixed'
                            elevation={0}
                            sx={{
                                width: { md: `calc(100% - ${leftDrawerOpened ? drawerWidth : 72}px)` },
                                marginLeft: { md: 0 },
                                backgroundColor: '#fff',
                                borderBottom: '1px solid rgba(145, 158, 171, 0.12)',
                                transition: theme.transitions.create(['width', 'margin'], {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.enteringScreen
                                })
                            }}
                        >
                            <Toolbar
                                sx={{
                                    height: headerHeight,
                                    px: { xs: 2, sm: 3 }
                                }}
                            >
                                <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                            </Toolbar>
                        </AppBar>

                        <Box
                            sx={{
                                p: { xs: 2, sm: 3 },
                                minHeight: `calc(100vh - ${headerHeight}px)`,
                                backgroundColor: '#f9fafb'
                            }}
                        >
                            <Outlet />
                        </Box>
                    </Main>
                </Box>
            )}
        </>
    )
}

export default MainLayout
