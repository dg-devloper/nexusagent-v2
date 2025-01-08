import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Avatar, Box, ButtonBase } from '@mui/material'

// project imports
import ProfileSection from './ProfileSection'
import LangSection from './LangSection'

// assets
import { IconMenu2 } from '@tabler/icons-react'

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle, hideLeftDrawerToggle = false }) => {
    const theme = useTheme()
    const navigate = useNavigate()

    const signOutClicked = () => {
        localStorage.removeItem('site')
        navigate('/login', { replace: true })
        navigate(0)
    }

    return (
        <>
            {/* logo & toggler button */}
            {!hideLeftDrawerToggle && (
                <Box
                    sx={{
                        width: 228,
                        display: 'flex',
                        [theme.breakpoints.down('md')]: {
                            width: 'auto'
                        }
                    }}
                >
                    <ButtonBase sx={{ overflow: 'hidden' }}>
                        <Avatar
                            variant='rounded'
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.primary.main,
                                color: 'white',
                                opacity: '.9',
                                '&:hover': {
                                    background: theme.palette.primary.main,
                                    opacity: 1
                                }
                            }}
                            onClick={handleLeftDrawerToggle}
                            color='inherit'
                        >
                            <IconMenu2 stroke={1.5} size='1.3rem' />
                        </Avatar>
                    </ButtonBase>
                </Box>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <LangSection />
            <Box sx={{ ml: 2 }}></Box>
            <ProfileSection handleLogout={signOutClicked} username={localStorage.getItem('username') ?? ''} />
        </>
    )
}

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func,
    hideLeftDrawerToggle: PropTypes.bool
}

export default Header
