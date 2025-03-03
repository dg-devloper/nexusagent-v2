import * as React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// material-ui
import {
    Box,
    Stack,
    Badge,
    Skeleton,
    Button,
    Typography,
    Container,
    Chip,
    alpha,
    InputBase,
    IconButton,
    Paper,
    Grid
} from '@mui/material'
import { 
    IconX, 
    IconSearch, 
    IconStarsFilled,
    IconSparkles,
    IconRobot,
    IconPlugConnectedX,
    IconMessageChatbot,
    IconLayoutGrid
} from '@tabler/icons-react'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import ItemCard from '@/ui-component/cards/ItemCard'
import ToolDialog from '@/views/tools/ToolDialog'
import ErrorBoundary from '@/ErrorBoundary'
import { closeSnackbar as closeSnackbarAction, enqueueSnackbar as enqueueSnackbarAction } from '@/store/actions'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'

// API
import marketplacesApi from '@/api/marketplaces'

// Hooks
import useApi from '@/hooks/useApi'
import useConfirm from '@/hooks/useConfirm'

// const
import { baseURL } from '@/store/constant'
import { gridSpacing } from '@/store/constant'
import useNotifier from '@/utils/useNotifier'
import AppIcon from '@/menu-items/icon'

const brandColor = '#2b63d9'

const FilterChip = ({ label, selected, onClick }) => (
    <Chip
        label={label}
        onClick={onClick}
        sx={{
            height: 40,
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: 600,
            backgroundColor: selected ? brandColor : 'rgba(255, 255, 255, 0.15)',
            color: selected ? '#fff' : 'rgba(255, 255, 255, 0.9)',
            border: `1px solid ${selected ? 'transparent' : 'rgba(255, 255, 255, 0.25)'}`,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                backgroundColor: selected ? alpha(brandColor, 0.9) : 'rgba(255, 255, 255, 0.25)',
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 12px ${alpha('#000', 0.2)}`
            }
        }}
    />
)

const FeaturedCard = ({ template, images, onClick }) => (
    <Paper
        onClick={onClick}
        sx={{
            p: 0,
            borderRadius: 4,
            cursor: 'pointer',
            overflow: 'hidden',
            background: '#fff',
            border: `1px solid ${alpha(brandColor, 0.1)}`,
            transition: 'all 0.3s ease-in-out',
            width: '100%',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 20px 40px -8px ${alpha(brandColor, 0.2)}`
            }
        }}
    >
        <Box
            sx={{
                height: 160,
                background: `linear-gradient(135deg, ${brandColor} 0%, ${alpha(brandColor, 0.8)} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 70%)',
                    mixBlendMode: 'overlay'
                }
            }}
        >
            {images && images.length > 0 && (
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        right: 16
                    }}
                >
                    {images.slice(0, 4).map((img, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '12px',
                                backgroundColor: alpha('#fff', 0.1),
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                padding: '8px'
                            }}
                        >
                            <Box
                                component="img"
                                src={img}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain'
                                }}
                                alt=""
                            />
                        </Box>
                    ))}
                    {images.length > 4 && (
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '12px',
                                backgroundColor: alpha('#fff', 0.1),
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '0.875rem',
                                fontWeight: 600
                            }}
                        >
                            +{images.length - 4}
                        </Box>
                    )}
                </Stack>
            )}
        </Box>
        <Stack spacing={2} sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Chip
                    label={template.type}
                    size="small"
                    sx={{
                        backgroundColor: alpha(brandColor, 0.1),
                        color: brandColor,
                        fontWeight: 600,
                        borderRadius: '8px'
                    }}
                />
                {template.badge && (
                    <Chip
                        label={template.badge}
                        size="small"
                        sx={{
                            backgroundColor: alpha('#10B981', 0.1),
                            color: '#059669',
                            fontWeight: 600,
                            borderRadius: '8px'
                        }}
                    />
                )}
            </Stack>
            <Stack spacing={1}>
                <Typography variant="h5" sx={{ color: 'rgb(30, 41, 59)', fontWeight: 600 }}>
                    {template.templateName}
                </Typography>
                <Typography 
                    sx={{ 
                        color: 'rgb(71, 85, 105)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {template.description}
                </Typography>
            </Stack>
        </Stack>
    </Paper>
)

const Marketplace = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useNotifier()

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [images, setImages] = useState({})
    const [search, setSearch] = useState('')
    const [showDialog, setShowDialog] = useState(false)
    const [toolDialogProps, setToolDialogProps] = useState({})
    const [selectedCategory, setSelectedCategory] = useState('all')

    const getAllTemplatesMarketplacesApi = useApi(marketplacesApi.getAllTemplatesFromMarketplaces)
    const getAllCustomTemplatesApi = useApi(marketplacesApi.getAllCustomTemplates)
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))
    const { confirm } = useConfirm()

    const categories = [
        { 
            id: 'all', 
            name: 'All Templates', 
            icon: IconLayoutGrid
        },
        { 
            id: 'chatflow', 
            name: 'Chat Flows', 
            icon: IconMessageChatbot
        },
        { 
            id: 'agentflow', 
            name: 'Multi-Agent', 
            icon: IconRobot
        },
        { 
            id: 'tool', 
            name: 'Tools & Integrations', 
            icon: IconPlugConnectedX
        }
    ]

    const featuredTemplates = getAllTemplatesMarketplacesApi.data?.filter(t => t.badge === 'POPULAR') || []
    const allTemplates = getAllTemplatesMarketplacesApi.data || []

    const normalizeType = (type) => {
        if (!type) return ''
        // Remove spaces and convert to lowercase
        return type.toLowerCase().replace(/\s+/g, '')
    }

    const filteredTemplates = allTemplates.filter(template => {
        // Category filtering
        if (selectedCategory !== 'all') {
            const templateType = normalizeType(template.type)
            const selectedType = normalizeType(selectedCategory)
            if (templateType !== selectedType) return false
        }

        // Search filtering
        if (search) {
            const searchTerm = search.toLowerCase()
            return (
                template.templateName?.toLowerCase().includes(searchTerm) ||
                template.description?.toLowerCase().includes(searchTerm) ||
                template.type?.toLowerCase().includes(searchTerm)
            )
        }

        return true
    })

    const getSectionTitle = () => {
        if (selectedCategory === 'all') {
            return 'Featured Templates'
        }
        const category = categories.find(c => c.id === selectedCategory)
        return category ? category.name : 'Featured Templates'
    }

    const onUseTemplate = (selectedTool) => {
        const dialogProp = {
            title: 'Add New Tool',
            type: 'IMPORT',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add',
            data: selectedTool
        }
        setToolDialogProps(dialogProp)
        setShowDialog(true)
    }

    const goToTool = (selectedTool) => {
        const dialogProp = {
            title: selectedTool.templateName,
            type: 'TEMPLATE',
            data: selectedTool
        }
        setToolDialogProps(dialogProp)
        setShowDialog(true)
    }

    const goToCanvas = (selectedChatflow) => {
        navigate(`/marketplace/${selectedChatflow.id}`, { state: selectedChatflow })
    }

    useEffect(() => {
        getAllTemplatesMarketplacesApi.request()
    }, [])

    useEffect(() => {
        setLoading(getAllTemplatesMarketplacesApi.loading)
    }, [getAllTemplatesMarketplacesApi.loading])

    useEffect(() => {
        if (getAllTemplatesMarketplacesApi.data) {
            try {
                const flows = getAllTemplatesMarketplacesApi.data
                const images = {}
                for (let i = 0; i < flows.length; i += 1) {
                    if (flows[i].flowData) {
                        const flowDataStr = flows[i].flowData
                        const flowData = JSON.parse(flowDataStr)
                        const nodes = flowData.nodes || []
                        images[flows[i].id] = []
                        for (let j = 0; j < nodes.length; j += 1) {
                            const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                            if (!images[flows[i].id].includes(imageSrc)) {
                                images[flows[i].id].push(imageSrc)
                            }
                        }
                    }
                }
                setImages(images)
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllTemplatesMarketplacesApi.data])

    useEffect(() => {
        if (getAllTemplatesMarketplacesApi.error) {
            setError(getAllTemplatesMarketplacesApi.error)
        }
    }, [getAllTemplatesMarketplacesApi.error])

    if (error) return <ErrorBoundary error={error} />

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${brandColor} 0%, ${alpha(brandColor, 0.8)} 100%)`,
                    pt: 12,
                    pb: 24,
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: { xs: '0 0 24px 24px', md: '0 0 48px 48px' },
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle at top left, rgba(255,255,255,0.2) 0%, transparent 50%)',
                        mixBlendMode: 'overlay'
                    },
                    '&:after': {
                        content: '""',
                        position: 'absolute',
                        top: '20%',
                        right: '10%',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        mixBlendMode: 'overlay'
                    }
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={8} sx={{ position: 'relative', zIndex: 1 }}>
                        <Stack spacing={2} alignItems="center" textAlign="center">
                            <Typography 
                                variant="h1" 
                                sx={{ 
                                    color: '#fff',
                                    fontWeight: 700,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    letterSpacing: '-0.02em',
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    background: 'linear-gradient(to right bottom, #fff 30%, rgba(255, 255, 255, 0.8))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    borderRadius: '16px'
                                }}
                            >
                                Discover AI Templates
                            </Typography>
                            <Typography 
                                sx={{ 
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: { xs: '1rem', md: '1.25rem' },
                                    maxWidth: '600px',
                                    lineHeight: 1.6
                                }}
                            >
                                Explore our collection of ready-to-use AI templates and tools
                            </Typography>
                        </Stack>

                        <Stack spacing={4} alignItems="center">
                            <Box
                                sx={{
                                    position: 'relative',
                                    maxWidth: 600,
                                    width: '100%'
                                }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: '2px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        height: 56,
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '16px',
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                                        }
                                    }}
                                >
                                    <IconButton sx={{ p: '10px', color: 'rgba(255, 255, 255, 0.6)', ml: 1 }}>
                                        <IconSearch size={24} />
                                    </IconButton>
                                    <InputBase
                                        sx={{
                                            ml: 1,
                                            flex: 1,
                                            color: '#fff',
                                            fontSize: '1rem',
                                            textAlign: 'center',
                                            '& input': {
                                                textAlign: 'center',
                                                '&::placeholder': {
                                                    color: 'rgba(255, 255, 255, 0.6)',
                                                    opacity: 1
                                                }
                                            }
                                        }}
                                        placeholder="Search templates..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <Box sx={{ width: 44 }} /> {/* Spacer to center text */}
                                </Paper>
                            </Box>

                            <Box 
                                sx={{ 
                                    width: '100%',
                                    overflowX: 'auto',
                                    pt: 2, // Increased top padding
                                    pb: 1,
                                    px: 2,
                                    mt: -1, // Negative margin to prevent content shift
                                    '&::-webkit-scrollbar': {
                                        height: 4
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        borderRadius: 2
                                    }
                                }}
                            >
                                <Stack 
                                    direction="row" 
                                    spacing={1}
                                    justifyContent="center"
                                >
                                    {categories.map((category) => (
                                        <FilterChip
                                            key={category.id}
                                            label={category.name}
                                            selected={selectedCategory === category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* Content Section */}
            <Container 
                maxWidth="lg" 
                sx={{ 
                    mt: -16, 
                    pb: 8,
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <Stack spacing={8}>
                    {/* Featured/Filtered Section */}
                    {(selectedCategory === 'all' ? featuredTemplates : filteredTemplates).length > 0 && (
                        <Stack spacing={4}>
                            <Stack 
                                direction="row" 
                                alignItems="center" 
                                spacing={2}
                                sx={{
                                    position: 'relative',
                                    '&:before': {
                                        content: '""',
                                        position: 'absolute',
                                        left: -16,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: 4,
                                        height: '60%',
                                        background: `linear-gradient(to bottom, ${brandColor}, ${alpha(brandColor, 0.4)})`,
                                        borderRadius: 8
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: `linear-gradient(135deg, ${brandColor} 0%, ${alpha(brandColor, 0.8)} 100%)`,
                                        boxShadow: `0 8px 16px ${alpha(brandColor, 0.2)}`,
                                        position: 'relative',
                                        '&:before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: -1,
                                            background: `linear-gradient(45deg, ${alpha(brandColor, 0.5)}, transparent)`,
                                            borderRadius: 'inherit',
                                            zIndex: -1
                                        }
                                    }}
                                >
                                    <IconStarsFilled size={28} style={{ color: '#fff' }} />
                                </Box>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 700, 
                                        color: 'rgb(30, 41, 59)',
                                        position: 'relative',
                                        '&:after': {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            bottom: -4,
                                            width: '40%',
                                            height: 2,
                                            background: `linear-gradient(to right, ${brandColor}, transparent)`,
                                            borderRadius: 1
                                        }
                                    }}
                                >
                                    {getSectionTitle()}
                                </Typography>
                            </Stack>
                            <Grid 
                                container 
                                spacing={3}
                                sx={{
                                    width: '100%',
                                    margin: '0 !important',
                                    '& .MuiGrid-item': {
                                        paddingTop: '24px !important',
                                        width: { xs: '100%', sm: '50%', md: '33.333%' }
                                    }
                                }}
                            >
                                {(selectedCategory === 'all' ? featuredTemplates : filteredTemplates).map((template, index) => (
                                    <Grid item key={index}>
                                        <FeaturedCard
                                            template={template}
                                            images={images[template.id]}
                                            onClick={() => 
                                                template.type === 'Tool' 
                                                    ? goToTool(template) 
                                                    : goToCanvas(template)
                                            }
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    )}

                    {/* All Templates Section - Only show when "All Templates" is selected */}
                    {selectedCategory === 'all' && (
                        <Stack spacing={4}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'rgb(30, 41, 59)' }}>
                                All Templates
                            </Typography>
                            {isLoading ? (
                                <Grid 
                                    container 
                                    spacing={3}
                                    sx={{
                                        width: '100%',
                                        margin: '0 !important',
                                        '& .MuiGrid-item': {
                                            paddingTop: '24px !important',
                                            width: { xs: '100%', sm: '50%', md: '33.333%' }
                                        }
                                    }}
                                >
                                    {[1, 2, 3, 4, 5, 6].map((index) => (
                                        <Grid item key={index}>
                                            <Skeleton 
                                                variant="rounded" 
                                                height={320}
                                                sx={{
                                                    borderRadius: 4,
                                                    transform: 'scale(1)',
                                                    transformOrigin: '0 0',
                                                    width: '100%'
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <>
                                    {filteredTemplates.length > 0 ? (
                                        <Grid 
                                            container 
                                            spacing={3}
                                            sx={{
                                                width: '100%',
                                                margin: '0 !important',
                                                '& .MuiGrid-item': {
                                                    paddingTop: '24px !important',
                                                    width: { xs: '100%', sm: '50%', md: '33.333%' }
                                                }
                                            }}
                                        >
                                            {filteredTemplates.map((template, index) => (
                                                <Grid item key={index}>
                                                    <FeaturedCard
                                                        template={template}
                                                        images={images[template.id]}
                                                        onClick={() => 
                                                            template.type === 'Tool' 
                                                                ? goToTool(template) 
                                                                : goToCanvas(template)
                                                        }
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Stack 
                                            alignItems="center" 
                                            spacing={3} 
                                            sx={{ 
                                                py: 12,
                                                px: 3,
                                                textAlign: 'center',
                                                backgroundColor: '#fff',
                                                borderRadius: 4,
                                                border: `1px dashed ${alpha(brandColor, 0.2)}`
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: `linear-gradient(135deg, ${alpha(brandColor, 0.1)} 0%, ${alpha(brandColor, 0.05)} 100%)`,
                                                    border: `1px solid ${alpha(brandColor, 0.1)}`
                                                }}
                                            >
                                                <IconSearch size={32} style={{ color: brandColor }} />
                                            </Box>
                                            <Stack spacing={1}>
                                                <Typography variant="h5" sx={{ color: 'rgb(30, 41, 59)', fontWeight: 600 }}>
                                                    No templates found
                                                </Typography>
                                                <Typography sx={{ color: 'rgb(71, 85, 105)' }}>
                                                    Try adjusting your search or filter to find what you're looking for.
                                                </Typography>
                                            </Stack>
                                            <Button
                                                variant="outlined"
                                                onClick={() => {
                                                    setSearch('')
                                                    setSelectedCategory('all')
                                                }}
                                                sx={{
                                                    mt: 2,
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    borderColor: brandColor,
                                                    color: brandColor,
                                                    '&:hover': {
                                                        borderColor: brandColor,
                                                        backgroundColor: alpha(brandColor, 0.05)
                                                    }
                                                }}
                                            >
                                                Clear filters
                                            </Button>
                                        </Stack>
                                    )}
                                </>
                            )}
                        </Stack>
                    )}
                </Stack>
            </Container>

            <ToolDialog
                show={showDialog}
                dialogProps={toolDialogProps}
                onCancel={() => setShowDialog(false)}
                onConfirm={() => setShowDialog(false)}
                onUseTemplate={(tool) => onUseTemplate(tool)}
            />
            <ConfirmDialog />
        </Box>
    )
}

export default Marketplace
