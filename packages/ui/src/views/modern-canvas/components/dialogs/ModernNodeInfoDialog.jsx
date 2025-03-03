import PropTypes from 'prop-types'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Box, Typography, Divider, Link } from '@mui/material'

// project imports
import ModernNodeDialog from '../base/ModernNodeDialog'
import { themeVariables } from '../../config'

// icons
import { IconExternalLink } from '@tabler/icons-react'

const ModernNodeInfoDialog = ({
    show,
    dialogProps,
    onCancel
}) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    const getSectionStyle = () => ({
        mb: themeVariables.spacing.large
    })

    const getLabelStyle = () => ({
        color: isDark ? themeVariables.colors.text.primary : themeVariables.colors.text.primary,
        fontWeight: 500,
        mb: themeVariables.spacing.small
    })

    const getValueStyle = () => ({
        color: isDark ? themeVariables.colors.text.secondary : themeVariables.colors.text.secondary,
        whiteSpace: 'pre-wrap'
    })

    return (
        <ModernNodeDialog
            open={show}
            onClose={onCancel}
            title="Node Information"
            maxWidth="lg"
        >
            <Box sx={{ p: themeVariables.spacing.large }}>
                {/* Basic Info */}
                <Box sx={getSectionStyle()}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            mb: themeVariables.spacing.medium,
                            color: isDark ? themeVariables.colors.text.primary : themeVariables.colors.text.primary
                        }}
                    >
                        {dialogProps?.data?.label || 'Node'}
                    </Typography>
                    {dialogProps?.data?.description && (
                        <Typography variant="body2" sx={getValueStyle()}>
                            {dialogProps.data.description}
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ my: themeVariables.spacing.medium }} />

                {/* Input Parameters */}
                <Box sx={getSectionStyle()}>
                    <Typography variant="subtitle1" sx={getLabelStyle()}>
                        Input Parameters
                    </Typography>
                    {dialogProps?.data?.inputParams?.map((param, index) => (
                        <Box key={index} sx={{ mb: themeVariables.spacing.medium }}>
                            <Typography variant="body2" sx={getLabelStyle()}>
                                {param.label}
                                {!param.optional && (
                                    <Box 
                                        component="span" 
                                        sx={{ 
                                            color: themeVariables.colors.error.main,
                                            ml: themeVariables.spacing.xsmall 
                                        }}
                                    >
                                        *
                                    </Box>
                                )}
                            </Typography>
                            <Typography variant="body2" sx={getValueStyle()}>
                                {param.description || 'No description available'}
                            </Typography>
                            {param.type && (
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: isDark ? themeVariables.colors.text.secondary : themeVariables.colors.text.secondary,
                                        mt: themeVariables.spacing.xsmall
                                    }}
                                >
                                    Type: {param.type}
                                </Typography>
                            )}
                        </Box>
                    ))}
                    {(!dialogProps?.data?.inputParams || dialogProps.data.inputParams.length === 0) && (
                        <Typography variant="body2" sx={getValueStyle()}>
                            No input parameters
                        </Typography>
                    )}
                </Box>

                {/* Output Parameters */}
                <Box sx={getSectionStyle()}>
                    <Typography variant="subtitle1" sx={getLabelStyle()}>
                        Output Parameters
                    </Typography>
                    {dialogProps?.data?.outputAnchors?.map((anchor, index) => (
                        <Box key={index} sx={{ mb: themeVariables.spacing.medium }}>
                            <Typography variant="body2" sx={getLabelStyle()}>
                                {anchor.label || `Output ${index + 1}`}
                            </Typography>
                            <Typography variant="body2" sx={getValueStyle()}>
                                {anchor.description || 'No description available'}
                            </Typography>
                            {anchor.type && (
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: isDark ? themeVariables.colors.text.secondary : themeVariables.colors.text.secondary,
                                        mt: themeVariables.spacing.xsmall
                                    }}
                                >
                                    Type: {anchor.type}
                                </Typography>
                            )}
                        </Box>
                    ))}
                    {(!dialogProps?.data?.outputAnchors || dialogProps.data.outputAnchors.length === 0) && (
                        <Typography variant="body2" sx={getValueStyle()}>
                            No output parameters
                        </Typography>
                    )}
                </Box>

                {/* Documentation */}
                {dialogProps?.data?.documentation && (
                    <>
                        <Divider sx={{ my: themeVariables.spacing.medium }} />
                        <Box sx={getSectionStyle()}>
                            <Typography variant="subtitle1" sx={getLabelStyle()}>
                                Documentation
                            </Typography>
                            <Link
                                href={dialogProps.data.documentation}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: themeVariables.spacing.small,
                                    color: themeVariables.colors.primary.main,
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        color: themeVariables.colors.primary.dark
                                    }
                                }}
                            >
                                View Documentation
                                <IconExternalLink size={16} />
                            </Link>
                        </Box>
                    </>
                )}
            </Box>
        </ModernNodeDialog>
    )
}

ModernNodeInfoDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.shape({
        data: PropTypes.object
    }),
    onCancel: PropTypes.func
}

export default ModernNodeInfoDialog