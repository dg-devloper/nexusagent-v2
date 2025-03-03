import { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { styled, alpha, useTheme } from '@mui/material/styles'
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
    Paper,
    Chip
} from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell'
import FlowListMenu from '../button/FlowListMenu'
import { Link } from 'react-router-dom'
import { IconDotsCircleHorizontal } from '@tabler/icons-react'

const brandColor = '#2b63d9'

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

const TypeChip = styled(Chip)(({ flowtype }) => ({
    height: 28,
    borderRadius: '8px',
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
    }`,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 8px ${alpha(
            flowtype === 'chatflow' ? '#10B981' :
            flowtype === 'agentflow' ? '#6366F1' :
            '#F59E0B',
            0.15
        )}`
    }
}))

export const FlowListTable = ({ data, images, isLoading, filterFunction, updateFlowsApi, setError, isAgentCanvas }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const getFlowType = (flow) => {
        if (isAgentCanvas) return 'agentflow'
        return 'chatflow'
    }

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

    const renderNodeIcons = (rowImages) => {
        if (!rowImages || rowImages.length === 0) return null

        const displayImages = rowImages.slice(0, 5)
        const remainingCount = rowImages.length - 5

        return (
            <Stack direction="row" spacing={1.5} alignItems="center">
                {displayImages.map((img, index) => (
                    <Tooltip key={index} title={`Node ${index + 1}`}>
                        <Box
                            component="img"
                            src={img}
                            sx={{
                                width: 32,
                                height: 32,
                                padding: '6px',
                                borderRadius: '12px',
                                backgroundColor: alpha(brandColor, 0.05),
                                border: `1px solid ${alpha(brandColor, 0.1)}`,
                                transition: 'all 0.3s ease-in-out',
                                objectFit: 'contain',
                                '&:hover': {
                                    transform: 'translateY(-2px) scale(1.05)',
                                    boxShadow: `0 6px 16px ${alpha(brandColor, 0.12)}`,
                                    backgroundColor: alpha(brandColor, 0.08)
                                }
                            }}
                        />
                    </Tooltip>
                ))}
                {remainingCount > 0 && (
                    <Tooltip title={`${remainingCount} more node${remainingCount > 1 ? 's' : ''}`}>
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '12px',
                                backgroundColor: alpha(brandColor, 0.05),
                                border: `1px solid ${alpha(brandColor, 0.1)}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: brandColor,
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 6px 16px ${alpha(brandColor, 0.12)}`,
                                    backgroundColor: alpha(brandColor, 0.08)
                                }
                            }}
                        >
                            <IconDotsCircleHorizontal size={18} />
                        </Box>
                    </Tooltip>
                )}
            </Stack>
        )
    }

    if (isLoading) {
        return (
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
        )
    }

    return (
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
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Type</StyledTableCell>
                        <StyledTableCell>Nodes</StyledTableCell>
                        <StyledTableCell>Last Modified</StyledTableCell>
                        <StyledTableCell align="right">Actions</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(data || []).filter(filterFunction || (() => true)).map((row) => {
                        const flowType = getFlowType(row)
                        return (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell>
                                    <Typography
                                        component={Link}
                                        to={`/${isAgentCanvas ? 'agentcanvas' : 'canvas'}/${row.id}`}
                                        sx={{
                                            color: 'rgb(51, 65, 85)',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                color: brandColor,
                                                transform: 'translateX(4px)'
                                            }
                                        }}
                                    >
                                        {row.name}
                                    </Typography>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <TypeChip
                                        label={getTypeLabel(flowType)}
                                        flowtype={flowType}
                                        size="small"
                                    />
                                </StyledTableCell>
                                <StyledTableCell>
                                    {renderNodeIcons(images[row.id])}
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Typography 
                                        sx={{ 
                                            color: 'rgb(100, 116, 139)',
                                            fontSize: '0.875rem',
                                            fontWeight: 500
                                        }}
                                    >
                                        {moment(row.updatedDate).format('MMM D, YYYY')}
                                    </Typography>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <FlowListMenu
                                        isAgentCanvas={isAgentCanvas}
                                        chatflow={row}
                                        setError={setError}
                                        updateFlowsApi={updateFlowsApi}
                                    />
                                </StyledTableCell>
                            </StyledTableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

FlowListTable.propTypes = {
    data: PropTypes.array,
    images: PropTypes.object,
    isLoading: PropTypes.bool,
    filterFunction: PropTypes.func,
    updateFlowsApi: PropTypes.object,
    setError: PropTypes.func,
    isAgentCanvas: PropTypes.bool
}

export default FlowListTable
