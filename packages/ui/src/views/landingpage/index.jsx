import { Box, Container, Typography } from '@mui/material'
import Navbar from './Navbar'
import { useTheme } from '@emotion/react'
import { StyledFab } from '@/ui-component/button/StyledFab'

export default function LadningPage() {
    const theme = useTheme()

    const headerStyle = {
        color: 'white',
        textAlign: 'center',
        [theme.breakpoints.up('md')]: {
            fontSize: '4rem'
        }
    }

    return (
        <>
            <Navbar />

            <Container maxWidth='xl' sx={{ marginTop: '6rem' }}>
                <Box
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '1rem',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '.5rem'
                    }}
                >
                    <Typography variant='h1' sx={headerStyle}>
                        AI PLATFORM THAT MAKES
                    </Typography>
                    <Typography variant='h1' sx={headerStyle}>
                        JOB SEARCHING <span style={{ color: 'gold' }}>EASIER & MORE FUN</span>
                    </Typography>

                    <Typography variant='h3' sx={{ color: 'white', textAlign: 'center' }}>
                        From AI Tools to AI agents to multi-agent teams, anyone can build and manage an entire <br /> AI workforce in one
                        powerful visual platform
                    </Typography>

                    <Box sx={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <StyledFab
                            variant='extended'
                            sx={{
                                borderRadius: '8px',
                                padding: '.5rem 1.2rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '.5rem'
                            }}
                            size='medium'
                            color='primary'
                            aria-label='chat'
                        >
                            Try For Free
                        </StyledFab>
                        <StyledFab
                            variant='extended'
                            sx={{
                                borderRadius: '8px',
                                padding: '.5rem 1.2rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '.5rem',
                                backgroundColor: 'white',
                                color: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: 'white',
                                    backgroundImage: `linear-gradient(rgb(0 0 0/10%) 0 0)`
                                }
                            }}
                            size='medium'
                            aria-label='chat'
                        >
                            Request Demo
                        </StyledFab>
                    </Box>
                    <Container
                        maxWidth='lg'
                        sx={{ backgroundColor: 'white', height: '5rem', marginTop: '2rem', borderRadius: '1rem' }}
                    ></Container>
                </Box>
            </Container>
        </>
    )
}
