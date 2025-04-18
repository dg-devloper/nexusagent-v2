import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import { Box, Skeleton, Stack } from '@mui/material'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import ItemCard from '@/ui-component/cards/ItemCard'
import { gridSpacing } from '@/store/constant'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import { FlowListTable } from '@/ui-component/table/FlowListTable'
import ErrorBoundary from '@/ErrorBoundary'

// API
import chatflowsApi from '@/api/chatflows'

// Hooks
import useApi from '@/hooks/useApi'

// const
import { baseURL } from '@/store/constant'

// icons
import HeaderSection from '@/layout/MainLayout/HeaderSection'
import { StyledButton } from '@/ui-component/button/StyledButton'
import { IconPlus } from '@tabler/icons-react'

import AppIcon from '@/menu-items/icon'

// ==============================|| AGENTS ||============================== //

const Agentflows = () => {
    const navigate = useNavigate()

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [images, setImages] = useState({})
    const [search, setSearch] = useState('')

    const getAllAgentflows = useApi(chatflowsApi.getAllAgentflows)

    const view = 'list'

    // const handleChange = (event, nextView) => {
    //     if (nextView === null) return
    //     localStorage.setItem('flowDisplayStyle', nextView)
    //     setView(nextView)
    // }

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
        navigate('/agentcanvas')
    }

    const goToCanvas = (selectedAgentflow) => {
        navigate(`/agentcanvas/${selectedAgentflow.id}`)
    }

    useEffect(() => {
        getAllAgentflows.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllAgentflows.loading)
    }, [getAllAgentflows.loading])

    useEffect(() => {
        if (getAllAgentflows.data) {
            try {
                const agentflows = getAllAgentflows.data
                const images = {}
                for (let i = 0; i < agentflows.length; i += 1) {
                    const flowDataStr = agentflows[i].flowData
                    const flowData = JSON.parse(flowDataStr)
                    const nodes = flowData.nodes || []
                    images[agentflows[i].id] = []
                    for (let j = 0; j < nodes.length; j += 1) {
                        const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                        if (!images[agentflows[i].id].includes(imageSrc)) {
                            images[agentflows[i].id].push(imageSrc)
                        }
                    }
                }
                setImages(images)
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllAgentflows.data])

    return (
        <MainCard>
            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Stack flexDirection='column' sx={{ gap: 3 }}>
                    <HeaderSection
                        onSearchChange={onSearchChange}
                        onButtonClick={addNew}
                        title={AppIcon.teamAgents.headerTitle}
                        subtitle={AppIcon.teamAgents.description}
                        icon={AppIcon.teamAgents.icon}
                    >
                        <StyledButton variant='contained' onClick={addNew} startIcon={<IconPlus />} sx={{ borderRadius: 2, height: 40 }}>
                            Add
                        </StyledButton>
                    </HeaderSection>
                    {!view || view === 'card' ? (
                        <>
                            {isLoading && !getAllAgentflows.data ? (
                                <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                    <Skeleton variant='rounded' height={160} />
                                    <Skeleton variant='rounded' height={160} />
                                    <Skeleton variant='rounded' height={160} />
                                </Box>
                            ) : (
                                <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                    {getAllAgentflows.data?.filter(filterFlows).map((data, index) => (
                                        <ItemCard key={index} onClick={() => goToCanvas(data)} data={data} images={images[data.id]} />
                                    ))}
                                </Box>
                            )}
                        </>
                    ) : (
                        <FlowListTable
                            isAgentCanvas={true}
                            data={getAllAgentflows.data}
                            images={images}
                            isLoading={isLoading}
                            filterFunction={filterFlows}
                            updateFlowsApi={getAllAgentflows}
                            setError={setError}
                        />
                    )}
                    {!isLoading && (!getAllAgentflows.data || getAllAgentflows.data.length === 0) && (
                        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                            {/* <Box sx={{ p: 2, height: 'auto' }}>
                                <img
                                    style={{ objectFit: 'cover', height: '12vh', width: 'auto' }}
                                    src={AgentsEmptySVG}
                                    alt='AgentsEmptySVG'
                                />
                            </Box> */}
                            <div>No Agents Yet</div>
                        </Stack>
                    )}
                </Stack>
            )}

            <ConfirmDialog />
        </MainCard>
    )
}

export default Agentflows
