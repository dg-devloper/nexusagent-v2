import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

// material-ui
import { styled, useTheme } from '@mui/material/styles'
import { AppBar, Box, Button, CssBaseline, Toolbar, useMediaQuery } from '@mui/material'

// project imports
import { drawerCanvasWidth } from '@/store/constant'
import { SET_MENU, SET_CHATFLOW, REMOVE_DIRTY } from '@/store/actions'
import CanvasHeader from '@/views/canvas/CanvasHeader'
import { useAuth } from '@/hooks/useAuth'

// API
import chatflowsApi from '@/api/chatflows'

// Hooks
import useApi from '@/hooks/useApi'

// icons
import { IconX } from '@tabler/icons-react'

// utils
import { generateExportFlowData } from '@/utils/genericHelper'

// styles
const headerHeight = 48 // Reduced from 64px to 48px

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    ...theme.typography.mainContent,
    padding: 0,
    backgroundColor: 'transparent',
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
    }),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: `calc(100% - ${drawerCanvasWidth}px)`,
    marginLeft: open ? 0 : -drawerCanvasWidth,
    [theme.breakpoints.down('lg')]: {
        width: '100%',
        marginLeft: 0,
        padding: '16px'
    },
    [theme.breakpoints.down('md')]: {
        marginLeft: '20px',
        padding: '16px',
        width: `calc(100% - 40px)`
    },
    [theme.breakpoints.down('sm')]: {
        marginLeft: '10px',
        padding: '16px',
        width: `calc(100% - 20px)`
    }
}))

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => {
    const { token, user, getData } = useAuth()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const theme = useTheme()
    const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'))

    // Handle left drawer
    const leftDrawerOpened = useSelector((state) => state.customization.opened)
    const canvas = useSelector((state) => state.canvas)
    
    const handleLeftDrawerToggle = () => {
        dispatch({ type: SET_MENU, opened: !leftDrawerOpened })
    }

    const createNewChatflowApi = useApi(chatflowsApi.createNewChatflow)
    const updateChatflowApi = useApi(chatflowsApi.updateChatflow)

    const handleSaveFlow = (chatflowName) => {
        if (!canvas.chatflow?.id) {
            const newChatflowBody = {
                name: chatflowName,
                deployed: false,
                isPublic: false,
                flowData: canvas.chatflow?.flowData || JSON.stringify({ nodes: [], edges: [] }),
                type: window.location.pathname.includes('agentcanvas') ? 'MULTIAGENT' : 'CHATFLOW'
            }
            createNewChatflowApi.request(newChatflowBody)
        } else {
            const updateBody = {
                name: chatflowName,
                flowData: canvas.chatflow.flowData
            }
            updateChatflowApi.request(canvas.chatflow.id, updateBody)
        }
    }

    const handleDeleteFlow = async () => {
        if (canvas.chatflow?.id) {
            try {
                await chatflowsApi.deleteChatflow(canvas.chatflow.id)
                localStorage.removeItem(`${canvas.chatflow.id}_INTERNAL`)
                navigate(window.location.pathname.includes('agentcanvas') ? '/agentflows' : '/')
            } catch (error) {
                dispatch({
                    type: 'enqueueSnackbar',
                    notification: {
                        message: typeof error.response.data === 'object' ? error.response.data.message : error.response.data,
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'error',
                            persist: true,
                            action: (key) => (
                                <Button style={{ color: 'white' }} onClick={() => dispatch({ type: 'closeSnackbar', key })}>
                                    <IconX />
                                </Button>
                            )
                        }
                    }
                })
            }
        }
    }

    const handleLoadFlow = (file) => {
        try {
            const flowData = JSON.parse(file)
            dispatch({ 
                type: SET_CHATFLOW, 
                chatflow: {
                    flowData: JSON.stringify(flowData),
                    isDirty: true
                }
            })
        } catch (e) {
            console.error(e)
        }
    }

    const handleSaveTemplate = async () => {
        if (canvas.chatflow?.id) {
            try {
                const flowData = JSON.parse(canvas.chatflow.flowData)
                const templateData = generateExportFlowData(flowData)
                const response = await chatflowsApi.saveAsTemplate(canvas.chatflow.id, templateData)
                dispatch({
                    type: 'enqueueSnackbar',
                    notification: {
                        message: 'Template saved successfully',
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success'
                        }
                    }
                })
                return response.data
            } catch (error) {
                dispatch({
                    type: 'enqueueSnackbar',
                    notification: {
                        message: typeof error.response.data === 'object' ? error.response.data.message : error.response.data,
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'error',
                            persist: true,
                            action: (key) => (
                                <Button style={{ color: 'white' }} onClick={() => dispatch({ type: 'closeSnackbar', key })}>
                                    <IconX />
                                </Button>
                            )
                        }
                    }
                })
            }
        }
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
        setTimeout(() => dispatch({ type: SET_MENU, opened: !matchDownMd }), 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownMd])

    // Handle API responses
    useEffect(() => {
        if (createNewChatflowApi.data) {
            dispatch({ type: SET_CHATFLOW, chatflow: createNewChatflowApi.data })
            dispatch({ type: REMOVE_DIRTY })
            dispatch({
                type: 'enqueueSnackbar',
                notification: {
                    message: 'Chatflow saved successfully',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success'
                    }
                }
            })
        } else if (createNewChatflowApi.error) {
            dispatch({
                type: 'enqueueSnackbar',
                notification: {
                    message: createNewChatflowApi.error.response?.data?.message || 'Error saving chatflow',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error'
                    }
                }
            })
        }
    }, [createNewChatflowApi.data, createNewChatflowApi.error, dispatch])

    useEffect(() => {
        if (updateChatflowApi.data) {
            dispatch({ type: SET_CHATFLOW, chatflow: updateChatflowApi.data })
            dispatch({ type: REMOVE_DIRTY })
            dispatch({
                type: 'enqueueSnackbar',
                notification: {
                    message: 'Chatflow updated successfully',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success'
                    }
                }
            })
        } else if (updateChatflowApi.error) {
            dispatch({
                type: 'enqueueSnackbar',
                notification: {
                    message: updateChatflowApi.error.response?.data?.message || 'Error updating chatflow',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error'
                    }
                }
            })
        }
    }, [updateChatflowApi.data, updateChatflowApi.error, dispatch])

    return (
        <>
            {user.user && (
                <Box sx={{ display: 'flex', overflow: 'hidden' }}>
                    <CssBaseline />

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
                                width: `calc(100% - ${leftDrawerOpened ? drawerCanvasWidth : 0}px)`,
                                height: `${headerHeight}px`,
                                [theme.breakpoints.down('lg')]: {
                                    width: '100%'
                                }
                            }}
                        >
                            <Toolbar
                                sx={{
                                    height: `${headerHeight}px`,
                                    minHeight: `${headerHeight}px !important`,
                                    px: { xs: 1.5, sm: 2 },
                                    borderBottom: '1px solid',
                                    borderColor: theme.palette.divider
                                }}
                            >
                                <CanvasHeader 
                                    handleLeftDrawerToggle={handleLeftDrawerToggle} 
                                    hideLeftDrawerToggle={true}
                                    handleSaveFlow={handleSaveFlow}
                                    handleDeleteFlow={handleDeleteFlow}
                                    handleLoadFlow={handleLoadFlow}
                                    handleSaveTemplate={handleSaveTemplate}
                                    isAgentCanvas={window.location.pathname.includes('agentcanvas')}
                                />
                            </Toolbar>
                        </AppBar>

                        <Box sx={{ mt: `${headerHeight}px` }}>
                            <Outlet />
                        </Box>
                    </Main>
                </Box>
            )}
        </>
    )
}

export default MinimalLayout
