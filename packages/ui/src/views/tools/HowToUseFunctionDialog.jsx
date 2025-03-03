import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { Dialog, DialogContent, DialogTitle, Typography, Box, alpha, Stack, styled, Button } from '@mui/material'
import { IconCode, IconBrandJavascript, IconVariable, IconSettings, IconX } from '@tabler/icons-react'

const brandColor = '#2b63d9'

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: 16,
        boxShadow: `0 8px 40px -4px ${alpha(brandColor, 0.08)}`,
        border: `1px solid ${alpha(brandColor, 0.1)}`,
        overflow: 'hidden'
    }
}))

const IconBox = styled(Box)(({ theme }) => ({
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: alpha(brandColor, 0.1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 6px 16px ${alpha(brandColor, 0.12)}`,
        backgroundColor: alpha(brandColor, 0.15)
    }
}))

const ContentBox = styled(Box)(({ theme }) => ({
    padding: 16,
    borderRadius: 12,
    backgroundColor: alpha(brandColor, 0.03),
    border: `1px solid ${alpha(brandColor, 0.1)}`,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: alpha(brandColor, 0.05),
        transform: 'translateY(-2px)',
        boxShadow: `0 6px 16px ${alpha(brandColor, 0.08)}`
    }
}))

const CodeBox = styled(Box)(({ theme }) => ({
    backgroundColor: alpha(brandColor, 0.1),
    padding: '6px 12px',
    borderRadius: 8,
    color: brandColor,
    fontWeight: 500,
    display: 'inline-block',
    width: 'fit-content',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 8px ${alpha(brandColor, 0.12)}`,
        backgroundColor: alpha(brandColor, 0.15)
    }
}))

const HowToUseFunctionDialog = ({ show, onCancel }) => {
    const portalElement = document.getElementById('portal')

    const component = show ? (
        <StyledDialog
            onClose={onCancel}
            open={show}
            fullWidth
            maxWidth='sm'
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ p: 3, borderBottom: `1px solid ${alpha(brandColor, 0.1)}` }} id='alert-dialog-title'>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <IconBox>
                        <IconBrandJavascript size={24} color={brandColor} />
                    </IconBox>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: 'rgb(51, 65, 85)', 
                            fontWeight: 600,
                            fontSize: '1.25rem'
                        }}
                    >
                        How To Use Function
                    </Typography>
                </Stack>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                    <ContentBox>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <IconCode size={20} color={brandColor} />
                            <Typography sx={{ color: 'rgb(51, 65, 85)', fontWeight: 500 }}>
                                You can use any libraries imported in Flowise
                            </Typography>
                        </Stack>
                    </ContentBox>

                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <IconVariable size={20} color={brandColor} />
                            <Typography sx={{ color: 'rgb(51, 65, 85)', fontWeight: 500 }}>
                                Input Schema Variables
                            </Typography>
                        </Stack>
                        <ContentBox>
                            <Stack spacing={1.5}>
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                    <Typography sx={{ color: 'rgb(100, 116, 139)', minWidth: 80 }}>Property:</Typography>
                                    <CodeBox component="code">userid</CodeBox>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                    <Typography sx={{ color: 'rgb(100, 116, 139)', minWidth: 80 }}>Variable:</Typography>
                                    <CodeBox component="code">$userid</CodeBox>
                                </Box>
                            </Stack>
                        </ContentBox>
                    </Box>

                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <IconSettings size={20} color={brandColor} />
                            <Typography sx={{ color: 'rgb(51, 65, 85)', fontWeight: 500 }}>
                                Flow Configuration
                            </Typography>
                        </Stack>
                        <ContentBox>
                            <Stack spacing={1.5}>
                                {[
                                    '$flow.sessionId',
                                    '$flow.chatId',
                                    '$flow.chatflowId',
                                    '$flow.input',
                                    '$flow.state'
                                ].map((item, index) => (
                                    <CodeBox key={index} component="code">
                                        {item}
                                    </CodeBox>
                                ))}
                            </Stack>
                        </ContentBox>
                    </Box>

                    <ContentBox>
                        <Stack spacing={1.5}>
                            <Typography sx={{ color: 'rgb(51, 65, 85)', fontWeight: 500 }}>
                                Custom Variables
                            </Typography>
                            <CodeBox component="code">
                                {`$vars.<variable-name>`}
                            </CodeBox>
                        </Stack>
                    </ContentBox>

                    <Box sx={{ 
                        p: 2, 
                        borderRadius: 3,
                        backgroundColor: alpha('#FFC107', 0.1),
                        border: `1px solid ${alpha('#FFC107', 0.2)}`,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(254, 240, 138, 0.2)'
                        }
                    }}>
                        <Typography sx={{ color: '#B45309', fontWeight: 500 }}>
                            Must return a string value at the end of function
                        </Typography>
                    </Box>
                </Stack>
            </DialogContent>
            <Box sx={{ p: 3, pt: 2, borderTop: `1px solid ${alpha(brandColor, 0.1)}`, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                    variant="outlined"
                    onClick={onCancel}
                    startIcon={<IconX size={18} />}
                    sx={{
                        borderRadius: 2,
                        borderColor: alpha(brandColor, 0.3),
                        color: brandColor,
                        '&:hover': {
                            borderColor: brandColor,
                            backgroundColor: alpha(brandColor, 0.05)
                        }
                    }}
                >
                    Close
                </Button>
            </Box>
        </StyledDialog>
    ) : null

    return createPortal(component, portalElement)
}

HowToUseFunctionDialog.propTypes = {
    show: PropTypes.bool,
    onCancel: PropTypes.func
}

export default HowToUseFunctionDialog
