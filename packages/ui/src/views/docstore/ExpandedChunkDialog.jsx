import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import ReactJson from 'flowise-react-json-view'
import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from '@/store/actions'

// Material
import { 
    Button, 
    Dialog, 
    IconButton, 
    DialogContent, 
    DialogTitle, 
    Typography, 
    Box, 
    Stack, 
    Chip,
    alpha,
    Divider
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { IconEdit, IconTrash, IconX, IconLanguage, IconFileText, IconCode, IconJson, IconDeviceFloppy, IconArrowBackUp } from '@tabler/icons-react'

// Project imports
import { CodeEditor } from '@/ui-component/editor/CodeEditor'

const brandColor = '#2b63d9'

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: 16,
        boxShadow: `0 10px 40px ${alpha(brandColor, 0.2)}`,
        overflow: 'hidden'
    }
}))

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    background: `linear-gradient(135deg, ${brandColor} 0%, ${alpha(brandColor, 0.8)} 100%)`,
    color: 'white',
    padding: '16px 24px',
    fontSize: '1.25rem',
    fontWeight: 600,
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, ${alpha('#fff', 0.2)} 0%, transparent 100%)`
    }
}))

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: 8,
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
        boxShadow: `0 4px 12px ${alpha(brandColor, 0.2)}`
    }
}))

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    borderRadius: 8,
    padding: 8,
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1)
    }
}))

const ExpandedChunkDialog = ({ show, dialogProps, onCancel, onChunkEdit, onDeleteChunk, isReadOnly }) => {
    const portalElement = document.getElementById('portal')

    const customization = useSelector((state) => state.customization)
    const dispatch = useDispatch()

    const [selectedChunk, setSelectedChunk] = useState()
    const [selectedChunkNumber, setSelectedChunkNumber] = useState()
    const [isEdit, setIsEdit] = useState(false)
    const [contentValue, setContentValue] = useState('')
    const [metadata, setMetadata] = useState({})

    const onClipboardCopy = (e) => {
        const src = e.src
        if (Array.isArray(src) || typeof src === 'object') {
            navigator.clipboard.writeText(JSON.stringify(src, null, '  '))
        } else {
            navigator.clipboard.writeText(src)
        }
    }

    const onEditCancel = () => {
        setContentValue(selectedChunk?.pageContent)
        setMetadata(selectedChunk?.metadata ? JSON.parse(selectedChunk?.metadata) : {})
        setIsEdit(false)
    }

    const onEditSaved = () => {
        onChunkEdit(contentValue, metadata, selectedChunk)
    }

    useEffect(() => {
        if (dialogProps.data) {
            setSelectedChunk(dialogProps.data?.selectedChunk)
            setContentValue(dialogProps.data?.selectedChunk?.pageContent)
            setSelectedChunkNumber(dialogProps?.data.selectedChunkNumber)
            if (dialogProps.data?.selectedChunk?.metadata) {
                if (typeof dialogProps.data?.selectedChunk?.metadata === 'string') {
                    setMetadata(JSON.parse(dialogProps.data?.selectedChunk?.metadata))
                } else if (typeof dialogProps.data?.selectedChunk?.metadata === 'object') {
                    setMetadata(dialogProps.data?.selectedChunk?.metadata)
                }
            }
        }
        return () => {
            setSelectedChunk()
            setSelectedChunkNumber()
            setContentValue('')
            setMetadata({})
            setIsEdit(false)
        }
    }, [dialogProps])

    useEffect(() => {
        if (show) dispatch({ type: SHOW_CANVAS_DIALOG })
        else dispatch({ type: HIDE_CANVAS_DIALOG })
        return () => dispatch({ type: HIDE_CANVAS_DIALOG })
    }, [show, dispatch])

    const component = show ? (
        <StyledDialog
            fullWidth
            maxWidth='md'
            open={show}
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <StyledDialogTitle id='alert-dialog-title'>
                {selectedChunk && selectedChunkNumber && (
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    borderRadius: '12px',
                                    width: 40,
                                    height: 40,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                <IconFileText size={20} style={{ color: '#fff' }} />
                            </Box>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                                Chunk #{selectedChunkNumber}
                            </Typography>
                        </Stack>
                        
                        <Stack direction="row" spacing={1}>
                            {!isEdit && !isReadOnly && (
                                <StyledButton
                                    onClick={() => setIsEdit(true)}
                                    startIcon={<IconEdit size={18} />}
                                    variant="contained"
                                    color="primary"
                                    title='Edit Chunk'
                                    sx={{ 
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.25)'
                                        }
                                    }}
                                >
                                    Edit
                                </StyledButton>
                            )}
                            {isEdit && !isReadOnly && (
                                <StyledButton
                                    onClick={() => onEditCancel()}
                                    startIcon={<IconArrowBackUp size={18} />}
                                    variant="text"
                                    title='Cancel'
                                    sx={{ 
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    Cancel
                                </StyledButton>
                            )}
                            {isEdit && !isReadOnly && (
                                <StyledButton
                                    onClick={() => onEditSaved(true)}
                                    startIcon={<IconDeviceFloppy size={18} />}
                                    variant="contained"
                                    title='Save'
                                    sx={{ 
                                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.35)'
                                        }
                                    }}
                                >
                                    Save
                                </StyledButton>
                            )}
                            {!isEdit && !isReadOnly && (
                                <StyledIconButton
                                    onClick={() => onDeleteChunk(selectedChunk)}
                                    size='small'
                                    title='Delete Chunk'
                                    sx={{ 
                                        color: '#ff5252',
                                        backgroundColor: 'rgba(255, 82, 82, 0.1)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 82, 82, 0.2)'
                                        }
                                    }}
                                >
                                    <IconTrash size={18} />
                                </StyledIconButton>
                            )}
                            <StyledIconButton
                                onClick={onCancel}
                                size='small'
                                title='Close'
                                sx={{ 
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                <IconX size={18} />
                            </StyledIconButton>
                        </Stack>
                    </Stack>
                )}
            </StyledDialogTitle>
            <DialogContent sx={{ p: 3 }}>
                {selectedChunk && selectedChunkNumber && (
                    <Stack spacing={3}>
                        <Chip
                            icon={<IconLanguage size={16} />}
                            label={`${selectedChunk?.pageContent?.length} characters`}
                            sx={{
                                width: 'max-content',
                                borderRadius: '8px',
                                backgroundColor: alpha(brandColor, 0.1),
                                color: brandColor,
                                fontWeight: 500,
                                '& .MuiChip-icon': {
                                    color: brandColor
                                }
                            }}
                        />
                        
                        <Box sx={{ 
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: `0 4px 20px ${alpha(brandColor, 0.1)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: `0 8px 30px ${alpha(brandColor, 0.15)}`,
                                transform: 'translateY(-2px)'
                            }
                        }}>
                            <Box sx={{ 
                                p: 1.5, 
                                background: `linear-gradient(90deg, ${alpha(brandColor, 0.8)} 0%, ${alpha(brandColor, 0.6)} 100%)`,
                                borderBottom: `1px solid ${alpha(brandColor, 0.2)}`,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Box
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        borderRadius: '8px',
                                        width: 28,
                                        height: 28,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        mr: 1.5
                                    }}
                                >
                                    <IconCode size={16} style={{ color: 'white' }} />
                                </Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
                                    Content
                                </Typography>
                            </Box>
                            <Box sx={{ 
                                border: `1px solid ${alpha(brandColor, 0.2)}`,
                                borderTop: 'none',
                                borderRadius: '0 0 8px 8px'
                            }}>
                                {!isEdit && (
                                    <CodeEditor
                                        disabled={true}
                                        height='max-content'
                                        value={contentValue}
                                        theme={customization.isDarkMode ? 'dark' : 'light'}
                                        basicSetup={{
                                            lineNumbers: false,
                                            foldGutter: false,
                                            autocompletion: false,
                                            highlightActiveLine: false
                                        }}
                                    />
                                )}
                                {isEdit && (
                                    <CodeEditor
                                        disabled={false}
                                        // eslint-disable-next-line
                                        autoFocus={true}
                                        height='max-content'
                                        value={contentValue}
                                        theme={customization.isDarkMode ? 'dark' : 'light'}
                                        basicSetup={{
                                            lineNumbers: false,
                                            foldGutter: false,
                                            autocompletion: false,
                                            highlightActiveLine: false
                                        }}
                                        onValueChange={(text) => setContentValue(text)}
                                    />
                                )}
                            </Box>
                        </Box>
                        
                        <Box sx={{ 
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: `0 4px 20px ${alpha(brandColor, 0.1)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: `0 8px 30px ${alpha(brandColor, 0.15)}`,
                                transform: 'translateY(-2px)'
                            }
                        }}>
                            <Box sx={{ 
                                p: 1.5, 
                                background: `linear-gradient(90deg, ${alpha(brandColor, 0.8)} 0%, ${alpha(brandColor, 0.6)} 100%)`,
                                borderBottom: `1px solid ${alpha(brandColor, 0.2)}`,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Box
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        borderRadius: '8px',
                                        width: 28,
                                        height: 28,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        mr: 1.5
                                    }}
                                >
                                    <IconJson size={16} style={{ color: 'white' }} />
                                </Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
                                    Metadata
                                </Typography>
                            </Box>
                            <Box sx={{ 
                                border: `1px solid ${alpha(brandColor, 0.2)}`,
                                borderTop: 'none',
                                borderRadius: '0 0 8px 8px'
                            }}>
                                {!isEdit && (
                                    <ReactJson
                                        theme={customization.isDarkMode ? 'ocean' : 'rjv-default'}
                                        src={metadata}
                                        style={{ padding: '16px' }}
                                        name={null}
                                        quotesOnKeys={false}
                                        enableClipboard={false}
                                        displayDataTypes={false}
                                        collapsed={1}
                                    />
                                )}
                                {isEdit && (
                                    <ReactJson
                                        theme={customization.isDarkMode ? 'ocean' : 'rjv-default'}
                                        src={metadata}
                                        style={{ padding: '16px' }}
                                        name={null}
                                        quotesOnKeys={false}
                                        displayDataTypes={false}
                                        enableClipboard={(e) => onClipboardCopy(e)}
                                        onEdit={(edit) => {
                                            setMetadata(edit.updated_src)
                                        }}
                                        onAdd={() => {
                                            //console.log(add)
                                        }}
                                        onDelete={(deleteobj) => {
                                            setMetadata(deleteobj.updated_src)
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Stack>
                )}
            </DialogContent>
        </StyledDialog>
    ) : null

    return createPortal(component, portalElement)
}

ExpandedChunkDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onChunkEdit: PropTypes.func,
    onDeleteChunk: PropTypes.func,
    isReadOnly: PropTypes.bool
}

export default ExpandedChunkDialog
