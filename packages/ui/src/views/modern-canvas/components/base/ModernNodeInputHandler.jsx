import PropTypes from 'prop-types'
import { useContext } from 'react'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Box, Typography, TextField, Switch } from '@mui/material'

// project imports
import { CodeEditor } from '@/ui-component/editor/CodeEditor'
import { JsonEditorInput } from '@/ui-component/json/JsonEditor'
import { File } from '@/ui-component/file/File'
import { Dropdown } from '@/ui-component/dropdown/Dropdown'
import { MultiDropdown } from '@/ui-component/dropdown/MultiDropdown'
import { AsyncDropdown } from '@/ui-component/dropdown/AsyncDropdown'
import { themeVariables } from '../../config'

const ModernNodeInputHandler = ({
    label,
    type,
    value,
    onChange,
    description,
    required,
    options,
    disabled,
    rows,
    placeholder
}) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    const getInputStyle = () => ({
        '& .MuiInputBase-root': {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            borderRadius: themeVariables.effects.borderRadius.medium,
            border: `1px solid ${isDark ? themeVariables.colors.border.dark : themeVariables.colors.border.light}`,
            transition: `all ${themeVariables.effects.transition.duration} ${themeVariables.effects.transition.timing}`,
            '&:hover': {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                borderColor: theme.palette.primary.main
            },
            '&.Mui-focused': {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`
            }
        }
    })

    const renderInput = () => {
        switch (type) {
            case 'string':
            case 'number':
            case 'password':
                return (
                    <TextField
                        fullWidth
                        size="small"
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        placeholder={placeholder}
                        sx={getInputStyle()}
                    />
                )
            case 'boolean':
                return (
                    <Switch
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        disabled={disabled}
                        className="modern-node-switch"
                    />
                )
            case 'code':
                return (
                    <CodeEditor
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        height={rows ? `${rows * 24}px` : '200px'}
                    />
                )
            case 'json':
                return (
                    <JsonEditorInput
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                )
            case 'file':
                return (
                    <File
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                )
            case 'options':
                if (Array.isArray(options)) {
                    return (
                        <MultiDropdown
                            value={value}
                            onChange={onChange}
                            disabled={disabled}
                            options={options}
                        />
                    )
                }
                if (typeof options === 'function') {
                    return (
                        <AsyncDropdown
                            value={value}
                            onChange={onChange}
                            disabled={disabled}
                            loadOptions={options}
                        />
                    )
                }
                return (
                    <Dropdown
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        options={options}
                    />
                )
            default:
                return null
        }
    }

    return (
        <Box className="modern-node-input-handler">
            {label && (
                <Typography
                    variant="body2"
                    sx={{
                        mb: 1,
                        color: isDark ? themeVariables.colors.text.dark : themeVariables.colors.text.light,
                        fontWeight: themeVariables.typography.fontWeight.medium
                    }}
                >
                    {label}
                    {required && (
                        <Box component="span" color="error.main">*</Box>
                    )}
                </Typography>
            )}
            {renderInput()}
            {description && (
                <Typography
                    variant="caption"
                    sx={{
                        mt: 0.5,
                        display: 'block',
                        color: theme.palette.text.secondary
                    }}
                >
                    {description}
                </Typography>
            )}
        </Box>
    )
}

ModernNodeInputHandler.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    description: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func,
        PropTypes.object
    ]),
    disabled: PropTypes.bool,
    rows: PropTypes.number,
    placeholder: PropTypes.string
}

export default ModernNodeInputHandler