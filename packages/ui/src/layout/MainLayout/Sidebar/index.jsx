import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import { Box, Drawer, useMediaQuery } from '@mui/material'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { BrowserView, MobileView } from 'react-device-detect'
import MenuList from './MenuList'
import { drawerWidth } from '@/store/constant'
import LogoSection from '../LogoSection'

const Sidebar = ({ drawerOpen, drawerToggle }) => {
    const theme = useTheme()
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))

    const drawer = (
        <>
            <BrowserView>
                <PerfectScrollbar
                    component="div"
                    style={{
                        height: '100vh',
                        paddingLeft: drawerOpen ? '16px' : '12px',
                        paddingRight: drawerOpen ? '16px' : '12px',
                        paddingTop: '10px',
                        paddingBottom: '20px'
                    }}
                >
                    <MenuList />
                </PerfectScrollbar>
            </BrowserView>
            <MobileView>
                <Box sx={{ px: 2, py: 2 }}>
                    <MenuList />
                </Box>
            </MobileView>
        </>
    )

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: 0,
                width: matchUpMd ? drawerOpen ? drawerWidth : 72 : 'auto',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen
                })
            }}
        >
            <Drawer
                variant={matchUpMd ? 'permanent' : 'temporary'}
                anchor="left"
                open={drawerOpen}
                onClose={drawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: matchUpMd ? drawerOpen ? drawerWidth : 72 : drawerWidth,
                        background: '#fff',
                        color: theme.palette.text.primary,
                        borderRight: '1px solid rgba(145, 158, 171, 0.12)',
                        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen
                        }),
                        overflowX: 'hidden',
                        [theme.breakpoints.up('md')]: {
                            position: 'fixed',
                            height: 'calc(100% - 56px)',
                            top: '56px',
                            left: 0
                        },
                        '& .MuiListSubheader-root': {
                            color: 'rgb(99, 115, 129)',
                            lineHeight: '1.5rem',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            padding: '24px 16px 8px',
                            letterSpacing: '0.5px'
                        },
                        '& .MuiListItemButton-root': {
                            minHeight: '44px',
                            borderRadius: '8px',
                            marginBottom: '4px',
                            padding: '8px 12px',
                            '&:hover': {
                                backgroundColor: 'rgba(145, 158, 171, 0.08)'
                            },
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.12)'
                                }
                            }
                        },
                        '& .MuiListItemIcon-root': {
                            minWidth: 36,
                            color: 'rgb(99, 115, 129)'
                        }
                    }
                }}
                ModalProps={{ keepMounted: true }}
            >
                {drawer}
            </Drawer>
        </Box>
    )
}

Sidebar.propTypes = {
    drawerOpen: PropTypes.bool,
    drawerToggle: PropTypes.func
}

export default Sidebar
