import * as React from 'react'
import Box from '@mui/material/Box'
import MuiCard from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import authApi from '@/api/auth'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'

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
    const [verifStatus, setVerifStatus] = React.useState(0)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    React.useEffect(() => {
        const code = searchParams.get('code')
        console.log(code)

        const verifCode = async () => {
            try {
                const request = await authApi.verifCode({
                    code
                })

                console.log(request)

                if (request.data) {
                    setToken(request.data.token)
                    setUser({
                        user: {
                            id: request.data.user.id,
                            name: request.data.user.name
                        },
                        isAuthenticated: true
                    })
                    localStorage.setItem('site', request.data.token)

                    navigate('/')
                }
            } catch (err) {
                console.log(err)
            }
        }

        verifCode()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Box sx={{ display: { sm: 'flex' }, justifyContent: 'center', height: '100vh' }}>
            <Card variant='outlined' sx={{ height: { xs: '100%', sm: 'fit-content' } }}>
                <Typography component='h1' variant='h4' sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
                    Please wait a second
                </Typography>

                <Box noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
                    <Typography>You will be redirecting </Typography>
                </Box>
            </Card>
        </Box>
    )
}
