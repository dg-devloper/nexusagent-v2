import { useState } from 'react'
import PropTypes from 'prop-types'
import { styled, alpha } from '@mui/material/styles'
import {
    Box,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Tooltip,
    Chip
} from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell'
import { Link } from 'react-router-dom'
import FlowListMenu from '../button/FlowListMenu'
import moment from 'moment'

const brandColor = '#2b63d9'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: `1px solid ${alpha(brandColor, 0.1)}`,
    padding: '16px',
    [`&.${tableCellClasses.head}`]: {
        background: `linear-gradient(180deg, ${alpha(brandColor, 0.05)} 0%, ${alpha(brandColor, 0.02)} 100%)`,
        color: 'rgb(100, 116, 139)',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        height: 56
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '0.875rem',
        color: 'rgb(51, 65, 85)',
        height: 64
    }
}))

const StyledTableRow = styled(TableRow)(() => ({
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: alpha(brandColor, 0.02),
        boxShadow: `inset 0 0 0 1px ${alpha(brandColor, 0.05)}`
    }
}))

const TypeChip = styled(Chip)(({ flowtype }) => ({
    height: 24,
    borderRadius: 12,
    fontSize: '0.75rem',
    fontWeight: 600,
    backgroundColor: 
        flowtype === 'chatflow' ? alpha('#10B981', 0.1) :
        flowtype === 'agentflow' ? alpha('#6366F1', 0.1) :
        alpha('#F59E0B', 0.1),
    color: 
        flowtype === 'chatflow' ? '#059669' :
        flowtype === 'agentflow' ? '#4F46E5' :
        '#D97706',
    border: `1px solid ${
        flowtype === 'chatflow' ? alpha('#10B981', 0.2) :
        flowtype === 'agentflow' ? alpha('#6366F1', 0.2) :
        alpha('#F59E0B', 0.2)
    }`
}))

export const DashboardTable = ({ chatflows, agentflows, assistants, images, updateFlowsApi, setError }) => {
    // Combine all flows and add type information
    const allFlows = [
        ...(chatflows || []).map(flow => ({ ...flow, type: 'chatflow' })),
        ...(agentflows || []).map(flow => ({ ...flow, type: 'agentflow' })),
        ...(assistants || []).map(flow => ({ ...flow, type: 'assistant' }))
    ].sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate))

    const getTypeLabel = (type) => {
        switch (type) {
            case 'chatflow':
                return 'Chatflow'
            case 'agentflow':
                return 'Multiagent'
            case 'assistant':
                return 'Assistant'
            default:
                return type
        }
    }

    return (
        <TableContainer 
            sx={{ 
                border: `1px solid ${alpha(brandColor, 0.1)}`,
                borderRadius: 3,
                overflow: 'hidden',
                background: `linear-gradient(180deg, ${alpha(brandColor, 0.02)} 0%, transparent 100%)`
            }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Type</StyledTableCell>
                        <StyledTableCell>Apps</StyledTableCell>
                        <StyledTableCell>Last Update</StyledTableCell>
                        <StyledTableCell align="right">Actions</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allFlows.map((flow) => (
                        <StyledTableRow key={flow.id}>
                            <StyledTableCell>
                                <Typography
                                    component={Link}
                                    to={`/${flow.type === 'agentflow' ? 'agentcanvas' : 'canvas'}/${flow.id}`}
                                    sx={{
                                        color: 'rgb(51, 65, 85)',
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                        '&:hover': {
                                            color: brandColor
                                        }
                                    }}
                                >
                                    {flow.name}
                                </Typography>
                            </StyledTableCell>
                            <StyledTableCell>
                                <TypeChip 
                                    label={getTypeLabel(flow.type)}
                                    flowtype={flow.type}
                                    size="small"
                                />
                            </StyledTableCell>
                            <StyledTableCell>
                                <Stack direction="row" spacing={1}>
                                    {images[flow.id]?.map((img, index) => (
                                        <Tooltip key={index} title={`App ${index + 1}`}>
                                            <Box
                                                component="img"
                                                src={img}
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    padding: '4px',
                                                    borderRadius: '8px',
                                                    backgroundColor: alpha(brandColor, 0.05),
                                                    border: `1px solid ${alpha(brandColor, 0.1)}`,
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: `0 4px 8px ${alpha(brandColor, 0.1)}`
                                                    }
                                                }}
                                            />
                                        </Tooltip>
                                    ))}
                                </Stack>
                            </StyledTableCell>
                            <StyledTableCell>
                                <Typography sx={{ color: 'rgb(100, 116, 139)' }}>
                                    {moment(flow.updatedDate).format('MMM D, YYYY')}
                                </Typography>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <FlowListMenu
                                    isAgentCanvas={flow.type === 'agentflow'}
                                    chatflow={flow}
                                    setError={setError}
                                    updateFlowsApi={updateFlowsApi}
                                />
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

DashboardTable.propTypes = {
    chatflows: PropTypes.array,
    agentflows: PropTypes.array,
    assistants: PropTypes.array,
    images: PropTypes.object,
    updateFlowsApi: PropTypes.object,
    setError: PropTypes.func
}

export default DashboardTable