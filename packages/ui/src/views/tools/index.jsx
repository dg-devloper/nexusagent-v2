import { useEffect, useState, useRef, useCallback } from 'react'

// material-ui
import { Box, Stack, ButtonGroup, Typography, alpha, Chip, Tooltip, Grid, InputBase, InputAdornment } from '@mui/material'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import ItemCard from '@/ui-component/cards/ItemCard'
import { gridSpacing } from '@/store/constant'
import { StyledButton } from '@/ui-component/button/StyledButton'
import ToolDialog from './ToolDialog'
import { ToolsTable } from '@/ui-component/table/ToolsListTable'

// API
import toolsApi from '@/api/tools'

// Hooks
import useApi from '@/hooks/useApi'

// icons
import { IconPlus, IconFileUpload, IconLayoutGrid, IconLayoutList, IconPlugConnected, IconCode, IconApi, IconBrandJavascript, IconInfoCircle, IconSearch } from '@tabler/icons-react'
import ErrorBoundary from '@/ErrorBoundary'
import AppIcon from '@/menu-items/icon'

const brandColor = '#2b63d9'
const buttonBlue = '#5379e0'

// ==============================|| TOOLS ||============================== //

const Tools = () => {
    const getAllToolsApi = useApi(toolsApi.getAllTools)

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [view, setView] = useState(localStorage.getItem('toolsDisplayStyle') || 'list')
    const [search, setSearch] = useState('')
    const [filteredData, setFilteredData] = useState([])

    const inputRef = useRef(null)
    const searchInputRef = useRef(null)

    const handleChange = useCallback((nextView) => {
        if (nextView === null) return
        localStorage.setItem('toolsDisplayStyle', nextView)
        setView(nextView)
    }, [])

    const onUploadFile = useCallback((file) => {
        try {
            const dialogProp = {
                title: 'Add New Tool',
                type: 'IMPORT',
                cancelButtonName: 'Cancel',
                confirmButtonName: 'Save',
                data: JSON.parse(file)
            }
            setDialogProps(dialogProp)
            setShowDialog(true)
        } catch (e) {
            console.error(e)
        }
    }, [])

    const handleFileUpload = useCallback((e) => {
        if (!e.target.files) return

        const file = e.target.files[0]

        const reader = new FileReader()
        reader.onload = (evt) => {
            if (!evt?.target?.result) {
                return
            }
            const { result } = evt.target
            onUploadFile(result)
        }
        reader.readAsText(file)
    }, [onUploadFile])

    const addNew = useCallback(() => {
        const dialogProp = {
            title: 'Add New Tool',
            type: 'ADD',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add'
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }, [])

    const edit = useCallback((selectedTool) => {
        const dialogProp = {
            title: 'Edit Tool',
            type: 'EDIT',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Save',
            data: selectedTool
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }, [])

    const onConfirm = useCallback(() => {
        setShowDialog(false)
        getAllToolsApi.request()
    }, [getAllToolsApi])

    const onSearchChange = useCallback((event) => {
        setSearch(event.target.value)
    }, [])

    function filterTools(data) {
        return (
            data.name.toLowerCase().indexOf(search.toLowerCase()) > -1 || data.description.toLowerCase().indexOf(search.toLowerCase()) > -1
        )
    }

    useEffect(() => {
        getAllToolsApi.request()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllToolsApi.loading)
    }, [getAllToolsApi.loading])

    useEffect(() => {
        if (getAllToolsApi.error) {
            setError(getAllToolsApi.error)
        }
    }, [getAllToolsApi.error])

    useEffect(() => {
        if (getAllToolsApi.data) {
            setFilteredData(getAllToolsApi.data.filter(filterTools))
        }
    }, [getAllToolsApi.data, search])

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
                                <IconPlugConnected stroke={2} size='1.5rem' style={{ color: '#fff' }} />
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
                                    Custom Tools
                                </Typography>
                                <Typography 
                                    sx={{ 
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '1rem',
                                        lineHeight: 1.6
                                    }}
                                >
                                    Create and manage custom tools to extend your AI capabilities
                                </Typography>
                            </Stack>
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                            <Chip 
                                icon={<IconCode size={16} />} 
                                label="JavaScript Functions" 
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
                                icon={<IconApi size={16} />} 
                                label="API Integration" 
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
                                icon={<IconBrandJavascript size={16} />} 
                                label="Custom Logic" 
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
                                        What are Custom Tools?
                                    </Typography>
                                </Stack>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                                    Custom Tools allow you to extend your AI capabilities by creating JavaScript functions that can:
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
                                            Connect to external APIs and services
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
                                            Perform custom calculations and data processing
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
                                            Integrate with your existing systems and databases
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
                            placeholder="Search name or description..."
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
                            onClick={() => inputRef.current.click()}
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
                                <IconFileUpload size={20} />
                                <Typography>Load</Typography>
                            </Box>
                        </StyledButton>
                        <input
                            style={{ display: 'none' }}
                            ref={inputRef}
                            type='file'
                            hidden
                            accept='.json'
                            onChange={(e) => handleFileUpload(e)}
                        />
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

    return (
        <>
            <MainCard>
                {error ? (
                    <ErrorBoundary error={error} />
                ) : (
                    <Stack flexDirection='column' sx={{ gap: 3 }}>
                        <CustomHeader />
                        {!view || view === 'card' ? (
                            <>
                                {isLoading ? (
                                    <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                        {[1, 2, 3].map((index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    height: 160,
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
                                    </Box>
                                ) : (
                                    <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                        {filteredData.map((data, index) => (
                                            <ItemCard data={data} key={index} onClick={() => edit(data)} />
                                        ))}
                                    </Box>
                                )}
                            </>
                        ) : (
                            <ToolsTable data={filteredData} isLoading={isLoading} onSelect={edit} />
                        )}
                        {!isLoading && (!filteredData || filteredData.length === 0) && (
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
                                    No tools yet. Create your first tool to get started!
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
                                    Create Tool
                                </StyledButton>
                            </Stack>
                        )}
                    </Stack>
                )}
            </MainCard>
            <ToolDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
                onConfirm={onConfirm}
                setError={setError}
            />
        </>
    )
}

export default Tools
