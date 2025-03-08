import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import { Box, Grid, Card, Typography, Stack, Button, IconButton, InputBase, Paper, alpha } from '@mui/material'

// project imports
import { DashboardTable } from '@/ui-component/table/DashboardTable'
import ErrorBoundary from '@/ErrorBoundary'

// API
import chatflowsApi from '@/api/chatflows'
import client from '@/api/client'

// const

// Hooks
import useApi from '@/hooks/useApi'

// icons
import { IconSearch } from '@tabler/icons-react'
import { useTheme } from '@emotion/react'

const brandColor = '#2b63d9'

/* eslint-disable */
const FeatureCard = ({ title, description, buttonText, gradient }) => (
    <Card
        sx={{
            height: '100%',
            background: gradient,
            p: 3,
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
                pointerEvents: 'none'
            }
        }}
    >
        <Stack spacing={3}>
            <Typography
                variant='h5'
                sx={{
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '1.25rem',
                    lineHeight: 1.4,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                {title}
            </Typography>
            <Typography
                sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    flex: 1,
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
            >
                {description}
            </Typography>
            <Button
                variant='contained'
                sx={{
                    bgcolor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    textTransform: 'none',
                    borderRadius: '12px',
                    py: 1,
                    px: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.25)'
                    }
                }}
            >
                {buttonText}
            </Button>
        </Stack>
    </Card>
)
/* eslint-disable */

const Home = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [images, setImages] = useState({})
    const [searchQuery, setSearchQuery] = useState('')

    const getAllChatflowsApi = useApi(chatflowsApi.getAllChatflows)
    const getAllAgentflowsApi = useApi(chatflowsApi.getAllAgentflows)

    const processFlowImages = (flow) => {
        try {
            const flowDataStr = flow.flowData
            const flowData = JSON.parse(flowDataStr)
            const nodes = flowData.nodes || []
            const flowImages = []
            for (const node of nodes) {
                if (node.data?.name) {
                    // Use client.defaults.baseURL to ensure correct API path
                    const imageSrc = `${client.defaults.baseURL}/node-icon/${node.data.name}`
                    if (!flowImages.includes(imageSrc)) {
                        flowImages.push(imageSrc)
                    }
                }
            }
            return flowImages
        } catch (err) {
            console.error('Error processing flow images:', err)
            return []
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [chatflows, agentflows] = await Promise.all([getAllChatflowsApi.request(), getAllAgentflowsApi.request()])

                // Process images for all flows
                const newImages = {}

                // Process chatflows
                if (chatflows?.data) {
                    for (const flow of chatflows.data) {
                        newImages[flow.id] = processFlowImages(flow)
                    }
                }

                // Process agentflows
                if (agentflows?.data) {
                    for (const flow of agentflows.data) {
                        newImages[flow.id] = processFlowImages(flow)
                    }
                }

                setImages(newImages)
                setLoading(false)
            } catch (err) {
                setError(err)
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const goToFlows = () => navigate('/chatflows')
    const goToAgents = () => navigate('/agentflows')
    const goToSupport = () => navigate('/support')

    return (
        <Stack spacing={4}>
            <Grid
                container
                gap={4}
                sx={{
                    flexWrap: 'wrap',
                    [theme.breakpoints.up('md')]: {
                        flexWrap: 'nowrap'
                    }
                }}
            >
                <Grid>
                    <FeatureCard
                        title='Ready Made Solutions'
                        description='Get started with our customizable templates. Save time and focus on what truly matters—bringing your creative ideas to life.'
                        buttonText='Browse Templates'
                        gradient={`linear-gradient(135deg, ${brandColor} 0%, ${alpha(brandColor, 0.8)} 100%)`}
                    />
                </Grid>
                <Grid>
                    <FeatureCard
                        title='AI-Powered Automation'
                        description='Unlock the power of AI to simplify your processes. From task automation to insightful reporting, AI helps you work smarter, not harder.'
                        buttonText='Try AI Tools'
                        gradient={`linear-gradient(135deg, ${alpha(brandColor, 0.9)} 0%, ${alpha(brandColor, 0.7)} 100%)`}
                    />
                </Grid>
                <Grid>
                    <FeatureCard
                        title='Knowledge Base'
                        description='Reach out for support whenever you need it. Our help resources and expert team are here to assist you at every step of your journey.'
                        buttonText='Get Support'
                        gradient={`linear-gradient(135deg, ${alpha(brandColor, 0.8)} 0%, ${alpha(brandColor, 0.6)} 100%)`}
                    />
                </Grid>
            </Grid>

            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Card
                    sx={{
                        borderRadius: 3,
                        boxShadow: `0 0 2px 0 ${alpha(brandColor, 0.2)}, 0 12px 24px -4px ${alpha(brandColor, 0.12)}`
                    }}
                >
                    <Box sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <Stack direction='row' spacing={2} alignItems='center'>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: '2px 4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: 400,
                                        border: `1px solid ${alpha(brandColor, 0.2)}`,
                                        borderRadius: 2,
                                        '&:hover': {
                                            borderColor: alpha(brandColor, 0.4)
                                        }
                                    }}
                                >
                                    <IconButton sx={{ p: '10px', color: alpha(brandColor, 0.6) }}>
                                        <IconSearch size={20} />
                                    </IconButton>
                                    <InputBase
                                        sx={{
                                            ml: 1,
                                            flex: 1,
                                            '& input::placeholder': {
                                                color: alpha(brandColor, 0.6)
                                            }
                                        }}
                                        placeholder='Search workflows'
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </Paper>
                            </Stack>

                            <DashboardTable
                                chatflows={getAllChatflowsApi.data}
                                agentflows={getAllAgentflowsApi.data}
                                assistants={[]} // TODO: Add assistants data when available
                                images={images}
                                updateFlowsApi={getAllChatflowsApi}
                                setError={setError}
                            />
                        </Stack>
                    </Box>
                </Card>
            )}
        </Stack>
    )
}

export default Home
