import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { cloneDeep } from 'lodash'
import {
    Button,
    Box,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    Checkbox,
    FormControlLabel,
    DialogActions,
    Stack,
    alpha
} from '@mui/material'
import { styled } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { TableViewOnly } from '@/ui-component/table/Table'
import { v4 as uuidv4 } from 'uuid'

// const
import { baseURL } from '@/store/constant'
import nodesApi from '@/api/nodes'

// Icons
import { IconTrash, IconAlertTriangle } from '@tabler/icons-react'

// Hooks
import useApi from '@/hooks/useApi'
import { initNode } from '@/utils/genericHelper'

const brandColor = '#2b63d9'
const errorColor = '#d32f2f'

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: 16,
        boxShadow: `0 10px 40px ${alpha(errorColor, 0.2)}`,
        overflow: 'hidden'
    }
}))

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    background: `linear-gradient(135deg, ${errorColor} 0%, ${alpha(errorColor, 0.8)} 100%)`,
    color: 'white',
    padding: '16px 24px',
    fontSize: '1.25rem',
    fontWeight: 600,
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, ${alpha('#fff', 0.2)} 0%, transparent 100%)`
    }
}))

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    borderRadius: 8,
    boxShadow: `0 4px 12px ${alpha(brandColor, 0.1)}`,
    '&:before': {
        display: 'none'
    },
    '&.Mui-expanded': {
        margin: theme.spacing(1, 0)
    }
}))

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    borderRadius: 8,
    '&.Mui-expanded': {
        minHeight: 48,
        borderBottom: `1px solid ${alpha(brandColor, 0.1)}`
    }
}))

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    color: alpha(brandColor, 0.6),
    '&.Mui-checked': {
        color: brandColor
    }
}))

const DeleteDocStoreDialog = ({ show, dialogProps, onCancel, onDelete }) => {
    const portalElement = document.getElementById('portal')
    const [nodeConfigExpanded, setNodeConfigExpanded] = useState({})
    const [removeFromVS, setRemoveFromVS] = useState(false)
    const [vsFlowData, setVSFlowData] = useState([])
    const [rmFlowData, setRMFlowData] = useState([])

    const getSpecificNodeApi = useApi(nodesApi.getSpecificNode)

    const handleAccordionChange = (nodeName) => (event, isExpanded) => {
        const accordianNodes = { ...nodeConfigExpanded }
        accordianNodes[nodeName] = isExpanded
        setNodeConfigExpanded(accordianNodes)
    }

    useEffect(() => {
        if (dialogProps.recordManagerConfig) {
            const nodeName = dialogProps.recordManagerConfig.name
            if (nodeName) getSpecificNodeApi.request(nodeName)

            if (dialogProps.vectorStoreConfig) {
                const nodeName = dialogProps.vectorStoreConfig.name
                if (nodeName) getSpecificNodeApi.request(nodeName)
            }
        }

        return () => {
            setNodeConfigExpanded({})
            setRemoveFromVS(false)
            setVSFlowData([])
            setRMFlowData([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dialogProps])

    useEffect(() => {
        if (getSpecificNodeApi.data) {
            const nodeData = cloneDeep(initNode(getSpecificNodeApi.data, uuidv4()))

            let config = 'vectorStoreConfig'
            if (nodeData.category === 'Record Manager') config = 'recordManagerConfig'

            const paramValues = []

            for (const inputName in dialogProps[config].config) {
                const inputParam = nodeData.inputParams.find((inp) => inp.name === inputName)

                if (!inputParam) continue

                if (inputParam.type === 'credential') continue

                let paramValue = {}

                const inputValue = dialogProps[config].config[inputName]

                if (!inputValue) continue

                if (typeof inputValue === 'string' && inputValue.startsWith('{{') && inputValue.endsWith('}}')) {
                    continue
                }

                paramValue = {
                    label: inputParam?.label,
                    name: inputParam?.name,
                    type: inputParam?.type,
                    value: inputValue
                }
                paramValues.push(paramValue)
            }

            if (config === 'vectorStoreConfig') {
                setVSFlowData([
                    {
                        label: nodeData.label,
                        name: nodeData.name,
                        category: nodeData.category,
                        id: nodeData.id,
                        paramValues
                    }
                ])
            } else if (config === 'recordManagerConfig') {
                setRMFlowData([
                    {
                        label: nodeData.label,
                        name: nodeData.name,
                        category: nodeData.category,
                        id: nodeData.id,
                        paramValues
                    }
                ])
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificNodeApi.data])

    const component = show ? (
        <StyledDialog
            fullWidth
            maxWidth={dialogProps.recordManagerConfig ? 'md' : 'sm'}
            open={show}
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <StyledDialogTitle id='alert-dialog-title'>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        <IconTrash size={20} style={{ color: '#fff' }} />
                    </Box>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                        {dialogProps.title}
                    </Typography>
                </Stack>
            </StyledDialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '75vh', position: 'relative', p: 3 }}>
                <Box 
                    sx={{ 
                        mt: 1, 
                        p: 2, 
                        borderRadius: 2, 
                        backgroundColor: alpha(errorColor, 0.05),
                        border: `1px solid ${alpha(errorColor, 0.1)}`,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5
                    }}
                >
                    <IconAlertTriangle size={20} style={{ color: errorColor, marginTop: 2 }} />
                    <Typography variant="body2" sx={{ color: alpha(errorColor, 0.9) }}>
                        {dialogProps.description}
                    </Typography>
                </Box>
                
                {dialogProps.type === 'STORE' && dialogProps.recordManagerConfig && (
                    <FormControlLabel
                        control={<StyledCheckbox checked={removeFromVS} onChange={(event) => setRemoveFromVS(event.target.checked)} />}
                        label={
                            <Typography sx={{ fontWeight: 500 }}>
                                Remove data from vector store
                            </Typography>
                        }
                        sx={{ mt: 1 }}
                    />
                )}
                {removeFromVS && (
                    <Box sx={{ mt: 1 }}>
                        <TableContainer 
                            component={Paper} 
                            sx={{ 
                                borderRadius: 2,
                                boxShadow: `0 4px 20px ${alpha(brandColor, 0.1)}`
                            }}
                        >
                            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                                <TableBody>
                                    <TableRow sx={{ '& td': { border: 0 } }}>
                                        <TableCell sx={{ pb: 0, pt: 0 }} colSpan={6}>
                                            <Box>
                                                {([...vsFlowData, ...rmFlowData] || []).map((node, index) => {
                                                    return (
                                                        <StyledAccordion
                                                            expanded={nodeConfigExpanded[node.name] || true}
                                                            onChange={handleAccordionChange(node.name)}
                                                            key={index}
                                                            disableGutters
                                                        >
                                                            <StyledAccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls={`nodes-accordian-${node.name}`}
                                                                id={`nodes-accordian-header-${node.name}`}
                                                            >
                                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                                    <Box
                                                                        sx={{
                                                                            width: 40,
                                                                            height: 40,
                                                                            borderRadius: '12px',
                                                                            backgroundColor: 'white',
                                                                            display: 'flex',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            boxShadow: `0 4px 12px ${alpha(brandColor, 0.1)}`,
                                                                            border: `1px solid ${alpha(brandColor, 0.1)}`
                                                                        }}
                                                                    >
                                                                        <img
                                                                            style={{
                                                                                width: '70%',
                                                                                height: '70%',
                                                                                objectFit: 'contain'
                                                                            }}
                                                                            alt={node.name}
                                                                            src={`${baseURL}/api/v1/node-icon/${node.name}`}
                                                                        />
                                                                    </Box>
                                                                    <Typography variant='h5' sx={{ fontWeight: 600 }}>
                                                                        {node.label}
                                                                    </Typography>
                                                                </Stack>
                                                            </StyledAccordionSummary>
                                                            <AccordionDetails>
                                                                {node.paramValues[0] && (
                                                                    <TableViewOnly
                                                                        sx={{ minWidth: 150 }}
                                                                        rows={node.paramValues}
                                                                        columns={Object.keys(node.paramValues[0])}
                                                                    />
                                                                )}
                                                            </AccordionDetails>
                                                        </StyledAccordion>
                                                    )
                                                })}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Typography 
                            sx={{ 
                                mt: 2, 
                                fontStyle: 'italic', 
                                color: alpha(errorColor, 0.8),
                                fontSize: '0.875rem'
                            }}
                        >
                            * Only data that were upserted with Record Manager will be deleted from vector store
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${alpha('#000', 0.05)}` }}>
                <Button 
                    onClick={onCancel} 
                    sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        color: alpha(brandColor, 0.8)
                    }}
                >
                    Cancel
                </Button>
                <Button 
                    variant='contained' 
                    onClick={() => onDelete(dialogProps.type, dialogProps.file, removeFromVS)} 
                    color='error'
                    sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        boxShadow: `0 4px 12px ${alpha(errorColor, 0.3)}`
                    }}
                >
                    Delete
                </Button>
            </DialogActions>
        </StyledDialog>
    ) : null

    return createPortal(component, portalElement)
}

DeleteDocStoreDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onDelete: PropTypes.func
}

export default DeleteDocStoreDialog
