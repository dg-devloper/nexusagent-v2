import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import authApi from '@/api/auth'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { Google } from '@mui/icons-material'
import { Divider, FormControlLabel, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import { useTheme } from '@emotion/react'
import Checkbox from '@mui/material/Checkbox'
import Alert from '@mui/material/Alert'

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

const roles = [
    'Marketing Ops',
    'Support Ops',
    'HR Ops',
    'Legal Ops',
    'Agency',
    'RevOps',
    'Developer',
    'Security Ops',
    'IT Ops',
    'Executive'
]

const aboutUsValue = ['Youtube', 'Linkedin', 'Referral', 'Twitter', 'Newsletter', 'Other']

export default function SignInCard() {
    const { setToken, setUser } = useAuth()
    const navigate = useNavigate()
    const theme = useTheme()

    const [success, setSuccess] = React.useState(0)
    const [step, setStep] = React.useState(1)

    const [checked, setChecked] = React.useState(false)

    const [yourRole, setYourRole] = React.useState('0')
    const [yourRoleError, setYourRoleError] = React.useState(false)
    const [yourRoleErrorMessage, setYourRoleErrorMessage] = React.useState(false)

    const [aboutUs, setAboutUs] = React.useState('0')
    const [aboutUsError, setAboutUsError] = React.useState(false)
    const [aboutUsErrorMessage, setAboutUsErrorMessage] = React.useState(false)

    const [email, setEmail] = React.useState('')
    const [emailError, setEmailError] = React.useState(false)
    const [emailErrorMessage, setEmailErrorMessage] = React.useState(false)

    const [username, setUsername] = React.useState('')
    const [usernameError, setUsernameError] = React.useState(false)
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState(false)

    const [name, setName] = React.useState('')
    const [nameError, setNameError] = React.useState(false)
    const [nameErrorMessage, setNameErrorMessage] = React.useState(false)

    const [password, setPassword] = React.useState('')
    const [passwordError, setPasswordError] = React.useState(false)
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState(false)

    const [companyName, setCompanyName] = React.useState('')
    const [companyNameError, setCompanyNameError] = React.useState(false)
    const [companyNameErrorMessage, setCompanyNameErrorMessage] = React.useState(false)

    // const [usernameError, setUsernameError] = React.useState(false)
    // const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('')
    // const [passwordError, setPasswordError] = React.useState(false)
    // const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const [loginError, setLoginError] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

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

    const backOneStep = () => {
        setStep((currVal) => {
            return currVal - 1
        })
    }

    const validateStepOne = () => {
        let isValid = true

        if (!email) {
            setEmailError(true)
            setEmailErrorMessage('Email cannot be empty')
            isValid = false
        }

        if (isValid) {
            setStep(2)
        }
    }

    const validateStepTwo = () => {
        let isValid = true

        if (!name) {
            setNameError(true)
            setNameErrorMessage('Name cannot be empty')
            isValid = false
        }

        if (!username) {
            setUsernameError(true)
            setUsernameErrorMessage('Username cannot be empty')
            isValid = false
        }

        if (!password) {
            setPasswordError(true)
            setPasswordErrorMessage('Password cannot be empty')
            isValid = false
        }

        if (!checked) {
            isValid = false
        }

        if (isValid) {
            setStep(3)
        }
    }

    const validateStepThree = async () => {
        let isValid = true

        if (!companyName) {
            setCompanyNameError(true)
            setCompanyNameErrorMessage('Company name cannot be empty')
            isValid = false
        }

        if (yourRole === '0') {
            setYourRoleError(true)
            setYourRoleErrorMessage('Invalid value')
            isValid = false
        }

        if (aboutUs === '0') {
            setAboutUsError(true)
            setAboutUsErrorMessage('Invalid value')
            isValid = false
        }

        if (isValid) {
            const data = {
                email,
                username,
                password,
                companyName,
                roleType: yourRole,
                hearAboutUs: aboutUs,
                name
            }

            try {
                const response = await authApi.register(data)

                setSuccess(1)

                setTimeout(() => {
                    navigate('/login')
                }, 1300)
            } catch (err) {
                setSuccess(2)

                console.log(err)
            }
        }
    }

    const checkboxChange = (event) => {
        setChecked(event.target.checked)
    }

    return (
        <Box sx={{ display: { sm: 'flex' }, justifyContent: 'center', height: '100vh' }}>
            <Card variant='outlined' sx={{ height: { xs: '100%', sm: 'fit-content' } }}>
                {success == 1 && (
                    <Alert severity='success' variant='filled'>
                        Account has been created
                    </Alert>
                )}

                {success == 2 && (
                    <Alert severity='error' variant='filled'>
                        Something went wrong when created account
                    </Alert>
                )}

                <Box noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
                    {step == 1 && (
                        <>
                            <Typography component='h1' variant='h4' sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
                                Sign up
                            </Typography>
                            <FormControl>
                                <FormLabel htmlFor='email'>Email</FormLabel>
                                <TextField
                                    error={emailError}
                                    helperText={emailErrorMessage}
                                    id='email'
                                    type='text'
                                    name='email'
                                    placeholder='Email'
                                    autoComplete='email'
                                    required
                                    fullWidth
                                    variant='outlined'
                                    color={usernameError ? 'error' : 'primary'}
                                    onChange={(event) => {
                                        setEmail(event.target.value)
                                    }}
                                    value={email}
                                />
                            </FormControl>
                            <Button type='submit' fullWidth variant='contained' onClick={validateStepOne} sx={{ borderRadius: '16px' }}>
                                Continue
                            </Button>
                        </>
                    )}

                    {step == 2 && (
                        <>
                            <Typography component='h1' variant='h4' sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
                                Create Profile
                            </Typography>
                            <Typography component='div' variant='subtitle1' sx={{ width: '100%' }}>
                                You will able to change this
                            </Typography>
                            <FormControl>
                                <FormLabel htmlFor='email'>Name</FormLabel>
                                <TextField
                                    error={nameError}
                                    helperText={nameErrorMessage}
                                    id='email'
                                    type='name'
                                    name='name'
                                    placeholder='Name'
                                    autoComplete='name'
                                    required
                                    fullWidth
                                    variant='outlined'
                                    color={nameError ? 'error' : 'primary'}
                                    onChange={(event) => {
                                        setName(event.target.value)
                                    }}
                                    value={name}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor='email'>Username</FormLabel>
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
                                    onChange={(event) => {
                                        setUsername(event.target.value)
                                    }}
                                    value={username}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor='email'>Password</FormLabel>
                                <TextField
                                    error={passwordError}
                                    helperText={passwordErrorMessage}
                                    id='password'
                                    type='password'
                                    name='password'
                                    placeholder='Password'
                                    autoComplete='password'
                                    required
                                    fullWidth
                                    variant='outlined'
                                    color={passwordError ? 'error' : 'primary'}
                                    onChange={(event) => {
                                        setPassword(event.target.value)
                                    }}
                                    value={password}
                                />
                            </FormControl>

                            <Box>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onChange={checkboxChange}
                                            sx={{
                                                color: theme.palette['primary'].main,
                                                '&.Mui-checked': {
                                                    color: theme.palette['primary'].main
                                                }
                                            }}
                                            aria-label='asd'
                                            label='asd'
                                        />
                                    }
                                    label="I agree to relevance AI's terms and conditions consent to data privacy policy"
                                />
                            </Box>

                            <Box
                                component='div'
                                sx={{
                                    display: 'flex',
                                    gap: '1rem',
                                    [theme.breakpoints.down('md')]: {
                                        flexWrap: 'wrap'
                                    }
                                }}
                            >
                                <Button
                                    type='submit'
                                    fullWidth
                                    variant='contained'
                                    onClick={backOneStep}
                                    sx={{
                                        borderRadius: '16px',
                                        background: '#525151',
                                        '&:hover': {
                                            background: '#605f5f'
                                        }
                                    }}
                                >
                                    Back
                                </Button>
                                <Button type='submit' fullWidth variant='contained' onClick={validateStepTwo} sx={{ borderRadius: '16px' }}>
                                    Continue
                                </Button>
                            </Box>
                        </>
                    )}

                    {step == 3 && (
                        <>
                            <Typography component='h1' variant='h4' sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
                                A bit about you
                            </Typography>
                            <Typography component='div' variant='subtitle1' sx={{ width: '100%' }}>
                                We personalise your relevance AI experience
                            </Typography>
                            <FormControl>
                                <FormLabel htmlFor='company name'>Company Name</FormLabel>
                                <TextField
                                    error={companyNameError}
                                    helperText={companyNameErrorMessage}
                                    id='companyname'
                                    type='text'
                                    name='companyname'
                                    placeholder='Company Name'
                                    autoComplete='company name'
                                    required
                                    fullWidth
                                    variant='outlined'
                                    color={companyNameError ? 'error' : 'primary'}
                                    onChange={(event) => {
                                        setCompanyName(event.target.value)
                                    }}
                                    value={companyName}
                                />
                            </FormControl>

                            <FormControl fullWidth error={yourRoleError}>
                                <InputLabel id='demo-simple-select-label'>Your Role</InputLabel>

                                <Select
                                    labelId='demo-simple-select-label'
                                    id='demo-simple-select'
                                    value={yourRole}
                                    label='Your Role'
                                    onChange={(event) => {
                                        setYourRole(event.target.value)
                                    }}
                                    input={<OutlinedInput notched label='your role' sx={{ color: 'black' }} />}
                                >
                                    <MenuItem value='0' disabled={true}>
                                        Select Role
                                    </MenuItem>
                                    {roles.map((role) => (
                                        <MenuItem key={role} value={role}>
                                            {role}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {yourRoleError && <FormHelperText>{yourRoleErrorMessage}</FormHelperText>}
                            </FormControl>

                            <FormControl fullWidth error={aboutUsError}>
                                <InputLabel id='demo-simple-select-label'>Where did you hear about us</InputLabel>

                                <Select
                                    labelId='demo-simple-select-label'
                                    id='demo-simple-select'
                                    value={aboutUs}
                                    label='Where did you hear about us'
                                    onChange={(event) => {
                                        setAboutUs(event.target.value)
                                    }}
                                    input={<OutlinedInput notched label='where did you hear about us' sx={{ color: 'black' }} />}
                                >
                                    <MenuItem value='0' disabled={true}>
                                        Select Value
                                    </MenuItem>
                                    {aboutUsValue.map((aboutUs) => (
                                        <MenuItem key={aboutUs} value={aboutUs}>
                                            {aboutUs}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {aboutUsError && <FormHelperText>{aboutUsErrorMessage}</FormHelperText>}
                            </FormControl>

                            <Box
                                component='div'
                                sx={{
                                    display: 'flex',
                                    gap: '1rem',
                                    [theme.breakpoints.down('md')]: {
                                        flexWrap: 'wrap'
                                    }
                                }}
                            >
                                <Button
                                    type='submit'
                                    fullWidth
                                    variant='contained'
                                    onClick={backOneStep}
                                    sx={{
                                        borderRadius: '16px',
                                        background: '#525151',
                                        '&:hover': {
                                            background: '#605f5f'
                                        }
                                    }}
                                >
                                    Back
                                </Button>
                                <Button
                                    type='submit'
                                    fullWidth
                                    variant='contained'
                                    onClick={validateStepThree}
                                    sx={{ borderRadius: '16px' }}
                                >
                                    Continue
                                </Button>
                            </Box>
                        </>
                    )}

                    {step == 1 && (
                        <Typography sx={{ textAlign: 'center' }}>
                            Already a member?{' '}
                            <span>
                                <Link
                                    to={{
                                        pathname: '/login'
                                    }}
                                    href='/material-ui/getting-started/templates/sign-in/'
                                    variant='body2'
                                    sx={{ alignSelf: 'center' }}
                                >
                                    Sign in
                                </Link>
                            </span>
                        </Typography>
                    )}
                </Box>

                {step == 1 && (
                    <>
                        <Divider>or</Divider>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button fullWidth variant='outlined' onClick={() => alert('Sign in with Google')} startIcon={<Google />}>
                                Sign in with Google
                            </Button>
                        </Box>
                    </>
                )}
            </Card>
        </Box>
    )
}
