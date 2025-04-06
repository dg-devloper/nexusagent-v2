import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import { Stack, Typography } from '@mui/material'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import { FlowListTable } from '@/ui-component/table/FlowListTable'
import ErrorBoundary from '@/ErrorBoundary'
import HeaderSection from '@/layout/MainLayout/HeaderSection'

// API
import chatflowsApi from '@/api/chatflows'
import client from '@/api/client'

// Hooks
import useApi from '@/hooks/useApi'
// const

// icons
import { IconPlus } from '@tabler/icons-react'
import { StyledButton } from '@/ui-component/button/StyledButton'
import AppIcon from '@/menu-items/icon'

const Chatflows = () => {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [images, setImages] = useState({})
    const [search, setSearch] = useState('')

    const getAllChatflowsApi = useApi(chatflowsApi.getAllChatflows)
    const [view, setView] = useState('list')

    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }

    function filterFlows(data) {
        return (
            data.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            (data.category && data.category.toLowerCase().indexOf(search.toLowerCase()) > -1) ||
            data.id.toLowerCase().indexOf(search.toLowerCase()) > -1
        )
    }

    const addNew = () => {
        navigate('/canvas')
    }

    const processFlowImages = (flow) => {
        try {
            const flowDataStr = flow.flowData
            const flowData = JSON.parse(flowDataStr)
            const nodes = flowData.nodes || []
            const flowImages = []
            for (const node of nodes) {
                if (node.data?.name) {
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
        getAllChatflowsApi.request()
    }, [])

    useEffect(() => {
        if (getAllChatflowsApi.error) {
            if (getAllChatflowsApi.error?.response?.status === 401) {
                // Handle unauthorized
            } else {
                setError(getAllChatflowsApi.error)
            }
        }
    }, [getAllChatflowsApi.error])

    useEffect(() => {
        setLoading(getAllChatflowsApi.loading)
    }, [getAllChatflowsApi.loading])

    useEffect(() => {
        if (getAllChatflowsApi.data) {
            try {
                const newImages = {}
                for (const flow of getAllChatflowsApi.data) {
                    newImages[flow.id] = processFlowImages(flow)
                }
                setImages(newImages)
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllChatflowsApi.data])

    return (
        <MainCard>
            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Stack flexDirection='column' sx={{ gap: 3 }}>
                    <HeaderSection
                        onButtonClick={addNew}
                        onSearchChange={onSearchChange}
                        title={AppIcon.flowStudio.headerTitle}
                        subtitle={AppIcon.flowStudio.description}
                        icon={AppIcon.flowStudio.icon}
                    >
                        <StyledButton
                            variant='contained'
                            onClick={addNew}
                            startIcon={<IconPlus />}
                            sx={{
                                borderRadius: 2,
                                height: 40,
                                backgroundColor: '#1F64FF',
                                '&:hover': {
                                    backgroundColor: '#1957E3'
                                }
                            }}
                        >
                            Add
                        </StyledButton>
                    </HeaderSection>

                    {view === 'list' && (
                        <FlowListTable
                            data={getAllChatflowsApi.data}
                            images={images}
                            isLoading={isLoading}
                            filterFunction={filterFlows}
                            updateFlowsApi={getAllChatflowsApi}
                            setError={setError}
                        />
                    )}

                    {!isLoading && (!getAllChatflowsApi.data || getAllChatflowsApi.data.length === 0) && (
                        <Stack
                            sx={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 8
                            }}
                            flexDirection='column'
                            spacing={2}
                        >
                            <Typography
                                variant='h5'
                                sx={{
                                    color: 'rgb(99, 115, 129)',
                                    textAlign: 'center',
                                    maxWidth: 300
                                }}
                            >
                                No flows yet. Create your first flow to get started!
                            </Typography>
                            <StyledButton
                                variant='contained'
                                onClick={addNew}
                                startIcon={<IconPlus />}
                                sx={{
                                    mt: 2,
                                    borderRadius: 2,
                                    height: 40,
                                    backgroundColor: '#1F64FF',
                                    '&:hover': {
                                        backgroundColor: '#1957E3'
                                    }
                                }}
                            >
                                Create Flow
                            </StyledButton>
                        </Stack>
                    )}
                </Stack>
            )}

            <ConfirmDialog />
        </MainCard>
    )
}

export default Chatflows
