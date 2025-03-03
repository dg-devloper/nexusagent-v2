import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import {
    Box,
    Typography,
    TextField,
    Switch,
    IconButton,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    OutlinedInput,
    Chip
} from '@mui/material'
import { IconCopy, IconInfoCircle } from '@tabler/icons-react'

const ModernNodeInputHandler = ({ label, type, value, onChange, description, required, options, disabled }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === 'dark'

    const renderInput = () => {
        switch (type) {
            case 'string':
            case 'number':
            case 'password':
                return (
                    <TextField
                        fullWidth
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                borderRadius: '8px',
                                '&:hover': {
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: theme.palette.primary.main
                                    }
                                }
                            }
                        }}
                    />
                )
            case 'boolean':
                return (
                    <Switch
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        disabled={disabled}
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: theme.palette.primary.main
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: theme.palette.primary.main
                            }
                        }}
                    />
                )
            case 'options':
                return (
                    <FormControl fullWidth size="small">
                        <Select
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            disabled={disabled}
                            input={
                                <OutlinedInput
                                    sx={{
                                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                        borderRadius: '8px',
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: theme.palette.primary.main
                                            }
                                        }
                                    }}
                                />
                            }
                        >
                            {options?.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )
            default:
                return null
        }
    }

    return (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {label}
                    {required && <span style={{ color: theme.palette.error.main }}>&nbsp;*</span>}
                </Typography>
                {description && (
                    <Tooltip title={description} arrow>
                        <IconButton size="small" sx={{ ml: 0.5 }}>
                            <IconInfoCircle size={16} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            {renderInput()}
        </Box>
    )
}

ModernNodeInputHandler.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    description: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.array,
    disabled: PropTypes.bool
}

export default ModernNodeInputHandler