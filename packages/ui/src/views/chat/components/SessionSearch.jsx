import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Menu,
    MenuItem,
    Chip,
    Typography,
    alpha
} from '@mui/material';
import {
    IconSearch,
    IconFilter,
    IconCalendar,
    IconSortAscending,
    IconSortDescending,
    IconX
} from '@tabler/icons-react';
import { format } from 'date-fns';

/**
 * Session search and filter component
 */
const SessionSearch = ({
    onSearch,
    onFilter,
    onSort,
    filters = {},
    sortOrder = 'desc'
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeFilters, setActiveFilters] = useState(filters);
    const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder);

    // Filter options
    const filterOptions = useMemo(() => [
        { label: 'Last 24 hours', value: '24h' },
        { label: 'Last 7 days', value: '7d' },
        { label: 'Last 30 days', value: '30d' },
        { label: 'Has files', value: 'hasFiles' },
        { label: 'Has feedback', value: 'hasFeedback' }
    ], []);

    // Handle search input change
    const handleSearchChange = useCallback((e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch?.(value);
    }, [onSearch]);

    // Clear search
    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
        onSearch?.('');
    }, [onSearch]);

    // Toggle filter menu
    const handleFilterClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    // Close filter menu
    const handleFilterClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    // Toggle filter
    const handleFilterToggle = useCallback((filter) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            newFilters[filter.value] = !prev[filter.value];
            onFilter?.(newFilters);
            return newFilters;
        });
    }, [onFilter]);

    // Remove filter
    const handleRemoveFilter = useCallback((filter) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[filter];
            onFilter?.(newFilters);
            return newFilters;
        });
    }, [onFilter]);

    // Toggle sort order
    const handleSortToggle = useCallback(() => {
        const newOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        setCurrentSortOrder(newOrder);
        onSort?.(newOrder);
    }, [currentSortOrder, onSort]);

    // Get active filter count
    const activeFilterCount = useMemo(() => 
        Object.values(activeFilters).filter(Boolean).length,
    [activeFilters]);

    return (
        <Box sx={{ width: '100%' }}>
            {/* Search and Filter Bar */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search sessions..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconSearch size={20} />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={handleClearSearch}
                                    edge="end"
                                >
                                    <IconX size={16} />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px'
                        }
                    }}
                />

                <IconButton
                    onClick={handleFilterClick}
                    color={activeFilterCount > 0 ? 'primary' : 'default'}
                    sx={{
                        position: 'relative',
                        '&:hover': {
                            bgcolor: (theme) => 
                                alpha(theme.palette.primary.main, 0.1)
                        }
                    }}
                >
                    <IconFilter size={20} />
                    {activeFilterCount > 0 && (
                        <Chip
                            label={activeFilterCount}
                            size="small"
                            color="primary"
                            sx={{
                                position: 'absolute',
                                top: -4,
                                right: -4,
                                height: 16,
                                minWidth: 16,
                                fontSize: '0.65rem'
                            }}
                        />
                    )}
                </IconButton>

                <IconButton
                    onClick={handleSortToggle}
                    sx={{
                        '&:hover': {
                            bgcolor: (theme) => 
                                alpha(theme.palette.primary.main, 0.1)
                        }
                    }}
                >
                    {currentSortOrder === 'asc' ? (
                        <IconSortAscending size={20} />
                    ) : (
                        <IconSortDescending size={20} />
                    )}
                </IconButton>
            </Box>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {Object.entries(activeFilters).map(([key, value]) => {
                        if (!value) return null;
                        const filter = filterOptions.find(f => f.value === key);
                        if (!filter) return null;

                        return (
                            <Chip
                                key={key}
                                label={filter.label}
                                onDelete={() => handleRemoveFilter(key)}
                                size="small"
                                sx={{
                                    borderRadius: '8px',
                                    bgcolor: (theme) => 
                                        alpha(theme.palette.primary.main, 0.1),
                                    color: 'primary.main',
                                    '& .MuiChip-deleteIcon': {
                                        color: 'primary.main'
                                    }
                                }}
                            />
                        );
                    })}
                </Box>
            )}

            {/* Filter Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleFilterClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: '12px',
                        boxShadow: (theme) => theme.shadows[3]
                    }
                }}
            >
                {filterOptions.map((filter) => (
                    <MenuItem
                        key={filter.value}
                        onClick={() => handleFilterToggle(filter)}
                        sx={{
                            color: activeFilters[filter.value] 
                                ? 'primary.main' 
                                : 'text.primary'
                        }}
                    >
                        {filter.value.startsWith('has') ? (
                            filter.label
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconCalendar 
                                    size={16} 
                                    style={{ marginRight: 8 }}
                                />
                                {filter.label}
                            </Box>
                        )}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

SessionSearch.propTypes = {
    onSearch: PropTypes.func,
    onFilter: PropTypes.func,
    onSort: PropTypes.func,
    filters: PropTypes.object,
    sortOrder: PropTypes.oneOf(['asc', 'desc'])
};

export default SessionSearch;
