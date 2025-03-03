import PropTypes from 'prop-types'
import { forwardRef } from 'react'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Card } from '@mui/material'

// project imports
import { themeVariables, nodeStyles } from '../../config'
import { NODE_STYLES } from '../../types'

const ModernNodeCardWrapper = forwardRef(({
    children,
    style = NODE_STYLES.DEFAULT,
    selected = false,
    border = true,
    className = '',
    ...others
}, ref) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    const getNodeStyle = () => {
        const baseStyle = {
            ...nodeStyles.base,
            backgroundColor: isDark ? themeVariables.colors.background.dark : themeVariables.colors.background.light,
            borderColor: isDark ? themeVariables.colors.border.dark : themeVariables.colors.border.light,
            color: isDark ? themeVariables.colors.text.primary : themeVariables.colors.text.primary,
            borderWidth: border ? 1 : 0,
            borderStyle: 'solid',
            '&:hover': {
                ...nodeStyles.hover,
                backgroundColor: isDark ? themeVariables.colors.background.dark : themeVariables.colors.background.hover
            }
        }

        if (selected) {
            return {
                ...baseStyle,
                ...nodeStyles.selected
            }
        }

        switch (style) {
            case NODE_STYLES.ERROR:
                return {
                    ...baseStyle,
                    ...nodeStyles.error
                }
            case NODE_STYLES.WARNING:
                return {
                    ...baseStyle,
                    ...nodeStyles.warning
                }
            case NODE_STYLES.SUCCESS:
                return {
                    ...baseStyle,
                    ...nodeStyles.success
                }
            case NODE_STYLES.DISABLED:
                return {
                    ...baseStyle,
                    ...nodeStyles.disabled
                }
            default:
                return baseStyle
        }
    }

    return (
        <Card
            ref={ref}
            className={`modern-node-card ${selected ? 'selected' : ''} ${className}`}
            sx={getNodeStyle()}
            {...others}
        >
            {children}
        </Card>
    )
})

ModernNodeCardWrapper.propTypes = {
    children: PropTypes.node,
    style: PropTypes.oneOf(Object.values(NODE_STYLES)),
    selected: PropTypes.bool,
    border: PropTypes.bool,
    className: PropTypes.string
}

ModernNodeCardWrapper.displayName = 'ModernNodeCardWrapper'

export default ModernNodeCardWrapper