import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// material-ui
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, alpha, ButtonGroup, Chip, Grid, InputBase, InputAdornment } from '@mui/material'
import { useTheme, styled } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import DocumentStoreCard from '@/ui-component/cards/DocumentStoreCard'
import { StyledButton } from '@/ui-component/button/StyledButton'
import AddDocStoreDialog from '@/views/docstore/AddDocStoreDialog'
import ErrorBoundary from '@/ErrorBoundary'
import DocumentStoreStatus from '@/views/docstore/DocumentStoreStatus'
import HeaderSection from '@/layout/MainLayout/HeaderSection'
import AppIcon from '@/menu-items/icon'

// API
import useApi from '@/hooks/useApi'
import documentsApi from '@/api/documentstore'

// icons
import { IconPlus, IconFiles, IconDatabase, IconSearch, IconLayoutGrid, IconLayoutList, IconFileText, IconInfoCircle } from '@tabler/icons-react'

const brandColor = '#2b63d9'
const buttonBlue = '#5379e0'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: `1px solid ${alpha(brandColor, 0.1)}`,
    padding: '20px 24px',
    [`&.${tableCellClasses.head}`]: {
        background: `linear-gradient(180deg, ${alpha(brandColor, 0.05)} 0%, ${alpha(brandColor, 0.02)} 100%)`,
        color: 'rgb(100, 116, 139)',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        height: 64
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '0.875rem',
        color: 'rgb(51, 65, 85)',
        height: 72
    }
}))

const StyledTableRow = styled(TableRow)(() => ({
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    '&:hover': {
        backgroundColor: alpha(brandColor, 0.02),
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 12px ${alpha(brandColor, 0.08)}`
    },
    '&:after': {
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '1px',
        background: `linear-gradient(90deg, ${alpha(brandColor, 0.1)} 0%, ${alpha(brandColor, 0.05)} 100%)`
    },
    '&:last-child:after': {
        display: 'none'
    }
}))

const Documents = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const navigate = useNavigate()
    const getAllDocumentStores = useApi(documentsApi.getAllDocumentStores)

    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [images, setImages] = useState({})
    const [search, setSearch] = useState('')
    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [docStores, setDocStores] = useState([])
    const [filteredDocStores, setFilteredDocStores] = useState([])
    const [view, setView] = useState(localStorage.getItem('docStoresDisplayStyle') || 'list')

    const searchInputRef = useRef(null)

    const handleChange = useCallback((nextView) => {
        if (nextView === null) return
        localStorage.setItem('docStoresDisplayStyle', nextView)
        setView(nextView)
    }, [])

    function filterDocStores(data) {
        return data.name.toLowerCase().indexOf(search.toLowerCase()) > -1
    }

    const onSearchChange = useCallback((event) => {
        setSearch(event.target.value)
    }, [])

    const goToDocumentStore = useCallback((id) => {
        navigate('/document-stores/' + id)
    }, [navigate])

    const addNew = useCallback(() => {
        const dialogProp = {
            title: 'Add New Document Store',
            type: 'ADD',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add'
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }, [])

    const onConfirm = useCallback(() => {
        setShowDialog(false)
        getAllDocumentStores.request()
    }, [getAllDocumentStores])

    useEffect(() => {
        getAllDocumentStores.request()
    }, [])

    useEffect(() => {
        if (getAllDocumentStores.data) {
            try {
                const docStores = getAllDocumentStores.data
                if (!Array.isArray(docStores)) return
                const loaderImages = {}

                for (let i = 0; i < docStores.length; i += 1) {
                    const loaders = docStores[i].loaders ?? []

                    let totalChunks = 0
                    let totalChars = 0
                    loaderImages[docStores[i].id] = []
                    for (let j = 0; j < loaders.length; j += 1) {
                        const imageSrc = `${baseURL}/api/v1/node-icon/${loaders[j].loaderId}`
                        if (!loaderImages[docStores[i].id].includes(imageSrc)) {
                            loaderImages[docStores[i].id].push(imageSrc)
                        }
                        totalChunks += loaders[j]?.totalChunks ?? 0
                        totalChars += loaders[j]?.totalChars ?? 0
                    }
                    docStores[i].totalDocs = loaders?.length ?? 0
                    docStores[i].totalChunks = totalChunks
                    docStores[i].totalChars = totalChars
                }
                setDocStores(docStores)
                setImages(loaderImages)
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllDocumentStores.data])

    useEffect(() => {
        if (docStores) {
            setFilteredDocStores(docStores.filter(filterDocStores))
        }
    }, [docStores, search])

    useEffect(() => {
        setLoading(getAllDocumentStores.loading)
    }, [getAllDocumentStores.loading])

    useEffect(() => {
        setError(getAllDocumentStores.error)
    }, [getAllDocumentStores.error])

    const CustomHeader = () => (
        <Box
            sx={{
                borderRadius: '24px',
                background: `linear-gradient(135deg, ${brandColor} 0%, ${alpha(brandColor, 0.8)} 100%)`,
                padding: '3rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 10px 40px -10px ${alpha(brandColor, 0.4)}`,
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle at top left, ${alpha('#fff', 0.12)} 0%, transparent 50%)`,
                    pointerEvents: 'none'
                },
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: '20%',
                    right: '10%',
                    width: '300px',
                    height: '300px',
                    background: `radial-gradient(circle, ${alpha('#fff', 0.08)} 0%, transparent 50%)`,
                    pointerEvents: 'none'
                }
            }}
        >
            <Stack spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <Stack direction="row" spacing={3} alignItems="center">
                            <Box
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(8px)',
                                    color: 'white',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    transform: 'rotate(-5deg)'
                                }}
                            >
                                <IconFiles stroke={2} size='1.5rem' style={{ color: '#fff' }} />
                            </Box>
                            <Stack spacing={1}>
                                <Typography 
                                    variant='h3' 
                                    sx={{ 
                                        color: '#fff',
                                        fontWeight: 700,
                                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        letterSpacing: '-0.02em'
                                    }}
                                >
                                    Document Stores
                                </Typography>
                                <Typography 
                                    sx={{ 
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '1rem',
                                        lineHeight: 1.6
                                    }}
                                >
                                    Manage your document libraries and vector stores
                                </Typography>
                            </Stack>
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                            <Chip 
                                icon={<IconFileText size={16} />} 
                                label="Document Loaders" 
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    color: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    '& .MuiChip-icon': {
                                        color: 'white'
                                    }
                                }}
                            />
                            <Chip 
                                icon={<IconDatabase size={16} />} 
                                label="Vector Stores" 
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    color: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    '& .MuiChip-icon': {
                                        color: 'white'
                                    }
                                }}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Box
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: '16px',
                                padding: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                height: '100%'
                            }}
                        >
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <IconInfoCircle size={20} style={{ color: 'white' }} />
                                    <Typography sx={{ color: 'white', fontWeight: 600 }}>
                                        What are Document Stores?
                                    </Typography>
                                </Stack>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                                    Document Stores allow you to manage your document libraries and vector stores for use in your AI applications:
                                </Typography>
                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box
                                            sx={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                backgroundColor: 'white'
                                            }}
                                        />
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                            Upload and process documents from various sources
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box
                                            sx={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                backgroundColor: 'white'
                                            }}
                                        />
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                            Create vector embeddings for semantic search
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box
                                            sx={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                backgroundColor: 'white'
                                            }}
                                        />
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                            Connect document stores to your AI workflows
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        display: 'flex',
                        gap: '1.5rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            width: '350px'
                        }}
                    >
                        <InputBase
                            inputRef={searchInputRef}
                            placeholder="Search document stores..."
                            onChange={onSearchChange}
                            sx={{
                                borderRadius: '16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                color: '#fff',
                                width: '100%',
                                height: '56px',
                                fontSize: '0.95rem',
                                transition: 'all 0.3s ease-in-out',
                                padding: '8px 16px 8px 16px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&.Mui-focused': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    opacity: 1
                                }
                            }}
                            startAdornment={
                                <InputAdornment position="start" sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }}>
                                    <IconSearch stroke={1.5} size='1.2rem' />
                                </InputAdornment>
                            }
                        />
                    </Box>

                    <Stack direction="row" spacing={2}>
                        <ButtonGroup 
                            variant="contained" 
                            sx={{ 
                                borderRadius: '16px', 
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        >
                            <StyledButton
                                onClick={() => handleChange('list')}
                                sx={{ 
                                    borderTopLeftRadius: '16px', 
                                    borderBottomLeftRadius: '16px',
                                    height: 40,
                                    minWidth: 40,
                                    padding: '0 8px',
                                    backgroundColor: view === 'list' ? buttonBlue : 'rgba(255, 255, 255, 0.15)',
                                    color: 'white',
                                    border: 'none',
                                    '&:hover': {
                                        backgroundColor: view === 'list' ? buttonBlue : 'rgba(255, 255, 255, 0.25)',
                                        border: 'none'
                                    }
                                }}
                            >
                                <IconLayoutList size={20} />
                            </StyledButton>
                            <StyledButton
                                onClick={() => handleChange('card')}
                                sx={{ 
                                    borderTopRightRadius: '16px', 
                                    borderBottomRightRadius: '16px',
                                    height: 40,
                                    minWidth: 40,
                                    padding: '0 8px',
                                    backgroundColor: view === 'card' ? buttonBlue : 'rgba(255, 255, 255, 0.15)',
                                    color: 'white',
                                    border: 'none',
                                    '&:hover': {
                                        backgroundColor: view === 'card' ? buttonBlue : 'rgba(255, 255, 255, 0.25)',
                                        border: 'none'
                                    }
                                }}
                            >
                                <IconLayoutGrid size={20} />
                            </StyledButton>
                        </ButtonGroup>
                        <StyledButton
                            onClick={addNew}
                            sx={{ 
                                borderRadius: '16px', 
                                height: 40,
                                padding: '0 20px',
                                backgroundColor: buttonBlue,
                                color: 'white',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    backgroundColor: alpha(buttonBlue, 0.9),
                                    border: 'none'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconPlus size={20} />
                                <Typography>Create</Typography>
                            </Box>
                        </StyledButton>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    )

    if (isLoading) {
        return (
            <MainCard>
                <Stack spacing={3}>
                    <Box
                        sx={{
                            height: 300,
                            borderRadius: 3,
                            background: `linear-gradient(90deg, ${alpha(brandColor, 0.04)} 0%, ${alpha(brandColor, 0.02)} 50%, ${alpha(brandColor, 0.04)} 100%)`,
                            backgroundSize: '200% 100%',
                            animation: 'pulse 2s ease-in-out infinite',
                            '@keyframes pulse': {
                                '0%': {
                                    backgroundPosition: '0% 0%'
                                },
                                '100%': {
                                    backgroundPosition: '-200% 0%'
                                }
                            }
                        }}
                    />
                    <Stack spacing={1.5}>
                        {[1, 2, 3].map((index) => (
                            <Box
                                key={index}
                                sx={{
                                    height: 72,
                                    borderRadius: 3,
                                    background: `linear-gradient(90deg, ${alpha(brandColor, 0.04)} 0%, ${alpha(brandColor, 0.02)} 50%, ${alpha(brandColor, 0.04)} 100%)`,
                                    backgroundSize: '200% 100%',
                                    animation: 'pulse 2s ease-in-out infinite',
                                    '@keyframes pulse': {
                                        '0%': {
                                            backgroundPosition: '0% 0%'
                                        },
                                        '100%': {
                                            backgroundPosition: '-200% 0%'
                                        }
                                    }
                                }}
                            />
                        ))}
                    </Stack>
                </Stack>
            </MainCard>
        )
    }

    return (
        <MainCard>
            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Stack flexDirection='column' sx={{ gap: 3 }}>
                    <CustomHeader />

                    {!view || view === 'card' ? (
                        <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={3}>
                            {filteredDocStores.map((data, index) => (
                                <DocumentStoreCard
                                    key={index}
                                    images={images[data.id]}
                                    data={data}
                                    onClick={() => goToDocumentStore(data.id)}
                                />
                            ))}
                        </Box>
                    ) : (
                        <TableContainer 
                            component={Paper} 
                            elevation={0}
                            sx={{ 
                                border: `1px solid ${alpha(brandColor, 0.1)}`,
                                borderRadius: 4,
                                overflow: 'hidden',
                                background: `linear-gradient(180deg, ${alpha(brandColor, 0.02)} 0%, transparent 100%)`,
                                boxShadow: `0 8px 32px -4px ${alpha(brandColor, 0.08)}`
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell width={60}>&nbsp;</StyledTableCell>
                                        <StyledTableCell>Name</StyledTableCell>
                                        <StyledTableCell>Description</StyledTableCell>
                                        <StyledTableCell>Connected Flows</StyledTableCell>
                                        <StyledTableCell>Total Characters</StyledTableCell>
                                        <StyledTableCell>Total Chunks</StyledTableCell>
                                        <StyledTableCell>Loader Types</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredDocStores.map((data, index) => (
                                        <StyledTableRow
                                            onClick={() => goToDocumentStore(data.id)}
                                            key={index}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <StyledTableCell align='center'>
                                                <DocumentStoreStatus isTableView={true} status={data.status} />
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Typography
                                                    sx={{
                                                        color: 'rgb(51, 65, 85)',
                                                        fontWeight: 600,
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {data.name}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Typography
                                                    sx={{
                                                        color: 'rgb(100, 116, 139)',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {data.description}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Typography sx={{ color: 'rgb(100, 116, 139)' }}>
                                                    {data.whereUsed?.length ?? 0}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Typography sx={{ color: 'rgb(100, 116, 139)' }}>
                                                    {data.totalChars?.toLocaleString()}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Typography sx={{ color: 'rgb(100, 116, 139)' }}>
                                                    {data.totalChunks?.toLocaleString()}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {images[data.id] && (
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        {images[data.id].slice(0, 5).map((img, index) => (
                                                            <Box
                                                                key={index}
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    padding: '6px',
                                                                    borderRadius: '12px',
                                                                    backgroundColor: alpha(brandColor, 0.05),
                                                                    border: `1px solid ${alpha(brandColor, 0.1)}`,
                                                                    transition: 'all 0.3s ease-in-out',
                                                                    '&:hover': {
                                                                        transform: 'translateY(-2px)',
                                                                        boxShadow: `0 6px 16px ${alpha(brandColor, 0.12)}`,
                                                                        backgroundColor: alpha(brandColor, 0.08)
                                                                    }
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
                                                        {images[data.id].length > 5 && (
                                                            <Typography
                                                                sx={{
                                                                    color: 'rgb(100, 116, 139)',
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                +{images[data.id].length - 5}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                )}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {!isLoading && (!filteredDocStores || filteredDocStores.length === 0) && (
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
                                variant="h5"
                                sx={{
                                    color: 'rgb(99, 115, 129)',
                                    textAlign: 'center',
                                    maxWidth: 300
                                }}
                            >
                                No document stores yet. Create your first document store to get started!
                            </Typography>
                            <StyledButton
                                variant="contained"
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
                                Create Document Store
                            </StyledButton>
                        </Stack>
                    )}
                </Stack>
            )}
            {showDialog && (
                <AddDocStoreDialog
                    dialogProps={dialogProps}
                    show={showDialog}
                    onCancel={() => setShowDialog(false)}
                    onConfirm={onConfirm}
                />
            )}
        </MainCard>
    )
}

export default Documents
