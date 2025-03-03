import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from '@/store/actions'
import { cloneDeep } from 'lodash'

import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Stack, OutlinedInput, alpha } from '@mui/material'
import { StyledButton } from '@/ui-component/button/StyledButton'
import { Grid } from '@/ui-component/grid/Grid'
import { TooltipWithParser } from '@/ui-component/tooltip/TooltipWithParser'
import { GridActionsCellItem } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import { CodeEditor } from '@/ui-component/editor/CodeEditor'
import HowToUseFunctionDialog from './HowToUseFunctionDialog'

// Icons
import { IconX, IconFileDownload, IconPlus, IconTemplate, IconDeviceFloppy, IconTrash, IconTool } from '@tabler/icons-react'

// API
import toolsApi from '@/api/tools'

// Hooks
import useConfirm from '@/hooks/useConfirm'
import useApi from '@/hooks/useApi'

// utils
import useNotifier from '@/utils/useNotifier'
import { generateRandomGradient, formatDataGridRows } from '@/utils/genericHelper'
import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from '@/store/actions'
import ExportAsTemplateDialog from '@/ui-component/dialog/ExportAsTemplateDialog'

const brandColor = '#2b63d9'

const SectionTitle = ({ title, description }) => (
    <Box sx={{ mb: 2 }}>
        <Typography 
            variant='subtitle2'
            sx={{
                color: 'rgb(100, 116, 139)',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 1
            }}
        >
            {title}
        </Typography>
        {description && (
            <Typography 
                sx={{ 
                    color: 'rgb(100, 116, 139)',
                    fontSize: '0.875rem'
                }}
            >
                {description}
            </Typography>
        )}
    </Box>
)

const exampleAPIFunc = `/*
* You can use any libraries imported in Flowise
* You can use properties specified in Input Schema as variables. Ex: Property = userid, Variable = $userid
* You can get default flow config: $flow.sessionId, $flow.chatId, $flow.chatflowId, $flow.input, $flow.state
* You can get custom variables: $vars.<variable-name>
* Must return a string value at the end of function
*/

const fetch = require('node-fetch');
const url = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true';
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};
try {
    const response = await fetch(url, options);
    const text = await response.text();
    return text;
} catch (error) {
    console.error(error);
    return '';
}`

const ToolDialog = ({ show, dialogProps, onUseTemplate, onCancel, onConfirm, setError }) => {
    const portalElement = document.getElementById('portal')

    const customization = useSelector((state) => state.customization)
    const dispatch = useDispatch()

    useNotifier()
    const { confirm } = useConfirm()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const getSpecificToolApi = useApi(toolsApi.getSpecificTool)

    const [toolId, setToolId] = useState('')
    const [toolName, setToolName] = useState('')
    const [toolDesc, setToolDesc] = useState('')
    const [toolIcon, setToolIcon] = useState('')
    const [toolSchema, setToolSchema] = useState([])
    const [toolFunc, setToolFunc] = useState('')
    const [showHowToDialog, setShowHowToDialog] = useState(false)

    const [exportAsTemplateDialogOpen, setExportAsTemplateDialogOpen] = useState(false)
    const [exportAsTemplateDialogProps, setExportAsTemplateDialogProps] = useState({})

    const deleteItem = useCallback(
        (id) => () => {
            setTimeout(() => {
                setToolSchema((prevRows) => prevRows.filter((row) => row.id !== id))
            })
        },
        []
    )

    const addNewRow = () => {
        setTimeout(() => {
            setToolSchema((prevRows) => {
                let allRows = [...cloneDeep(prevRows)]
                const lastRowId = allRows.length ? allRows[allRows.length - 1].id + 1 : 1
                allRows.push({
                    id: lastRowId,
                    property: '',
                    description: '',
                    type: '',
                    required: false
                })
                return allRows
            })
        })
    }

    const onSaveAsTemplate = () => {
        setExportAsTemplateDialogProps({
            title: 'Export As Template',
            tool: {
                name: toolName,
                description: toolDesc,
                iconSrc: toolIcon,
                schema: toolSchema,
                func: toolFunc
            }
        })
        setExportAsTemplateDialogOpen(true)
    }

    const onRowUpdate = (newRow) => {
        setTimeout(() => {
            setToolSchema((prevRows) => {
                let allRows = [...cloneDeep(prevRows)]
                const indexToUpdate = allRows.findIndex((row) => row.id === newRow.id)
                if (indexToUpdate >= 0) {
                    allRows[indexToUpdate] = { ...newRow }
                }
                return allRows
            })
        })
    }

    const columns = useMemo(
        () => [
            { field: 'property', headerName: 'Property', editable: true, flex: 1 },
            {
                field: 'type',
                headerName: 'Type',
                type: 'singleSelect',
                valueOptions: ['string', 'number', 'boolean', 'date'],
                editable: true,
                width: 120
            },
            { field: 'description', headerName: 'Description', editable: true, flex: 1 },
            { field: 'required', headerName: 'Required', type: 'boolean', editable: true, width: 80 },
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => [
                    <GridActionsCellItem key={'Delete'} icon={<DeleteIcon />} label='Delete' onClick={deleteItem(params.id)} />
                ]
            }
        ],
        [deleteItem]
    )

    useEffect(() => {
        if (show) dispatch({ type: SHOW_CANVAS_DIALOG })
        else dispatch({ type: HIDE_CANVAS_DIALOG })
        return () => dispatch({ type: HIDE_CANVAS_DIALOG })
    }, [show, dispatch])

    useEffect(() => {
        if (getSpecificToolApi.data) {
            setToolId(getSpecificToolApi.data.id)
            setToolName(getSpecificToolApi.data.name)
            setToolDesc(getSpecificToolApi.data.description)
            setToolSchema(formatDataGridRows(getSpecificToolApi.data.schema))
            if (getSpecificToolApi.data.func) setToolFunc(getSpecificToolApi.data.func)
            else setToolFunc('')
        }
    }, [getSpecificToolApi.data])

    useEffect(() => {
        if (getSpecificToolApi.error && setError) {
            setError(getSpecificToolApi.error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificToolApi.error])

    useEffect(() => {
        if (dialogProps.type === 'EDIT' && dialogProps.data) {
            // When tool dialog is opened from Tools dashboard
            setToolId(dialogProps.data.id)
            setToolName(dialogProps.data.name)
            setToolDesc(dialogProps.data.description)
            setToolIcon(dialogProps.data.iconSrc)
            setToolSchema(formatDataGridRows(dialogProps.data.schema))
            if (dialogProps.data.func) setToolFunc(dialogProps.data.func)
            else setToolFunc('')
        } else if (dialogProps.type === 'EDIT' && dialogProps.toolId) {
            // When tool dialog is opened from CustomTool node in canvas
            getSpecificToolApi.request(dialogProps.toolId)
        } else if (dialogProps.type === 'IMPORT' && dialogProps.data) {
            // When tool dialog is to import existing tool
            setToolName(dialogProps.data.name)
            setToolDesc(dialogProps.data.description)
            setToolIcon(dialogProps.data.iconSrc)
            setToolSchema(formatDataGridRows(dialogProps.data.schema))
            if (dialogProps.data.func) setToolFunc(dialogProps.data.func)
            else setToolFunc('')
        } else if (dialogProps.type === 'TEMPLATE' && dialogProps.data) {
            // When tool dialog is a template
            setToolName(dialogProps.data.name)
            setToolDesc(dialogProps.data.description)
            setToolIcon(dialogProps.data.iconSrc)
            setToolSchema(formatDataGridRows(dialogProps.data.schema))
            if (dialogProps.data.func) setToolFunc(dialogProps.data.func)
            else setToolFunc('')
        } else if (dialogProps.type === 'ADD') {
            // When tool dialog is to add a new tool
            setToolId('')
            setToolName('')
            setToolDesc('')
            setToolIcon('')
            setToolSchema([])
            setToolFunc('')
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dialogProps])

    const useToolTemplate = () => {
        onUseTemplate(dialogProps.data)
    }

    const exportTool = async () => {
        try {
            const toolResp = await toolsApi.getSpecificTool(toolId)
            if (toolResp.data) {
                const toolData = toolResp.data
                delete toolData.id
                delete toolData.createdDate
                delete toolData.updatedDate
                let dataStr = JSON.stringify(toolData, null, 2)
                const blob = new Blob([dataStr], { type: 'application/json' })
                const dataUri = URL.createObjectURL(blob)

                let exportFileDefaultName = `${toolName}-CustomTool.json`

                let linkElement = document.createElement('a')
                linkElement.setAttribute('href', dataUri)
                linkElement.setAttribute('download', exportFileDefaultName)
                linkElement.click()
            }
        } catch (error) {
            enqueueSnackbar({
                message: `Failed to export Tool: ${
                    typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                }`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
            onCancel()
        }
    }

    const addNewTool = async () => {
        try {
            const obj = {
                name: toolName,
                description: toolDesc,
                color: generateRandomGradient(),
                schema: JSON.stringify(toolSchema),
                func: toolFunc,
                iconSrc: toolIcon
            }
            const createResp = await toolsApi.createNewTool(obj)
            if (createResp.data) {
                enqueueSnackbar({
                    message: 'New Tool added',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                onConfirm(createResp.data.id)
            }
        } catch (error) {
            enqueueSnackbar({
                message: `Failed to add new Tool: ${
                    typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                }`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
            onCancel()
        }
    }

    const saveTool = async () => {
        try {
            const saveResp = await toolsApi.updateTool(toolId, {
                name: toolName,
                description: toolDesc,
                schema: JSON.stringify(toolSchema),
                func: toolFunc,
                iconSrc: toolIcon
            })
            if (saveResp.data) {
                enqueueSnackbar({
                    message: 'Tool saved',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                onConfirm(saveResp.data.id)
            }
        } catch (error) {
            enqueueSnackbar({
                message: `Failed to save Tool: ${
                    typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                }`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
            onCancel()
        }
    }

    const deleteTool = async () => {
        const confirmPayload = {
            title: `Delete Tool`,
            description: `Delete tool ${toolName}?`,
            confirmButtonName: 'Delete',
            cancelButtonName: 'Cancel'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                const delResp = await toolsApi.deleteTool(toolId)
                if (delResp.data) {
                    enqueueSnackbar({
                        message: 'Tool deleted',
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success',
                            action: (key) => (
                                <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                    <IconX />
                                </Button>
                            )
                        }
                    })
                    onConfirm()
                }
            } catch (error) {
                enqueueSnackbar({
                    message: `Failed to delete Tool: ${
                        typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                    }`,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                onCancel()
            }
        }
    }

    const component = show ? (
        <Dialog
            fullWidth
            maxWidth='md'
            open={show}
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: `0 8px 40px ${alpha(brandColor, 0.1)}`,
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle 
                sx={{ 
                    p: 3, 
                    borderBottom: `1px solid ${alpha(brandColor, 0.1)}` 
                }} 
                id='alert-dialog-title'
            >
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '12px',
                                backgroundColor: alpha(brandColor, 0.05),
                                border: `1px solid ${alpha(brandColor, 0.1)}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px) scale(1.05)',
                                    boxShadow: `0 6px 16px ${alpha(brandColor, 0.12)}`,
                                    backgroundColor: alpha(brandColor, 0.08)
                                }
                            }}
                        >
                            <IconTool size={24} color={brandColor} />
                        </Box>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: 'rgb(51, 65, 85)',
                                fontSize: '1.25rem',
                                fontWeight: 600
                            }}
                        >
                            {dialogProps.title}
                        </Typography>
                    </Stack>
                    <Box>
                        {dialogProps.type === 'EDIT' && (
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant='outlined'
                                    onClick={onSaveAsTemplate}
                                    startIcon={<IconTemplate size={18} />}
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
                                    Save As Template
                                </Button>
                                <Button 
                                    variant='outlined' 
                                    onClick={exportTool} 
                                    startIcon={<IconFileDownload size={18} />}
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
                                    Export
                                </Button>
                            </Stack>
                        )}
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <Stack spacing={4} sx={{ p: 3 }}>
                    <Box>
                        <SectionTitle 
                            title="Tool Name" 
                            description="Tool name must be small capital letter with underscore. Ex: my_tool"
                        />
                        <OutlinedInput
                            id='toolName'
                            type='string'
                            fullWidth
                            disabled={dialogProps.type === 'TEMPLATE'}
                            placeholder='My New Tool'
                            value={toolName}
                            name='toolName'
                            onChange={(e) => setToolName(e.target.value)}
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
                    </Box>

                    <Box>
                        <SectionTitle 
                            title="Tool Description" 
                            description="Description of what the tool does. This is for ChatGPT to determine when to use this tool."
                        />
                        <OutlinedInput
                            id='toolDesc'
                            type='string'
                            fullWidth
                            disabled={dialogProps.type === 'TEMPLATE'}
                            placeholder='Description of what the tool does...'
                            multiline={true}
                            rows={3}
                            value={toolDesc}
                            name='toolDesc'
                            onChange={(e) => setToolDesc(e.target.value)}
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
                    </Box>

                    <Box>
                        <SectionTitle 
                            title="Tool Icon Source" 
                            description="URL to the tool's icon image"
                        />
                        <OutlinedInput
                            id='toolIcon'
                            type='string'
                            fullWidth
                            disabled={dialogProps.type === 'TEMPLATE'}
                            placeholder='https://raw.githubusercontent.com/gilbarbara/logos/main/logos/airtable.svg'
                            value={toolIcon}
                            name='toolIcon'
                            onChange={(e) => setToolIcon(e.target.value)}
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
                    </Box>

                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <SectionTitle 
                                title="Input Schema" 
                                description="What is the input format in JSON?"
                            />
                            {dialogProps.type !== 'TEMPLATE' && (
                                <Button 
                                    variant='outlined' 
                                    onClick={addNewRow} 
                                    startIcon={<IconPlus size={18} />}
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
                                    Add Item
                                </Button>
                            )}
                        </Box>
                        <Box 
                            sx={{ 
                                border: `1px solid ${alpha(brandColor, 0.1)}`,
                                borderRadius: 3,
                                overflow: 'hidden'
                            }}
                        >
                            <Grid columns={columns} rows={toolSchema} disabled={dialogProps.type === 'TEMPLATE'} onRowUpdate={onRowUpdate} />
                        </Box>
                    </Box>

                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <SectionTitle 
                                title="Javascript Function" 
                                description="Function to execute when tool is being used"
                            />
                            <Stack direction='row' spacing={1}>
                                <Button
                                    variant='text'
                                    onClick={() => setShowHowToDialog(true)}
                                    sx={{
                                        color: alpha(brandColor, 0.8),
                                        '&:hover': {
                                            backgroundColor: alpha(brandColor, 0.05),
                                            color: brandColor
                                        }
                                    }}
                                >
                                    How to use Function
                                </Button>
                                {dialogProps.type !== 'TEMPLATE' && (
                                    <Button 
                                        variant='outlined' 
                                        onClick={() => setToolFunc(exampleAPIFunc)}
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
                                        See Example
                                    </Button>
                                )}
                            </Stack>
                        </Box>
                        <Box 
                            sx={{ 
                                border: `1px solid ${alpha(brandColor, 0.1)}`,
                                borderRadius: 3,
                                overflow: 'hidden'
                            }}
                        >
                            <CodeEditor
                                disabled={dialogProps.type === 'TEMPLATE'}
                                value={toolFunc}
                                theme={customization.isDarkMode ? 'dark' : 'light'}
                                lang={'js'}
                                onValueChange={(code) => setToolFunc(code)}
                            />
                        </Box>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2, borderTop: `1px solid ${alpha(brandColor, 0.1)}` }}>
                {dialogProps.type === 'EDIT' && (
                    <Button 
                        color='error' 
                        variant='contained'
                        startIcon={<IconTrash size={18} />}
                        onClick={() => deleteTool()}
                        sx={{
                            borderRadius: 2,
                            backgroundColor: '#EF4444',
                            '&:hover': {
                                backgroundColor: '#DC2626'
                            }
                        }}
                    >
                        Delete
                    </Button>
                )}
                <Box sx={{ flexGrow: 1 }} />
                <Button 
                    variant="outlined"
                    onClick={onCancel}
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
                    Cancel
                </Button>
                {dialogProps.type === 'TEMPLATE' ? (
                    <StyledButton 
                        color='secondary' 
                        variant='contained'
                        onClick={useToolTemplate}
                        sx={{
                            borderRadius: 2,
                            backgroundColor: brandColor,
                            '&:hover': {
                                backgroundColor: alpha(brandColor, 0.9)
                            }
                        }}
                    >
                        Use Template
                    </StyledButton>
                ) : (
                    <StyledButton
                        disabled={!(toolName && toolDesc)}
                        variant='contained'
                        startIcon={dialogProps.type === 'ADD' || dialogProps.type === 'IMPORT' ? <IconPlus size={18} /> : <IconDeviceFloppy size={18} />}
                        onClick={() => (dialogProps.type === 'ADD' || dialogProps.type === 'IMPORT' ? addNewTool() : saveTool())}
                        sx={{
                            borderRadius: 2,
                            backgroundColor: brandColor,
                            '&:hover': {
                                backgroundColor: alpha(brandColor, 0.9)
                            }
                        }}
                    >
                        {dialogProps.confirmButtonName}
                    </StyledButton>
                )}
            </DialogActions>
            <ConfirmDialog />
            {exportAsTemplateDialogOpen && (
                <ExportAsTemplateDialog
                    show={exportAsTemplateDialogOpen}
                    dialogProps={exportAsTemplateDialogProps}
                    onCancel={() => setExportAsTemplateDialogOpen(false)}
                />
            )}
            <HowToUseFunctionDialog show={showHowToDialog} onCancel={() => setShowHowToDialog(false)} />
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

ToolDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onUseTemplate: PropTypes.func,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    setError: PropTypes.func
}

export default ToolDialog
