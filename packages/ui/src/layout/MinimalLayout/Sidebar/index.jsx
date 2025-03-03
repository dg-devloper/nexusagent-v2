import PropTypes from 'prop-types'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// material-ui
import { useTheme } from '@mui/material/styles'
import {
    Box,
    Divider,
    Drawer,
    ListItemText,
    useMediaQuery,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    ClickAwayListener,
    InputAdornment,
    List,
    ListItemButton,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    OutlinedInput,
    Paper,
    Typography,
    Chip,
    Tab,
    Tabs
} from '@mui/material'

// project imports
import { drawerCanvasWidth } from '@/store/constant'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CategoryIcon from './CategoryIcon'
import NodeItem from './NodeItem'
import { SidebarContainer } from './style'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'

// project imports
import MainCard from '@/ui-component/cards/MainCard'

// icons
import { IconSearch, IconX } from '@tabler/icons-react'
import LlamaindexPNG from '@/assets/images/llamaindex.png'
import LangChainPNG from '@/assets/images/langchain.png'
import utilNodesPNG from '@/assets/images/utilNodes.png'

// const
import { baseURL } from '@/store/constant'
import { SET_COMPONENT_NODES } from '@/store/actions'
import LogoSection from '@/layout/MainLayout/LogoSection'

// Priority order for categories
const categoryOrder = [
    'Chat Models',
    'Prompts',
    'Memory',
    'Chains',
    'Agents',
    'Tools',
    'Document Loaders',
    'Text Splitters',
    'Vector Stores',
    'Embeddings',
    'Output Parsers',
    'Speech To Text',
    'Response Synthesizer',
    'Analytics',
    'Utilities'
]

function a11yProps(index) {
    return {
        id: `attachment-tab-${index}`,
        'aria-controls': `attachment-tabpanel-${index}`
    }
}

const Sidebar = ({ drawerOpen, drawerToggle, window, nodesData, node, isAgentCanvas }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === 'dark'
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))
    const container = window !== undefined ? () => window.document.body : undefined

    const customization = useSelector((state) => state.customization)
    const dispatch = useDispatch()

    const [searchValue, setSearchValue] = useState('')
    const [nodes, setNodes] = useState({})
    const [open, setOpen] = useState(false)
    const [categoryExpanded, setCategoryExpanded] = useState({})
    const [tabValue, setTabValue] = useState(0)

    const anchorRef = useRef(null)
    const prevOpen = useRef(open)
    const ps = useRef()

    const scrollTop = () => {
        const curr = ps.current
        if (curr) {
            curr.scrollTop = 0
        }
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
        filterSearch(searchValue, newValue)
    }

    const filterSearch = (value, newTabValue) => {
        setSearchValue(value)
        setTimeout(() => {
            if (value) {
                const returnData = getSearchedNodes(value)
                groupByCategory(returnData, newTabValue ?? tabValue, true)
                scrollTop()
            } else if (value === '') {
                groupByCategory(nodesData, newTabValue ?? tabValue)
                scrollTop()
            }
        }, 500)
    }

    const getSearchedNodes = (value) => {
        if (!nodesData) return []
        
        return nodesData.filter((nd) => {
            const passesName = nd.name.toLowerCase().includes(value.toLowerCase())
            const passesLabel = nd.label.toLowerCase().includes(value.toLowerCase())
            const passesCategory = nd.category.toLowerCase().includes(value.toLowerCase())
            return passesName || passesCategory || passesLabel
        })
    }

    const groupByCategory = (nodes, newTabValue, isFilter) => {
        if (!nodes) return

        const taggedNodes = groupByTags(nodes, newTabValue)
        const accordianCategories = {}
        const result = taggedNodes.reduce((r, node) => {
            r[node.category] = r[node.category] || []
            r[node.category].push(node)
            accordianCategories[node.category] = isFilter ? true : false
            return r
        }, {})

        setNodes(result)
        setCategoryExpanded(accordianCategories)
    }

    const groupByTags = (nodes, newTabValue = 0) => {
        const langchainNodes = nodes.filter((nd) => !nd.tags)
        const llmaindexNodes = nodes.filter((nd) => nd.tags && nd.tags.includes('LlamaIndex'))
        const utilitiesNodes = nodes.filter((nd) => nd.tags && nd.tags.includes('Utilities'))
        if (newTabValue === 0) {
            return langchainNodes
        } else if (newTabValue === 1) {
            return llmaindexNodes
        } else {
            return utilitiesNodes
        }
    }

    const handleAccordionChange = (category) => (event, isExpanded) => {
        const accordianCategories = { ...categoryExpanded }
        accordianCategories[category] = isExpanded
        setCategoryExpanded(accordianCategories)
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
    }

    const onDragStart = (event, node) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(node))
        event.dataTransfer.effectAllowed = 'move'
    }

    const getImage = (tabValue) => {
        if (tabValue === 0) {
            return LangChainPNG
        } else if (tabValue === 1) {
            return LlamaindexPNG
        } else {
            return utilNodesPNG
        }
    }

    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus()
        }
        prevOpen.current = open
    }, [open])

    useEffect(() => {
        if (node) setOpen(false)
    }, [node])

    useEffect(() => {
        if (nodesData) {
            groupByCategory(nodesData)
            dispatch({ type: SET_COMPONENT_NODES, componentNodes: nodesData })
        }
    }, [nodesData, dispatch])

    const sortedCategories = Object.keys(nodes).sort((a, b) => {
        const aIndex = categoryOrder.indexOf(a)
        const bIndex = categoryOrder.indexOf(b)
        if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return aIndex - bIndex
    })

    return (
        <Box
            component='nav'
            sx={{
                flexShrink: { md: 0 },
                width: matchUpMd ? drawerCanvasWidth : 'auto'
            }}
        >
            <Drawer
                container={container}
                variant={matchUpMd ? 'persistent' : 'temporary'}
                anchor='left'
                open={drawerOpen}
                onClose={drawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerCanvasWidth,
                        border: 'none',
                        top: '56px',
                        height: 'calc(100% - 56px)'
                    }
                }}
                ModalProps={{ keepMounted: true }}
            >
                <SidebarContainer>
                    <Box sx={{ p: 2, flexShrink: 0 }}>

                        <OutlinedInput
                            autoFocus
                            size='small'
                            sx={{
                                width: '100%',
                                pr: 2,
                                pl: 2,
                                my: 2,
                                backgroundColor: '#fff'
                            }}
                            id='input-search-node'
                            value={searchValue}
                            onChange={(e) => filterSearch(e.target.value)}
                            placeholder='Search tools'
                            startAdornment={
                                <InputAdornment position='start'>
                                    <IconSearch stroke={1.5} size='1rem' color={theme.palette.text.secondary} />
                                </InputAdornment>
                            }
                            endAdornment={
                                searchValue && (
                                    <InputAdornment
                                        position='end'
                                        sx={{
                                            cursor: 'pointer',
                                            color: theme.palette.text.secondary,
                                            '&:hover': {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                        title='Clear Search'
                                    >
                                        <IconX
                                            stroke={1.5}
                                            size='1rem'
                                            onClick={() => filterSearch('')}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </InputAdornment>
                                )
                            }
                        />

                        {!isAgentCanvas && (
                            <Tabs
                                sx={{
                                    minHeight: '50px',
                                    height: '50px',
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: theme.palette.primary.main
                                    },
                                    '& .Mui-selected': {
                                        color: theme.palette.primary.main
                                    },
                                    '& .MuiTab-root': {
                                        color: theme.palette.text.secondary,
                                        '&:hover': {
                                            color: theme.palette.text.primary
                                        }
                                    }
                                }}
                                variant='fullWidth'
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label='tabs'
                            >
                                {['LangChain', 'LlamaIndex', 'Utilities'].map((item, index) => (
                                    <Tab
                                        icon={
                                            <div style={{ borderRadius: '50%' }}>
                                                <img
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        borderRadius: '50%',
                                                        objectFit: 'contain'
                                                    }}
                                                    src={getImage(index)}
                                                    alt={item}
                                                />
                                            </div>
                                        }
                                        iconPosition='start'
                                        sx={{
                                            minHeight: '50px',
                                            height: '50px'
                                        }}
                                        key={index}
                                        label={item}
                                        {...a11yProps(index)}
                                    />
                                ))}
                            </Tabs>
                        )}
                        <Divider sx={{ my: 1 }} />
                    </Box>

                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <PerfectScrollbar>
                            <List sx={{ p: 2 }}>
                                {sortedCategories.map((category) => (
                                    <Accordion
                                        expanded={categoryExpanded[category] || false}
                                        onChange={handleAccordionChange(category)}
                                        key={category}
                                        disableGutters
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                <ExpandMoreIcon
                                                    sx={{
                                                        color: theme.palette.text.secondary
                                                    }}
                                                />
                                            }
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                                                    <CategoryIcon category={category} />
                                                </ListItemIcon>
                                                <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
                                                    {category}
                                                </Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ p: 0 }}>
                                            {nodes[category].map((node) => (
                                                <NodeItem
                                                    key={node.name}
                                                    node={node}
                                                    onDragStart={onDragStart}
                                                />
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </List>
                        </PerfectScrollbar>
                    </Box>
                </SidebarContainer>
            </Drawer>
        </Box>
    )
}

Sidebar.propTypes = {
    drawerOpen: PropTypes.bool,
    drawerToggle: PropTypes.func,
    window: PropTypes.object,
    nodesData: PropTypes.array,
    node: PropTypes.object,
    isAgentCanvas: PropTypes.bool
}

export default Sidebar
