import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Link } from '@mui/material'

const drawerWidth = 240
const navItems = ['Product', 'Agent', 'Enterprise', 'Pricing']
const Navbar = (props) => {
    const { window } = props
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState)
    }

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant='h6' sx={{ my: 2 }}>
                MUI
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )

    const container = window !== undefined ? () => window().document.body : undefined

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                component='nav'
                style={{
                    background: 'white',
                    borderBottom: '1px solid red',
                    boxShadow: 'none'
                }}
            >
                <Toolbar>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        edge='start'
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' }, color: 'black' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 3rem'
                        }}
                    >
                        <Typography variant='h6' component='div' sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                            MUI
                        </Typography>
                        <Box sx={{ display: { xs: 'none', sm: 'block', flexGrow: 1 } }}>
                            {navItems.map((item) => (
                                <Link underline='none' href='/' key={item} sx={{ color: 'black', marginRight: '1rem' }}>
                                    {item}
                                </Link>
                            ))}
                        </Box>

                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <button>Login</button>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant='temporary'
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </Box>
    )
}

Navbar.propTypes = {
    window: PropTypes.any
}

export default Navbar
