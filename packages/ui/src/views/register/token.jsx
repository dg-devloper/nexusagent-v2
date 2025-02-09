import * as React from 'react'
import Box from '@mui/material/Box'
import MuiCard from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import authApi from '@/api/auth'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import { useSearchParams } from 'react-router-dom'

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
    const [verifStatus, setVerifStatus] = React.useState(0)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    React.useEffect(() => {
        const token = searchParams.get('token')

        if (!token) {
            navigate('/login')
        }

        const verif = async () => {
            try {
                const response = await authApi.verification({ token })

                if (response.data) {
                    setVerifStatus(1)

                    setTimeout(() => {
                        navigate('/login')
                    }, 1000)
                }
            } catch (e) {
                setVerifStatus(2)
            }
        }

        verif()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Box sx={{ display: { sm: 'flex' }, justifyContent: 'center', height: '100vh' }}>
            <Card variant='outlined' sx={{ height: { xs: '100%', sm: 'fit-content' } }}>
                <Typography component='h1' variant='h4' sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
                    Account Verification
                </Typography>

                {verifStatus === 0 && (
                    <Alert variant='filled' severity='info'>
                        Verification on Prosses
                    </Alert>
                )}

                {verifStatus === 1 && (
                    <Alert variant='filled' severity='success'>
                        Account has been activated
                    </Alert>
                )}

                {verifStatus === 2 && (
                    <Alert variant='filled' severity='error'>
                        Failed verification try again
                    </Alert>
                )}

                {/* <Alert variant='filled' severity='success'>
                    Account has been activated
                </Alert> */}

                <Box noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
                    <Typography>
                        If you not get redirect click here{' '}
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
                </Box>
            </Card>
        </Box>
    )
}
