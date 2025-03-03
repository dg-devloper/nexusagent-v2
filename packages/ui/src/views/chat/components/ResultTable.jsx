import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';

/**
 * ResultTable component displays tabular data in a clean, modern format
 */
const ResultTable = ({ 
    data = [], 
    columns = [], 
    maxRows = 10,
    caption = '',
    showRowCount = true
}) => {
    // Limit the number of rows displayed
    const displayData = data.slice(0, maxRows);
    const hasMoreRows = data.length > maxRows;
    
    return (
        <Box sx={{ width: '100%', mt: 2, mb: 1 }}>
            <TableContainer 
                component={Paper} 
                elevation={0}
                sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}
            >
                <Table size="small" aria-label="result table">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'background.default' }}>
                            {columns.map((column, index) => (
                                <TableCell 
                                    key={index}
                                    align={column.numeric ? 'right' : 'left'}
                                    sx={{ 
                                        fontWeight: 500,
                                        py: 1.5,
                                        px: 2,
                                        fontSize: '0.75rem',
                                        color: 'text.secondary'
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayData.map((row, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                                sx={{ 
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}
                            >
                                {columns.map((column, colIndex) => (
                                    <TableCell 
                                        key={colIndex}
                                        align={column.numeric ? 'right' : 'left'}
                                        sx={{ 
                                            py: 1.5,
                                            px: 2,
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        {row[column.field]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {hasMoreRows && showRowCount && (
                <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                        display: 'block', 
                        mt: 1, 
                        ml: 1,
                        fontSize: '0.75rem'
                    }}
                >
                    Preview is limited to {maxRows} records
                </Typography>
            )}
            
            {caption && (
                <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                        display: 'block', 
                        mt: 1, 
                        ml: 1,
                        fontSize: '0.75rem'
                    }}
                >
                    {caption}
                </Typography>
            )}
        </Box>
    );
};

ResultTable.propTypes = {
    data: PropTypes.array,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            field: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            numeric: PropTypes.bool
        })
    ),
    maxRows: PropTypes.number,
    caption: PropTypes.string,
    showRowCount: PropTypes.bool
};

export default ResultTable;
