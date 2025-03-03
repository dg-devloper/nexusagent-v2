import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { styled, alpha } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell'
import {
    Box,
    Button,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme
} from '@mui/material'

// icons
import { IconTool } from '@tabler/icons-react'

const brandColor = '#2b63d9'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: '20px 24px',
    height: 72,
    [`&.${tableCellClasses.head}`]: {
        background: `linear-gradient(180deg, ${alpha(brandColor, 0.05)} 0%, ${alpha(brandColor, 0.02)} 100%)`,
        color: 'rgb(100, 116, 139)',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        height: 64,
        borderBottom: `1px solid ${alpha(brandColor, 0.1)}`
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '0.875rem',
        color: 'rgb(51, 65, 85)',
        borderBottom: `1px solid ${alpha(brandColor, 0.1)}`
    }
}))

const StyledTableRow = styled(TableRow)(() => ({
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        backgroundColor: alpha(brandColor, 0.02),
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 12px ${alpha(brandColor, 0.08)}`
    },
    '&:last-child td, &:last-child th': {
        borderBottom: 0
    }
}))

const IconWrapper = styled('div')({
    width: 35,
    height: 35,
    display: 'flex',
    flexShrink: 0,
    marginRight: 10,
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center'
})

export const ToolsTable = ({ data, isLoading, onSelect }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    return (
        <TableContainer 
            sx={{ 
                border: `1px solid ${alpha(brandColor, 0.1)}`,
                borderRadius: 4,
                overflow: 'hidden',
                background: `linear-gradient(180deg, ${alpha(brandColor, 0.02)} 0%, transparent 100%)`,
                boxShadow: `0 8px 32px -4px ${alpha(brandColor, 0.08)}`
            }} 
            component={Paper}
            elevation={0}
        >
            <Table sx={{ minWidth: 650 }} size='small' aria-label='tools table'>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Description</StyledTableCell>
                        <StyledTableCell align="right">Actions</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {isLoading ? (
                        <>
                            <StyledTableRow>
                                <StyledTableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Skeleton variant='circular' width={35} height={35} />
                                        <Skeleton variant='text' width={150} />
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Skeleton variant='text' width="80%" />
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Skeleton variant='rectangular' width={64} height={36} sx={{ borderRadius: 1 }} />
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Skeleton variant='circular' width={35} height={35} />
                                        <Skeleton variant='text' width={180} />
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Skeleton variant='text' width="70%" />
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Skeleton variant='rectangular' width={64} height={36} sx={{ borderRadius: 1 }} />
                                </StyledTableCell>
                            </StyledTableRow>
                        </>
                    ) : (
                        <>
                            {data?.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <IconWrapper
                                                sx={{
                                                    backgroundColor: alpha(brandColor, 0.05),
                                                    border: `1px solid ${alpha(brandColor, 0.1)}`,
                                                    backgroundImage: row.iconSrc ? `url(${row.iconSrc})` : 'none',
                                                    backgroundSize: 'contain',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center center'
                                                }}
                                            >
                                                {!row.iconSrc && <IconTool size={20} color={brandColor} />}
                                            </IconWrapper>
                                            <Button 
                                                onClick={() => onSelect(row)} 
                                                sx={{ 
                                                    textAlign: 'left',
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    color: 'rgb(51, 65, 85)',
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        backgroundColor: 'transparent',
                                                        color: brandColor
                                                    }
                                                }}
                                            >
                                                {row.templateName || row.name}
                                            </Button>
                                        </Box>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Typography 
                                            sx={{ 
                                                color: 'rgb(100, 116, 139)',
                                                fontSize: '0.875rem',
                                                lineHeight: 1.5
                                            }}
                                        >
                                            {row.description || ''}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <Button 
                                            onClick={() => onSelect(row)}
                                            sx={{ 
                                                minWidth: 'auto',
                                                backgroundColor: alpha(brandColor, 0.05),
                                                border: `1px solid ${alpha(brandColor, 0.1)}`,
                                                borderRadius: 2,
                                                px: 2,
                                                color: brandColor,
                                                '&:hover': {
                                                    backgroundColor: alpha(brandColor, 0.1)
                                                }
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

ToolsTable.propTypes = {
    data: PropTypes.array,
    isLoading: PropTypes.bool,
    onSelect: PropTypes.func
}
