import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import ForgotPassword from './ForgotPassword'
import authApi from '@/api/auth'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { 
    Divider, 
    IconButton, 
    InputAdornment,
    Paper
} from '@mui/material'
import { 
    Visibility, 
    VisibilityOff,
    Google as GoogleIcon,
    Facebook as FacebookIcon,
    Mail as MailIcon,
    Lock as LockIcon
} from '@mui/icons-material'

const FormContainer = styled(Paper)(({ theme }) => ({
    width: '100%',
    maxWidth: 420,
    padding: theme.spacing(4),
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(6)
    }
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        height: 52,
        '& fieldset': {
            borderColor: '#E2E8F0'
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main
        }
    },
    '& .MuiOutlinedInput-input': {
        padding: '14px 16px 14px 48px',
        '&::placeholder': {
            color: '#94A3B8',
            opacity: 1
        }
    }
}))

const StyledButton = styled(Button)(({ theme }) => ({
    height: 52,
    borderRadius: 12,
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    boxShadow: 'none',
    '&:hover': {
        boxShadow: 'none'
    }
}))

const SocialButton = styled(Button)(({ theme }) => ({
    height: 52,
    borderRadius: 12,
    textTransform: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    '&:hover': {
        backgroundColor: '#F1F5F9',
        borderColor: '#CBD5E1'
    }
}))

const InputIcon = styled(Box)(({ theme }) => ({
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94A3B8',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center'
}))

export default function SignInCard() {
    const { setToken, setUser } = useAuth()
    const navigate = useNavigate()
    const [usernameError, setUsernameError] = React.useState(false)
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('')
    const [passwordError, setPasswordError] = React.useState(false)
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [loginError, setLoginError] = React.useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleClose = () => {
        setOpen(false)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoginError(false)

        if (usernameError || passwordError) {
            return
        }
        const data = new FormData(event.currentTarget)

        try {
            const response = await authApi.login({
                username: data.get('username'),
                password: data.get('password')
            })

            if (response.data) {
                setToken(response.data.token)
                setUser({
                    user: {
                        id: response.data.user.id,
                        name: response.data.user.name
                    },
                    isAuthenticated: true
                })
                localStorage.setItem('site', response.data.token)
                navigate('/')
            }
        } catch (e) {
            setLoginError(true)
        }
    }

    const validateInputs = () => {
        const username = document.getElementById('username')
        const password = document.getElementById('password')
        let isValid = true

        if (!username.value) {
            setUsernameError(true)
            setUsernameErrorMessage('Username cannot be empty.')
            isValid = false
        } else {
            setUsernameError(false)
            setUsernameErrorMessage('')
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true)
            setPasswordErrorMessage('Password must be at least 6 characters long.')
            isValid = false
        } else {
            setPasswordError(false)
            setPasswordErrorMessage('')
        }

        return isValid
    }

    return (
        <Box 
            sx={{ 
                display: 'flex',
                minHeight: '100vh'
            }}
        >
            {/* Left Panel */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    backgroundColor: '#fff'
                }}
            >
                {/* Logo */}
                <Box sx={{ position: 'absolute', top: 40, left: 40 }}>
                    <img src="/logo.png" alt="Logo" style={{ height: 40 }} />
                </Box>

                <FormContainer elevation={0}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
                        Sign In
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748B', mb: 4, textAlign: 'center' }}>
                        Welcome back! Please enter your details
                    </Typography>

                    {loginError && (
                        <Box
                            sx={{
                                p: 2,
                                mb: 3,
                                borderRadius: 2,
                                backgroundColor: '#FEF2F2',
                                color: '#DC2626'
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Invalid credentials. Please try again.
                            </Typography>
                        </Box>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Email</FormLabel>
                            <Box sx={{ position: 'relative' }}>
                                <InputIcon>
                                    <MailIcon fontSize="small" />
                                </InputIcon>
                                <StyledTextField
                                    error={usernameError}
                                    helperText={usernameErrorMessage}
                                    id="username"
                                    name="username"
                                    placeholder="Enter your email"
                                    fullWidth
                                />
                            </Box>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Password</FormLabel>
                            <Box sx={{ position: 'relative' }}>
                                <InputIcon>
                                    <LockIcon fontSize="small" />
                                </InputIcon>
                                <StyledTextField
                                    error={passwordError}
                                    helperText={passwordErrorMessage}
                                    name="password"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                    sx={{ color: '#94A3B8', mr: 1 }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Box>
                        </FormControl>

                        <StyledButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                            sx={{ mb: 3 }}
                        >
                            Sign in
                        </StyledButton>

                        <Divider sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ color: '#64748B', px: 2 }}>
                                or continue with
                            </Typography>
                        </Divider>

                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <SocialButton 
                                fullWidth 
                                startIcon={<GoogleIcon />}
                            >
                                Google
                            </SocialButton>
                            <SocialButton 
                                fullWidth 
                                startIcon={<FacebookIcon />}
                            >
                                Facebook
                            </SocialButton>
                        </Box>

                        <Typography variant="body2" align="center" sx={{ color: '#64748B' }}>
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                style={{
                                    color: '#2563EB',
                                    textDecoration: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Sign up
                            </Link>
                        </Typography>
                    </Box>
                </FormContainer>
            </Box>

            {/* Right Panel */}
            <Box
                sx={{
                    flex: 1,
                    p: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#2563EB',
                    color: '#fff',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.1,
                        backgroundImage: 'url("/pattern.svg")',
                        backgroundRepeat: 'repeat'
                    }}
                />
                
                <Box sx={{ position: 'relative', maxWidth: 480, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                        Welcome back!
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                        Please sign in to your account
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                        Access your dashboard to manage your business analytics, reports, and insights all in one place.
                    </Typography>

                    {/* Analytics Preview */}
                    <Box
                        sx={{
                            mt: 6,
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <img 
                            src="/analytics-preview.png" 
                            alt="Analytics Preview" 
                            style={{ 
                                width: '100%',
                                height: 'auto',
                                borderRadius: 8
                            }} 
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
