import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import authApi from '@/api/auth'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { 
    Divider, 
    FormControlLabel, 
    FormHelperText, 
    MenuItem, 
    Select,
    IconButton,
    InputAdornment,
    Checkbox,
    LinearProgress,
    Paper,
    useTheme
} from '@mui/material'
import { 
    Visibility, 
    VisibilityOff,
    Google as GoogleIcon,
    Facebook as FacebookIcon,
    Mail as MailIcon,
    Lock as LockIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Work as WorkIcon,
    Info as InfoIcon
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

const StyledSelect = styled(Select)(({ theme }) => ({
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    height: 52,
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#E2E8F0'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main
    },
    '& .MuiSelect-select': {
        paddingLeft: 48
    }
}))

const StyledButton = styled(Button)(({ theme, secondary }) => ({
    height: 52,
    borderRadius: 12,
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    boxShadow: 'none',
    ...(secondary && {
        backgroundColor: '#F8FAFC',
        color: theme.palette.text.primary,
        border: '1px solid #E2E8F0',
        '&:hover': {
            backgroundColor: '#F1F5F9',
            borderColor: '#CBD5E1'
        }
    }),
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

const steps = ['Account Setup', 'Professional Profile', 'Organization Details']

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

export default function SignUpCard() {
    const { setToken, setUser } = useAuth()
    const navigate = useNavigate()
    const theme = useTheme()

    const [success, setSuccess] = React.useState(0)
    const [step, setStep] = React.useState(1)
    const [checked, setChecked] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)

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

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const backOneStep = () => {
        setStep((currVal) => currVal - 1)
    }

    const validateStepOne = () => {
        let isValid = true

        if (!email) {
            setEmailError(true)
            setEmailErrorMessage('Email is required')
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true)
            setEmailErrorMessage('Please enter a valid email address')
            isValid = false
        } else {
            setEmailError(false)
            setEmailErrorMessage('')
        }

        if (isValid) {
            setStep(2)
        }
    }

    const validateStepTwo = () => {
        let isValid = true

        if (!name) {
            setNameError(true)
            setNameErrorMessage('Full name is required')
            isValid = false
        }

        if (!username) {
            setUsernameError(true)
            setUsernameErrorMessage('Username is required')
            isValid = false
        }

        if (!password) {
            setPasswordError(true)
            setPasswordErrorMessage('Password is required')
            isValid = false
        } else if (password.length < 6) {
            setPasswordError(true)
            setPasswordErrorMessage('Password must be at least 6 characters')
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
            setCompanyNameErrorMessage('Organization name is required')
            isValid = false
        }

        if (yourRole === '0') {
            setYourRoleError(true)
            setYourRoleErrorMessage('Please select your role')
            isValid = false
        }

        if (aboutUs === '0') {
            setAboutUsError(true)
            setAboutUsErrorMessage('Please select an option')
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
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
                    {/* Progress */}
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Step {step} of {steps.length}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748B' }}>
                                {steps[step - 1]}
                            </Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={(step / steps.length) * 100}
                            sx={{ 
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: '#F1F5F9',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 3
                                }
                            }}
                        />
                    </Box>

                    {success > 0 && (
                        <Box
                            sx={{
                                p: 2,
                                mb: 3,
                                borderRadius: 2,
                                backgroundColor: success === 1 ? '#F0FDF4' : '#FEF2F2',
                                color: success === 1 ? '#16A34A' : '#DC2626'
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {success === 1 
                                    ? 'Account created successfully! Redirecting...' 
                                    : 'Error creating account. Please try again.'}
                            </Typography>
                        </Box>
                    )}

                    {step === 1 && (
                        <>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
                                Create Account
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748B', mb: 4, textAlign: 'center' }}>
                                Get started with your business account
                            </Typography>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Business Email</FormLabel>
                                <Box sx={{ position: 'relative' }}>
                                    <InputIcon>
                                        <MailIcon fontSize="small" />
                                    </InputIcon>
                                    <StyledTextField
                                        error={emailError}
                                        helperText={emailErrorMessage}
                                        type="email"
                                        placeholder="Enter your business email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        fullWidth
                                    />
                                </Box>
                            </FormControl>

                            <StyledButton
                                fullWidth
                                variant="contained"
                                onClick={validateStepOne}
                                sx={{ mb: 3 }}
                            >
                                Continue
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
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    style={{
                                        color: '#2563EB',
                                        textDecoration: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Sign in
                                </Link>
                            </Typography>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
                                Professional Profile
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748B', mb: 4, textAlign: 'center' }}>
                                Set up your professional identity
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <FormControl>
                                    <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Full Name</FormLabel>
                                    <Box sx={{ position: 'relative' }}>
                                        <InputIcon>
                                            <PersonIcon fontSize="small" />
                                        </InputIcon>
                                        <StyledTextField
                                            error={nameError}
                                            helperText={nameErrorMessage}
                                            placeholder="Enter your full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            fullWidth
                                        />
                                    </Box>
                                </FormControl>

                                <FormControl>
                                    <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Username</FormLabel>
                                    <Box sx={{ position: 'relative' }}>
                                        <InputIcon>
                                            <PersonIcon fontSize="small" />
                                        </InputIcon>
                                        <StyledTextField
                                            error={usernameError}
                                            helperText={usernameErrorMessage}
                                            placeholder="Choose a username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            fullWidth
                                        />
                                    </Box>
                                </FormControl>

                                <FormControl>
                                    <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Password</FormLabel>
                                    <Box sx={{ position: 'relative' }}>
                                        <InputIcon>
                                            <LockIcon fontSize="small" />
                                        </InputIcon>
                                        <StyledTextField
                                            error={passwordError}
                                            helperText={passwordErrorMessage}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Create a secure password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={checkboxChange}
                                            sx={{
                                                color: '#94A3B8',
                                                '&.Mui-checked': {
                                                    color: theme.palette.primary.main
                                                }
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" sx={{ color: '#64748B' }}>
                                            I agree to the Terms of Service and Privacy Policy
                                        </Typography>
                                    }
                                />

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <StyledButton
                                        fullWidth
                                        variant="outlined"
                                        onClick={backOneStep}
                                        secondary
                                    >
                                        Back
                                    </StyledButton>
                                    <StyledButton
                                        fullWidth
                                        variant="contained"
                                        onClick={validateStepTwo}
                                    >
                                        Continue
                                    </StyledButton>
                                </Box>
                            </Box>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
                                Organization Details
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748B', mb: 4, textAlign: 'center' }}>
                                Tell us about your organization
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <FormControl>
                                    <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Organization Name</FormLabel>
                                    <Box sx={{ position: 'relative' }}>
                                        <InputIcon>
                                            <BusinessIcon fontSize="small" />
                                        </InputIcon>
                                        <StyledTextField
                                            error={companyNameError}
                                            helperText={companyNameErrorMessage}
                                            placeholder="Enter organization name"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            fullWidth
                                        />
                                    </Box>
                                </FormControl>

                                <FormControl error={yourRoleError}>
                                    <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Your Role</FormLabel>
                                    <Box sx={{ position: 'relative' }}>
                                        <InputIcon>
                                            <WorkIcon fontSize="small" />
                                        </InputIcon>
                                        <StyledSelect
                                            value={yourRole}
                                            onChange={(e) => setYourRole(e.target.value)}
                                            displayEmpty
                                            fullWidth
                                        >
                                            <MenuItem value="0" disabled>Select your role</MenuItem>
                                            {roles.map((role) => (
                                                <MenuItem key={role} value={role}>{role}</MenuItem>
                                            ))}
                                        </StyledSelect>
                                    </Box>
                                    {yourRoleError && (
                                        <FormHelperText error>{yourRoleErrorMessage}</FormHelperText>
                                    )}
                                </FormControl>

                                <FormControl error={aboutUsError}>
                                    <FormLabel sx={{ mb: 1, fontWeight: 500 }}>How did you hear about us?</FormLabel>
                                    <Box sx={{ position: 'relative' }}>
                                        <InputIcon>
                                            <InfoIcon fontSize="small" />
                                        </InputIcon>
                                        <StyledSelect
                                            value={aboutUs}
                                            onChange={(e) => setAboutUs(e.target.value)}
                                            displayEmpty
                                            fullWidth
                                        >
                                            <MenuItem value="0" disabled>Select an option</MenuItem>
                                            {aboutUsValue.map((value) => (
                                                <MenuItem key={value} value={value}>{value}</MenuItem>
                                            ))}
                                        </StyledSelect>
                                    </Box>
                                    {aboutUsError && (
                                        <FormHelperText error>{aboutUsErrorMessage}</FormHelperText>
                                    )}
                                </FormControl>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <StyledButton
                                        fullWidth
                                        variant="outlined"
                                        onClick={backOneStep}
                                        secondary
                                    >
                                        Back
                                    </StyledButton>
                                    <StyledButton
                                        fullWidth
                                        variant="contained"
                                        onClick={validateStepThree}
                                    >
                                        Complete Setup
                                    </StyledButton>
                                </Box>
                            </Box>
                        </>
                    )}
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
                        Welcome to Our Platform
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                        Create your business account
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                        Join thousands of organizations who use our platform to streamline their operations and drive growth.
                    </Typography>

                    {/* Features Preview */}
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
                            src="/features-preview.png" 
                            alt="Features Preview" 
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
