import PropTypes from 'prop-types'
import { useContext } from 'react'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'

// project imports
import { Dropdown } from '@/ui-component/dropdown/Dropdown'
import { themeVariables } from '../../config'

// icons
import { IconCircleDot } from '@tabler/icons-react'

const ModernNodeOutputHandler = ({
    label,
    type,
    value,
    onChange,
    options,
    disabled,
    isAnchor
}) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    const getOutputStyle = () => ({
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        borderRadius: themeVariables.effects.borderRadius.medium,
        border: `1px solid ${isDark ? themeVariables.colors.border.dark : themeVariables.colors.border.light}`,
        padding: themeVariables.spacing.unit * 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: themeVariables.spacing.unit,
        transition: `all ${themeVariables.effects.transition.duration} ${themeVariables.effects.transition.timing}`,
        '&:hover': {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
            borderColor: theme.palette.primary.main
        }
    })

    const renderOutput = () => {
        if (type === 'options' && options) {
            return (
                <Dropdown
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    options={options}
                />
            )
        }

        return (
            <Box sx={getOutputStyle()}>
                <IconCircleDot
                    size={18}
                    style={{
                        color: isDark ? theme.palette.grey[400] : theme.palette.grey[600]
                    }}
                />
                <Typography
                    sx={{
                        fontSize: themeVariables.typography.fontSize.small,
                        fontWeight: themeVariables.typography.fontWeight.medium,
                        color: isDark ? themeVariables.colors.text.dark : themeVariables.colors.text.light
                    }}
                >
                    {label || 'Output'}
                </Typography>
            </Box>
        )
    }

    return (
        <Box
            className={`modern-node-output-handler ${isAnchor ? 'is-anchor' : ''}`}
            sx={{ mb: themeVariables.spacing.unit * 2 }}
        >
            {renderOutput()}
        </Box>
    )
}

ModernNodeOutputHandler.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    options: PropTypes.array,
    disabled: PropTypes.bool,
    isAnchor: PropTypes.bool
}

export default ModernNodeOutputHandler