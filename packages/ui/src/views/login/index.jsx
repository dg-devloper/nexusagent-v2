import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
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
import { Divider } from '@mui/material'
import GoogleButton from './GoogleButton'
const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px'
    },
    ...theme.applyStyles('dark', {
        boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px'
    })
}))

export default function SignInCard() {
    const { setToken, setUser } = useAuth()
    const navigate = useNavigate()
    const [usernameError, setUsernameError] = React.useState(false)
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('')
    const [passwordError, setPasswordError] = React.useState(false)
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const [loginError, setLoginError] = React.useState(false)
    const [accountExpired, setAccountExpired] = React.useState(false)

    // const handleClickOpen = () => {
    //     setOpen(true)
    // }

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
        <Box sx={{ display: { sm: 'flex' }, justifyContent: 'center', height: '100vh' }}>
            <Card variant='outlined' sx={{ height: { xs: '100%', sm: 'fit-content' } }}>
                {/* <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <SitemarkIcon />
            </Box> */}
                <Typography component='h1' variant='h4' sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
                    Sign in
                </Typography>

                {loginError && (
                    <Typography variant='span' sx={{ width: '100%', color: 'red' }}>
                        Invalid Credential
                    </Typography>
                )}

                {accountExpired && (
                    <Typography variant='span' sx={{ width: '100%', color: 'red' }}>
                        Account has expired
                    </Typography>
                )}
                <Box
                    component='form'
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
                >
                    <FormControl>
                        <FormLabel htmlFor='username'>Username</FormLabel>
                        <TextField
                            error={usernameError}
                            helperText={usernameErrorMessage}
                            id='username'
                            type='text'
                            name='username'
                            placeholder='Username'
                            autoComplete='username'
                            required
                            fullWidth
                            variant='outlined'
                            color={usernameError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <FormControl>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <FormLabel htmlFor='password'>Password</FormLabel>
                            {/* <Link component='button' type='button' onClick={handleClickOpen} variant='body2' sx={{ alignSelf: 'baseline' }}>
                                Forgot your password?
                            </Link> */}
                        </Box>
                        <TextField
                            error={passwordError}
                            helperText={passwordErrorMessage}
                            name='password'
                            placeholder='••••••'
                            type='password'
                            id='password'
                            autoComplete='current-password'
                            required
                            fullWidth
                            variant='outlined'
                            color={passwordError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <ForgotPassword open={open} handleClose={handleClose} />
                    <Button type='submit' fullWidth variant='contained' onClick={validateInputs} sx={{ borderRadius: '16px' }}>
                        Sign in
                    </Button>
                    <Typography sx={{ textAlign: 'center' }}>
                        Don&apos;t have an account?{' '}
                        <span>
                            <Link
                                to={{
                                    pathname: '/register'
                                }}
                                href='/material-ui/getting-started/templates/sign-in/'
                                variant='body2'
                                sx={{ alignSelf: 'center' }}
                            >
                                Sign up
                            </Link>
                        </span>
                    </Typography>
                </Box>
                <Divider>or</Divider>
                <GoogleButton />
            </Card>
        </Box>
    )
}
