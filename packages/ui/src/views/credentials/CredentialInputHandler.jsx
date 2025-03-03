import PropTypes from 'prop-types'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import { Box, Typography, IconButton, Stack, alpha } from '@mui/material'
import { IconArrowsMaximize, IconAlertTriangle } from '@tabler/icons-react'

// project import
import { Dropdown } from '@/ui-component/dropdown/Dropdown'
import { Input } from '@/ui-component/input/Input'
import { SwitchInput } from '@/ui-component/switch/Switch'
import { JsonEditorInput } from '@/ui-component/json/JsonEditor'
import { TooltipWithParser } from '@/ui-component/tooltip/TooltipWithParser'

const brandColor = '#2b63d9'

// ===========================|| NodeInputHandler ||=========================== //

const CredentialInputHandler = ({ inputParam, data, disabled = false }) => {
    const customization = useSelector((state) => state.customization)
    const ref = useRef(null)

    const [showExpandDialog, setShowExpandDialog] = useState(false)
    const [expandDialogProps, setExpandDialogProps] = useState({})

    const onExpandDialogClicked = (value, inputParam) => {
        const dialogProp = {
            value,
            inputParam,
            disabled,
            confirmButtonName: 'Save',
            cancelButtonName: 'Cancel'
        }
        setExpandDialogProps(dialogProp)
        setShowExpandDialog(true)
    }

    const onExpandDialogSave = (newValue, inputParamName) => {
        setShowExpandDialog(false)
        data[inputParamName] = newValue
    }

    return (
        <div ref={ref}>
            {inputParam && (
                <>
                    <Box sx={{ p: 3, borderTop: `1px solid ${alpha(brandColor, 0.1)}` }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography
                                    variant='subtitle2'
                                    sx={{
                                        color: 'rgb(100, 116, 139)',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}
                                >
                                    {inputParam.label}
                                    {!inputParam.optional && <span style={{ color: '#EF4444' }}>&nbsp;*</span>}
                                </Typography>
                                {inputParam.description && (
                                    <TooltipWithParser 
                                        title={inputParam.description} 
                                        sx={{ 
                                            color: alpha(brandColor, 0.7),
                                            '&:hover': {
                                                color: brandColor
                                            }
                                        }} 
                                    />
                                )}
                            </Stack>
                            {inputParam.type === 'string' && inputParam.rows && (
                                <IconButton
                                    size='small'
                                    sx={{
                                        height: 30,
                                        width: 30,
                                        color: brandColor,
                                        backgroundColor: alpha(brandColor, 0.05),
                                        borderRadius: '8px',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: alpha(brandColor, 0.1),
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 4px 12px ${alpha(brandColor, 0.15)}`
                                        }
                                    }}
                                    title='Expand'
                                    onClick={() => onExpandDialogClicked(data[inputParam.name] ?? inputParam.default ?? '', inputParam)}
                                >
                                    <IconArrowsMaximize size={18} />
                                </IconButton>
                            )}
                        </Stack>
                        {inputParam.warning && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    gap: 2,
                                    borderRadius: 3,
                                    background: alpha('#FFC107', 0.1),
                                    border: `1px solid ${alpha('#FFC107', 0.2)}`,
                                    padding: 2,
                                    mb: 2,
                                    color: '#B45309'
                                }}
                            >
                                <IconAlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                                <Typography variant="body2">{inputParam.warning}</Typography>
                            </Box>
                        )}

                        {inputParam.type === 'boolean' && (
                            <SwitchInput
                                disabled={disabled}
                                onChange={(newValue) => (data[inputParam.name] = newValue)}
                                value={data[inputParam.name] ?? inputParam.default ?? false}
                            />
                        )}
                        {(inputParam.type === 'string' || inputParam.type === 'password' || inputParam.type === 'number') && (
                            <Input
                                key={data[inputParam.name]}
                                disabled={disabled}
                                inputParam={inputParam}
                                onChange={(newValue) => (data[inputParam.name] = newValue)}
                                value={data[inputParam.name] ?? inputParam.default ?? ''}
                                showDialog={showExpandDialog}
                                dialogProps={expandDialogProps}
                                onDialogCancel={() => setShowExpandDialog(false)}
                                onDialogConfirm={(newValue, inputParamName) => onExpandDialogSave(newValue, inputParamName)}
                                sx={{ 
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha(brandColor, 0.2)
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha(brandColor, 0.3)
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: brandColor
                                    }
                                }}
                            />
                        )}
                        {inputParam.type === 'json' && (
                            <JsonEditorInput
                                disabled={disabled}
                                onChange={(newValue) => (data[inputParam.name] = newValue)}
                                value={data[inputParam.name] ?? inputParam.default ?? ''}
                                isDarkMode={customization.isDarkMode}
                            />
                        )}
                        {inputParam.type === 'options' && (
                            <Dropdown
                                disabled={disabled}
                                name={inputParam.name}
                                options={inputParam.options}
                                onSelect={(newValue) => (data[inputParam.name] = newValue)}
                                value={data[inputParam.name] ?? inputParam.default ?? 'choose an option'}
                                sx={{ 
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha(brandColor, 0.2)
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha(brandColor, 0.3)
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: brandColor
                                    }
                                }}
                            />
                        )}
                    </Box>
                </>
            )}
        </div>
    )
}

CredentialInputHandler.propTypes = {
    inputAnchor: PropTypes.object,
    inputParam: PropTypes.object,
    data: PropTypes.object,
    disabled: PropTypes.bool
}

export default CredentialInputHandler
