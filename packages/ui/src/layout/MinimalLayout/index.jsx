import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

// material-ui
import { styled, useTheme } from '@mui/material/styles'
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material'

// project imports
import { drawerCanvasWidth, headerHeight } from '@/store/constant'
import { SET_MENU } from '@/store/actions'
import Header from '../MainLayout/Header'
import { useAuth } from '@/hooks/useAuth'

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    ...theme.typography.mainContent,
    padding: 0,
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
            marginLeft: -drawerCanvasWidth,
            width: `calc(100% - ${drawerCanvasWidth}px)`
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px',
            width: `calc(100% - ${drawerCanvasWidth}px)`,
            padding: '16px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px',
            width: `calc(100% - ${drawerCanvasWidth}px)`,
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
        width: `calc(100% - ${drawerCanvasWidth}px)`
    })
}))

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const { token, user, getData } = useAuth()
    const navigate = useNavigate()

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
        } else {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setTimeout(() => dispatch({ type: SET_MENU, opened: !matchDownMd }), 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownMd])

    return (
        <>
            {user.user && (
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />

                    {/* drawer */}
                    {/* <Sidebar drawerOpen={leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} /> */}

                    {/* main content */}
                    <Main theme={theme} open={leftDrawerOpened}>
                        {/* header */}
                        <AppBar
                            enableColorOnDark
                            color='inherit'
                            elevation={0}
                            sx={{
                                bgcolor: theme.palette.background.default,
                                transition: leftDrawerOpened ? theme.transitions.create('width') : 'none',
                                width: `calc(100% - ${drawerCanvasWidth}px)`,
                                [theme.breakpoints.down('lg')]: {
                                    width: '100%'
                                }
                            }}
                        >
                            <Toolbar
                                sx={{
                                    height: `${headerHeight}px`,
                                    borderBottom: '1px solid',
                                    borderColor: theme.palette.primary[200] + 75
                                }}
                            >
                                <Header handleLeftDrawerToggle={handleLeftDrawerToggle} hideLeftDrawerToggle={true} />
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
