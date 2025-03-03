import PropTypes from 'prop-types'
import { useState } from 'react'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Box, Typography, Button } from '@mui/material'

// project imports
import ModernNodeDialog from '../base/ModernNodeDialog'
import ModernNodeInput from '../nodes/ModernNodeInput'
import { themeVariables } from '../../config'

const ModernAdditionalParamsDialog = ({
    show,
    dialogProps,
    onCancel
}) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const [data, setData] = useState(dialogProps?.data || {})

    const handleSave = () => {
        if (dialogProps?.data) {
            dialogProps.data.inputs = { ...data.inputs }
        }
        onCancel()
    }

    const getButtonStyle = (variant = 'text') => ({
        backgroundColor: variant === 'contained' 
            ? themeVariables.colors.primary.main 
            : 'transparent',
        color: variant === 'contained'
            ? 'white'
            : isDark ? themeVariables.colors.text.primary : themeVariables.colors.text.primary,
        '&:hover': {
            backgroundColor: variant === 'contained'
                ? themeVariables.colors.primary.dark
                : themeVariables.colors.background.hover
        }
    })

    return (
        <ModernNodeDialog
            open={show}
            onClose={onCancel}
            title="Additional Parameters"
            maxWidth="md"
            actions={
                <Box sx={{ display: 'flex', gap: themeVariables.spacing.small }}>
                    <Button 
                        onClick={onCancel}
                        sx={getButtonStyle()}
                    >
                        {dialogProps?.cancelButtonName || 'Cancel'}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={getButtonStyle('contained')}
                    >
                        {dialogProps?.confirmButtonName || 'Save'}
                    </Button>
                </Box>
            }
        >
            <Box sx={{ p: themeVariables.spacing.medium }}>
                {dialogProps?.inputParams?.map((inputParam, index) => (
                    <Box 
                        key={index} 
                        sx={{ 
                            mb: themeVariables.spacing.medium,
                            '&:last-child': {
                                mb: 0
                            }
                        }}
                    >
                        <ModernNodeInput
                            inputParam={inputParam}
                            data={data}
                        />
                    </Box>
                ))}
                {(!dialogProps?.inputParams || dialogProps.inputParams.length === 0) && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: isDark 
                                ? themeVariables.colors.text.secondary 
                                : themeVariables.colors.text.secondary,
                            textAlign: 'center',
                            py: themeVariables.spacing.large,
                            backgroundColor: isDark 
                                ? themeVariables.colors.background.secondary 
                                : themeVariables.colors.background.secondary,
                            borderRadius: themeVariables.borderRadius.medium
                        }}
                    >
                        No additional parameters available
                    </Typography>
                )}
            </Box>
        </ModernNodeDialog>
    )
}

ModernAdditionalParamsDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.shape({
        data: PropTypes.object,
        inputParams: PropTypes.array,
        confirmButtonName: PropTypes.string,
        cancelButtonName: PropTypes.string
    }),
    onCancel: PropTypes.func
}

export default ModernAdditionalParamsDialog