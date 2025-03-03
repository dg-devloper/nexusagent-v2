import PropTypes from 'prop-types'
import { forwardRef } from 'react'

// material-ui
import { useTheme } from '@mui/material/styles'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box
} from '@mui/material'

// project imports
import { themeVariables } from '../../config'

// icons
import { IconX } from '@tabler/icons-react'

const ModernNodeDialog = forwardRef(({
    open,
    onClose,
    title,
    children,
    actions,
    maxWidth = 'md',
    fullWidth = true,
    showCloseButton = true,
    className = '',
    ...others
}, ref) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    const getDialogStyle = () => ({
        '& .MuiDialog-paper': {
            borderRadius: themeVariables.borderRadius.medium,
            backgroundColor: isDark ? themeVariables.colors.background.dark : themeVariables.colors.background.light,
            boxShadow: isDark ? themeVariables.shadows.large : themeVariables.shadows.medium,
            border: `1px solid ${isDark ? themeVariables.colors.border.dark : themeVariables.colors.border.light}`
        }
    })

    const getTitleStyle = () => ({
        padding: themeVariables.spacing.medium,
        borderBottom: `1px solid ${isDark ? themeVariables.colors.border.dark : themeVariables.colors.border.light}`,
        display: 'flex',
        alignItems: 'center',
        gap: themeVariables.spacing.small
    })

    const getContentStyle = () => ({
        padding: themeVariables.spacing.large
    })

    const getActionsStyle = () => ({
        padding: themeVariables.spacing.medium,
        borderTop: `1px solid ${isDark ? themeVariables.colors.border.dark : themeVariables.colors.border.light}`,
        gap: themeVariables.spacing.small
    })

    return (
        <Dialog
            ref={ref}
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            className={`modern-node-dialog ${className}`}
            sx={getDialogStyle()}
            {...others}
        >
            {title && (
                <DialogTitle sx={getTitleStyle()}>
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                            flex: 1,
                            color: isDark ? themeVariables.colors.text.primary : themeVariables.colors.text.primary
                        }}
                    >
                        {title}
                    </Typography>
                    {showCloseButton && (
                        <IconButton
                            size="small"
                            onClick={onClose}
                            sx={{
                                color: isDark ? themeVariables.colors.text.secondary : themeVariables.colors.text.secondary,
                                '&:hover': {
                                    color: isDark ? themeVariables.colors.text.primary : themeVariables.colors.text.primary,
                                    backgroundColor: isDark ? themeVariables.colors.background.hover : themeVariables.colors.background.hover
                                }
                            }}
                        >
                            <IconX size={18} />
                        </IconButton>
                    )}
                </DialogTitle>
            )}

            <DialogContent sx={getContentStyle()}>
                {children}
            </DialogContent>

            {actions && (
                <DialogActions sx={getActionsStyle()}>
                    {typeof actions === 'function' ? actions(onClose) : actions}
                </DialogActions>
            )}
        </Dialog>
    )
})

ModernNodeDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.node,
    children: PropTypes.node,
    actions: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    fullWidth: PropTypes.bool,
    showCloseButton: PropTypes.bool,
    className: PropTypes.string
}

ModernNodeDialog.displayName = 'ModernNodeDialog'

export default ModernNodeDialog