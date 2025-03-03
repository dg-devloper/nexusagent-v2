import PropTypes from 'prop-types'
import { Handle, Position, useUpdateNodeInternals } from 'reactflow'
import { useEffect, useRef, useState, useContext } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material'
import IconAutoFixHigh from '@mui/icons-material/AutoFixHigh'
import { useGridApiContext } from '@mui/x-data-grid'
import { Tabs } from '@mui/base/Tabs'
import Autocomplete from '@mui/material/Autocomplete'

// project imports
import { Dropdown } from '@/ui-component/dropdown/Dropdown'
import { MultiDropdown } from '@/ui-component/dropdown/MultiDropdown'
import { AsyncDropdown } from '@/ui-component/dropdown/AsyncDropdown'
import { Input } from '@/ui-component/input/Input'
import { DataGrid } from '@/ui-component/grid/DataGrid'
import { File } from '@/ui-component/file/File'
import { SwitchInput } from '@/ui-component/switch/Switch'
import { flowContext } from '@/store/context/ReactFlowContext'
import { JsonEditorInput } from '@/ui-component/json/JsonEditor'
import { TooltipWithParser } from '@/ui-component/tooltip/TooltipWithParser'
import { CodeEditor } from '@/ui-component/editor/CodeEditor'
import { TabPanel } from '@/ui-component/tabs/TabPanel'
import { TabsList } from '@/ui-component/tabs/TabsList'
import { Tab } from '@/ui-component/tabs/Tab'
import ToolDialog from '@/views/tools/ToolDialog'
import AssistantDialog from '@/views/assistants/openai/AssistantDialog'
import FormatPromptValuesDialog from '@/ui-component/dialog/FormatPromptValuesDialog'
import ExpandTextDialog from '@/ui-component/dialog/ExpandTextDialog'
import ConditionDialog from '@/ui-component/dialog/ConditionDialog'
import PromptLangsmithHubDialog from '@/ui-component/dialog/PromptLangsmithHubDialog'
import ManageScrapedLinksDialog from '@/ui-component/dialog/ManageScrapedLinksDialog'
import CredentialInputHandler from '@/views/canvas/CredentialInputHandler'
import InputHintDialog from '@/ui-component/dialog/InputHintDialog'

// icons
import { IconArrowsMaximize, IconEdit, IconAlertTriangle, IconBulb, IconRefresh } from '@tabler/icons-react'

// utils
import { getInputVariables, getCustomConditionOutputs, isValidConnection, getAvailableNodesForVariable } from '@/utils/genericHelper'

// const
import { FLOWISE_CREDENTIAL_ID } from '@/store/constant'

const EDITABLE_OPTIONS = ['selectedTool', 'selectedAssistant']

const ModernNodeInput = ({
    inputAnchor,
    inputParam,
    data,
    disabled = false,
    isAdditionalParams = false,
    disablePadding = false,
    onHideNodeInfoDialog
}) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const ref = useRef(null)
    const { reactFlowInstance, deleteEdge } = useContext(flowContext)
    const updateNodeInternals = useUpdateNodeInternals()
    const [position, setPosition] = useState(0)

    // Dialog states
    const [showExpandDialog, setShowExpandDialog] = useState(false)
    const [expandDialogProps, setExpandDialogProps] = useState({})
    const [showAsyncOptionDialog, setAsyncOptionEditDialog] = useState('')
    const [asyncOptionEditDialogProps, setAsyncOptionEditDialogProps] = useState({})
    const [reloadTimestamp, setReloadTimestamp] = useState(Date.now().toString())
    const [showFormatPromptValuesDialog, setShowFormatPromptValuesDialog] = useState(false)
    const [formatPromptValuesDialogProps, setFormatPromptValuesDialogProps] = useState({})
    const [showPromptHubDialog, setShowPromptHubDialog] = useState(false)
    const [showManageScrapedLinksDialog, setShowManageScrapedLinksDialog] = useState(false)
    const [manageScrapedLinksDialogProps, setManageScrapedLinksDialogProps] = useState({})
    const [showInputHintDialog, setShowInputHintDialog] = useState(false)
    const [inputHintDialogProps, setInputHintDialogProps] = useState({})
    const [showConditionDialog, setShowConditionDialog] = useState(false)
    const [conditionDialogProps, setConditionDialogProps] = useState({})
    const [tabValue, setTabValue] = useState(0)

    const onInputHintDialogClicked = (hint) => {
        setInputHintDialogProps({ ...hint })
        setShowInputHintDialog(true)
    }

    const onExpandDialogClicked = (value, inputParam, languageType) => {
        setExpandDialogProps({
            value,
            inputParam,
            disabled,
            languageType,
            confirmButtonName: 'Save',
            cancelButtonName: 'Cancel'
        })
        setShowExpandDialog(true)
    }

    const onConditionDialogClicked = (inputParam) => {
        setConditionDialogProps({
            data,
            inputParam,
            disabled,
            confirmButtonName: 'Save',
            cancelButtonName: 'Cancel'
        })
        setShowConditionDialog(true)
        onHideNodeInfoDialog(true)
    }

    const onShowPromptHubButtonClicked = () => {
        setShowPromptHubDialog(true)
    }

    const onShowPromptHubButtonSubmit = (templates) => {
        setShowPromptHubDialog(false)
        for (const t of templates) {
            if (Object.prototype.hasOwnProperty.call(data.inputs, t.type)) {
                data.inputs[t.type] = t.template
            }
        }
    }

    const onManageLinksDialogClicked = (url, selectedLinks, relativeLinksMethod, limit) => {
        setManageScrapedLinksDialogProps({
            url,
            relativeLinksMethod,
            limit,
            selectedLinks,
            confirmButtonName: 'Save',
            cancelButtonName: 'Cancel'
        })
        setShowManageScrapedLinksDialog(true)
    }

    const onManageLinksDialogSave = (url, links) => {
        setShowManageScrapedLinksDialog(false)
        data.inputs.url = url
        data.inputs.selectedLinks = links
    }

    const getJSONValue = (templateValue) => {
        if (!templateValue) return ''
        const obj = {}
        const inputVariables = getInputVariables(templateValue)
        for (const inputVariable of inputVariables) {
            obj[inputVariable] = ''
        }
        if (Object.keys(obj).length) return JSON.stringify(obj)
        return ''
    }

    const getDataGridColDef = (columns, inputParam) => {
        const colDef = []
        for (const column of columns) {
            const stateNode = reactFlowInstance ? reactFlowInstance.getNodes().find((node) => node.data.name === 'seqState') : null
            if (column.type === 'asyncSingleSelect' && column.loadMethod && column.loadMethod.includes('loadStateKeys')) {
                if (stateNode) {
                    const tabParam = stateNode.data.inputParams.find((param) => param.tabIdentifier)
                    if (tabParam && tabParam.tabs.length > 0) {
                        const selectedTabIdentifier = tabParam.tabIdentifier
                        const selectedTab =
                            stateNode.data.inputs[`${selectedTabIdentifier}_${stateNode.data.id}`] ||
                            tabParam.default ||
                            tabParam.tabs[0].name
                        const datagridValues = stateNode.data.inputs[selectedTab]
                        if (datagridValues) {
                            try {
                                const parsedDatagridValues = JSON.parse(datagridValues)
                                const keys = Array.isArray(parsedDatagridValues)
                                    ? parsedDatagridValues.map((item) => item.key)
                                    : Object.keys(parsedDatagridValues)
                                colDef.push({
                                    ...column,
                                    field: column.field,
                                    headerName: column.headerName,
                                    type: 'singleSelect',
                                    editable: true,
                                    valueOptions: keys
                                })
                            } catch (error) {
                                console.error('Error parsing stateMemory', error)
                            }
                        }
                    }
                } else {
                    colDef.push({
                        ...column,
                        field: column.field,
                        headerName: column.headerName,
                        type: 'singleSelect',
                        editable: true,
                        valueOptions: []
                    })
                }
            } else if (column.type === 'freeSolo') {
                const preLoadOptions = []
                if (column.loadMethod && column.loadMethod.includes('getPreviousMessages')) {
                    const nodes = getAvailableNodesForVariable(
                        reactFlowInstance?.getNodes() || [],
                        reactFlowInstance?.getEdges() || [],
                        data.id,
                        inputParam.id
                    )
                    for (const node of nodes) {
                        preLoadOptions.push({
                            value: `$${node.id}`,
                            label: `Output from ${node.data.id}`
                        })
                    }
                }
                if (column.loadMethod && column.loadMethod.includes('loadStateKeys')) {
                    if (stateNode) {
                        const tabParam = stateNode.data.inputParams.find((param) => param.tabIdentifier)
                        if (tabParam && tabParam.tabs.length > 0) {
                            const selectedTabIdentifier = tabParam.tabIdentifier
                            const selectedTab =
                                stateNode.data.inputs[`${selectedTabIdentifier}_${stateNode.data.id}`] ||
                                tabParam.default ||
                                tabParam.tabs[0].name
                            const datagridValues = stateNode.data.inputs[selectedTab]
                            if (datagridValues) {
                                try {
                                    const parsedDatagridValues = JSON.parse(datagridValues)
                                    const keys = Array.isArray(parsedDatagridValues)
                                        ? parsedDatagridValues.map((item) => item.key)
                                        : Object.keys(parsedDatagridValues)
                                    for (const key of keys) {
                                        preLoadOptions.push({
                                            value: `$flow.state.${key}`,
                                            label: `Value from ${key}`
                                        })
                                    }
                                } catch (error) {
                                    console.error('Error parsing stateMemory', error)
                                }
                            }
                        }
                    }
                }
                colDef.push({
                    ...column,
                    field: column.field,
                    headerName: column.headerName,
                    renderEditCell: ({ id, field, value }) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const apiRef = useGridApiContext()
                        return (
                            <Autocomplete
                                id={column.field}
                                freeSolo
                                fullWidth
                                options={[...preLoadOptions, ...column.valueOptions]}
                                value={value}
                                renderInput={(params) => <TextField {...params} />}
                                renderOption={(props, option) => (
                                    <li {...props}>
                                        <div>
                                            <strong>{option.value}</strong>
                                            <br />
                                            <small>{option.label}</small>
                                        </div>
                                    </li>
                                )}
                                getOptionLabel={(option) => {
                                    return typeof option === 'string' ? option : option.value
                                }}
                                onInputChange={(event, newValue) => {
                                    apiRef.current.setEditCellValue({ id, field, value: newValue })
                                }}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        height: '50px'
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        border: 'none'
                                    },
                                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                        border: 'none'
                                    }
                                }}
                            />
                        )
                    }
                })
            } else {
                colDef.push(column)
            }
        }
        return colDef
    }

    const getTabValue = (inputParam) => {
        return inputParam.tabs.findIndex((item) => item.name === data.inputs[`${inputParam.tabIdentifier}_${data.id}`]) >= 0
            ? inputParam.tabs.findIndex((item) => item.name === data.inputs[`${inputParam.tabIdentifier}_${data.id}`])
            : tabValue
    }

    const onEditJSONClicked = (value, inputParam) => {
        let inputValue = value
        if (inputParam.name === 'promptValues' && !value) {
            const templateValue =
                (data.inputs['template'] ?? '') +
                (data.inputs['systemMessagePrompt'] ?? '') +
                (data.inputs['humanMessagePrompt'] ?? '') +
                (data.inputs['workerPrompt'] ?? '')
            inputValue = getJSONValue(templateValue)
        }
        setFormatPromptValuesDialogProps({
            value: inputValue,
            inputParam,
            nodes: reactFlowInstance?.getNodes() || [],
            edges: reactFlowInstance?.getEdges() || [],
            nodeId: data.id,
            data
        })
        setShowFormatPromptValuesDialog(true)
    }

    const onExpandDialogSave = (newValue, inputParamName) => {
        data.inputs[inputParamName] = newValue
        setShowExpandDialog(false)
    }

    const onConditionDialogSave = (newData, inputParam, tabValue) => {
        data.inputs[`${inputParam.tabIdentifier}_${data.id}`] = inputParam.tabs[tabValue].name

        const existingEdges = reactFlowInstance?.getEdges().filter((edge) => edge.source === data.id) || []
        const { outputAnchors, toBeRemovedEdgeIds } = getCustomConditionOutputs(
            newData.inputs[inputParam.tabs[tabValue].name],
            data.id,
            existingEdges,
            inputParam.tabs[tabValue].type === 'datagrid'
        )
        if (!outputAnchors) return
        data.outputAnchors = outputAnchors
        for (const edgeId of toBeRemovedEdgeIds) {
            deleteEdge(edgeId)
        }
        setShowConditionDialog(false)
        onHideNodeInfoDialog(false)
    }

    const editAsyncOption = (inputParamName, inputValue) => {
        if (inputParamName === 'selectedTool') {
            setAsyncOptionEditDialogProps({
                title: 'Edit Tool',
                type: 'EDIT',
                cancelButtonName: 'Cancel',
                confirmButtonName: 'Save',
                toolId: inputValue
            })
        } else if (inputParamName === 'selectedAssistant') {
            setAsyncOptionEditDialogProps({
                title: 'Edit Assistant',
                type: 'EDIT',
                cancelButtonName: 'Cancel',
                confirmButtonName: 'Save',
                assistantId: inputValue
            })
        }
        setAsyncOptionEditDialog(inputParamName)
    }

    const addAsyncOption = (inputParamName) => {
        if (inputParamName === 'selectedTool') {
            setAsyncOptionEditDialogProps({
                title: 'Add New Tool',
                type: 'ADD',
                cancelButtonName: 'Cancel',
                confirmButtonName: 'Add'
            })
        } else if (inputParamName === 'selectedAssistant') {
            setAsyncOptionEditDialogProps({
                title: 'Add New Assistant',
                type: 'ADD',
                cancelButtonName: 'Cancel',
                confirmButtonName: 'Add'
            })
        }
        setAsyncOptionEditDialog(inputParamName)
    }

    const onConfirmAsyncOption = (selectedOptionId = '') => {
        if (!selectedOptionId) {
            data.inputs[showAsyncOptionDialog] = ''
        } else {
            data.inputs[showAsyncOptionDialog] = selectedOptionId
            setReloadTimestamp(Date.now().toString())
        }
        setAsyncOptionEditDialogProps({})
        setAsyncOptionEditDialog('')
    }

    useEffect(() => {
        if (ref.current && ref.current.offsetTop && ref.current.clientHeight) {
            setPosition(ref.current.offsetTop + ref.current.clientHeight / 2)
            updateNodeInternals(data.id)
        }
    }, [data.id, ref, updateNodeInternals])

    useEffect(() => {
        updateNodeInternals(data.id)
    }, [data.id, position, updateNodeInternals])

    return (
        <div ref={ref} className="modern-node-input">
            {/* Input Anchor Handle */}
            {inputAnchor && (
                <>
                    <Tooltip title={inputAnchor.type} placement="left">
                        <Handle
                            type="target"
                            position={Position.Left}
                            key={inputAnchor.id}
                            id={inputAnchor.id}
                            isValidConnection={(connection) => isValidConnection(connection, reactFlowInstance)}
                            style={{
                                height: 10,
                                width: 10,
                                backgroundColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary,
                                top: position
                            }}
                        />
                    </Tooltip>
                    <Box className="modern-node-input-label">
                        <Typography>
                            {inputAnchor.label}
                            {!inputAnchor.optional && <span className="modern-node-input-required">*</span>}
                            {inputAnchor.description && (
                                <TooltipWithParser style={{ marginLeft: 10 }} title={inputAnchor.description} />
                            )}
                        </Typography>
                    </Box>
                </>
            )}

            {/* Input Parameter */}
            {((inputParam && !inputParam.additionalParams) || isAdditionalParams) && (
                <>
                    {/* Variable Input Handle */}
                    {inputParam.acceptVariable && !isAdditionalParams && (
                        <Tooltip title={inputParam.type} placement="left">
                            <Handle
                                type="target"
                                position={Position.Left}
                                key={inputParam.id}
                                id={inputParam.id}
                                isValidConnection={(connection) => isValidConnection(connection, reactFlowInstance)}
                                style={{
                                    height: 10,
                                    width: 10,
                                    backgroundColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary,
                                    top: position
                                }}
                            />
                        </Tooltip>
                    )}

                    <Box className="modern-node-input-content" sx={{ p: disablePadding ? 0 : 2 }}>
                        {/* LangChain Hub Integration */}
                        {(data.name === 'promptTemplate' || data.name === 'chatPromptTemplate') &&
                            (inputParam.name === 'template' || inputParam.name === 'systemMessagePrompt') && (
                                <>
                                    <Button
                                        className="modern-node-langchain-btn"
                                        disabled={disabled}
                                        onClick={onShowPromptHubButtonClicked}
                                        endIcon={<IconAutoFixHigh />}
                                    >
                                        Langchain Hub
                                    </Button>
                                    <PromptLangsmithHubDialog
                                        promptType={inputParam.name}
                                        show={showPromptHubDialog}
                                        onCancel={() => setShowPromptHubDialog(false)}
                                        onSubmit={onShowPromptHubButtonSubmit}
                                    />
                                </>
                            )}

                        {/* Input Label & Actions */}
                        <div className="modern-node-input-header">
                            <Typography>
                                {inputParam.label}
                                {!inputParam.optional && <span className="modern-node-input-required">*</span>}
                                {inputParam.description && (
                                    <TooltipWithParser style={{ marginLeft: 10 }} title={inputParam.description} />
                                )}
                            </Typography>
                            <div className="modern-node-input-actions">
                                {inputParam.hint && isAdditionalParams && (
                                    <Button
                                        className="modern-node-hint-btn"
                                        onClick={() => onInputHintDialogClicked(inputParam.hint)}
                                        startIcon={<IconBulb size={17} />}
                                    >
                                        {inputParam.hint.label}
                                    </Button>
                                )}
                                {((inputParam.type === 'string' && inputParam.rows) || inputParam.type === 'code') && (
                                    <IconButton
                                        className="modern-node-expand-btn"
                                        onClick={() =>
                                            onExpandDialogClicked(
                                                data.inputs[inputParam.name] ?? inputParam.default ?? '',
                                                inputParam
                                            )
                                        }
                                    >
                                        <IconArrowsMaximize />
                                    </IconButton>
                                )}
                            </div>
                        </div>

                        {/* Warning Message */}
                        {inputParam.warning && (
                            <div className="modern-node-warning-message">
                                <IconAlertTriangle size={30} />
                                <span>{inputParam.warning}</span>
                            </div>
                        )}

                        {/* Input Fields */}
                        {inputParam.type === 'credential' && (
                            <CredentialInputHandler
                                disabled={disabled}
                                data={data}
                                inputParam={inputParam}
                                onSelect={(newValue) => {
                                    data.credential = newValue
                                    data.inputs[FLOWISE_CREDENTIAL_ID] = newValue
                                }}
                            />
                        )}

                        {inputParam.type === 'tabs' && (
                            <>
                                <Tabs
                                    value={getTabValue(inputParam)}
                                    onChange={(event, val) => {
                                        setTabValue(val)
                                        data.inputs[`${inputParam.tabIdentifier}_${data.id}`] = inputParam.tabs[val].name
                                    }}
                                    aria-label="tabs"
                                    variant="fullWidth"
                                    defaultValue={getTabValue(inputParam)}
                                >
                                    <TabsList>
                                        {inputParam.tabs.map((inputChildParam, index) => (
                                            <Tab key={index}>{inputChildParam.label}</Tab>
                                        ))}
                                    </TabsList>
                                </Tabs>
                                {inputParam.tabs.map((inputChildParam, index) => (
                                    <TabPanel key={index} value={getTabValue(inputParam)} index={index}>
                                        <ModernNodeInput
                                            disabled={inputChildParam.disabled}
                                            inputParam={inputChildParam}
                                            data={data}
                                            isAdditionalParams={true}
                                            disablePadding={true}
                                        />
                                    </TabPanel>
                                ))}
                            </>
                        )}

                        {inputParam.type === 'file' && (
                            <File
                                disabled={disabled}
                                fileType={inputParam.fileType || '*'}
                                onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
                                value={data.inputs[inputParam.name] ?? inputParam.default ?? 'Choose a file to upload'}
                            />
                        )}

                        {inputParam.type === 'boolean' && (
                            <SwitchInput
                                disabled={disabled}
                                onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
                                value={data.inputs[inputParam.name] ?? inputParam.default ?? false}
                            />
                        )}

                        {inputParam.type === 'datagrid' && (
                            <DataGrid
                                disabled={disabled}
                                columns={getDataGridColDef(inputParam.datagrid, inputParam)}
                                hideFooter={true}
                                rows={data.inputs[inputParam.name] ?? JSON.stringify(inputParam.default) ?? []}
                                onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
                            />
                        )}

                        {inputParam.type === 'code' && (
                            <>
                                <div className="modern-node-code-actions">
                                    {inputParam.codeExample && (
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                data.inputs[inputParam.name] = inputParam.codeExample
                                            }}
                                        >
                                            See Example
                                        </Button>
                                    )}
                                </div>
                                <div className="modern-node-code-editor">
                                    <CodeEditor
                                        disabled={disabled}
                                        value={data.inputs[inputParam.name] ?? inputParam.default ?? ''}
                                        height={inputParam.rows ? '100px' : '200px'}
                                        theme={customization.isDarkMode ? 'dark' : 'light'}
                                        lang={'js'}
                                        placeholder={inputParam.placeholder}
                                        onValueChange={(code) => (data.inputs[inputParam.name] = code)}
                                        basicSetup={{ highlightActiveLine: false, highlightActiveLineGutter: false }}
                                    />
                                </div>
                            </>
                        )}

                        {(inputParam.type === 'string' || inputParam.type === 'password' || inputParam.type === 'number') && (
                            <Input
                                key={data.inputs[inputParam.name]}
                                disabled={disabled}
                                inputParam={inputParam}
                                onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
                                value={data.inputs[inputParam.name] ?? inputParam.default ?? ''}
                                nodes={inputParam?.acceptVariable && reactFlowInstance ? reactFlowInstance.getNodes() : []}
                                edges={inputParam?.acceptVariable && reactFlowInstance ? reactFlowInstance.getEdges() : []}
                                nodeId={data.id}
                            />
                        )}

                        {inputParam.type === 'json' && (
                            <>
                                {!inputParam?.acceptVariable && (
                                    <JsonEditorInput
                                        disabled={disabled}
                                        onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
                                        value={
                                            data.inputs[inputParam.name] ||
                                            inputParam.default ||
                                            getJSONValue(data.inputs['workerPrompt']) ||
                                            ''
                                        }
                                        isSequentialAgent={data.category === 'Sequential Agents'}
                                        isDarkMode={customization.isDarkMode}
                                    />
                                )}
                                {inputParam?.acceptVariable && (
                                    <>
                                        <Button
                                            className="modern-node-json-btn"
                                            disabled={disabled}
                                            onClick={() => onEditJSONClicked(data.inputs[inputParam.name] ?? '', inputParam)}
                                        >
                                            {inputParam.label}
                                        </Button>
                                        <FormatPromptValuesDialog
                                            show={showFormatPromptValuesDialog}
                                            dialogProps={formatPromptValuesDialogProps}
                                            onCancel={() => setShowFormatPromptValuesDialog(false)}
                                            onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
                                        />
                                    </>
                                )}
                            </>
                        )}

                        {inputParam.type === 'options' && (
                            <Dropdown
                                disabled={disabled}
                                name={inputParam.name}
                                options={inputParam.options}
                                onSelect={(newValue) => (data.inputs[inputParam.name] = newValue)}
                                value={data.inputs[inputParam.name] ?? inputParam.default ?? 'choose an option'}
                            />
                        )}

                        {inputParam.type === 'multiOptions' && (
                            <MultiDropdown
                                disabled={disabled}
                                name={inputParam.name}
                                options={inputParam.options}
                                onSelect={(newValue) => (data.inputs[inputParam.name] = newValue)}
                                value={data.inputs[inputParam.name] ?? inputParam.default ?? 'choose an option'}
                            />
                        )}

                        {inputParam.type === 'asyncOptions' && (
                            <>
                                {data.inputParams.length === 1 && <div style={{ marginTop: 10 }} />}
                                <div key={reloadTimestamp} className="modern-node-async-options">
                                    <AsyncDropdown
                                        disabled={disabled}
                                        name={inputParam.name}
                                        nodeData={data}
                                        value={data.inputs[inputParam.name] ?? inputParam.default ?? 'choose an option'}
                                        isCreateNewOption={EDITABLE_OPTIONS.includes(inputParam.name)}
                                        onSelect={(newValue) => (data.inputs[inputParam.name] = newValue)}
                                        onCreateNew={() => addAsyncOption(inputParam.name)}
                                    />
                                    {EDITABLE_OPTIONS.includes(inputParam.name) && data.inputs[inputParam.name] && (
                                        <IconButton
                                            className="modern-node-edit-btn"
                                            onClick={() => editAsyncOption(inputParam.name, data.inputs[inputParam.name])}
                                        >
                                            <IconEdit />
                                        </IconButton>
                                    )}
                                    {inputParam.refresh && (
                                        <IconButton
                                            className="modern-node-refresh-btn"
                                            onClick={() => setReloadTimestamp(Date.now().toString())}
                                        >
                                            <IconRefresh />
                                        </IconButton>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Custom Input Logic */}

                        {inputParam.type.includes('conditionFunction') && (
                            <>
                                <Button
                                    className="modern-node-condition-btn"
                                    sx={{ borderRadius: '12px', width: '100%', mt: 1 }}
                                    variant="outlined"
                                    onClick={() => onConditionDialogClicked(inputParam)}
                                >
                                    {inputParam.label}
                                </Button>
                            </>
                        )}

                        {/* Web Scraper Links Management */}
                        {(data.name === 'cheerioWebScraper' ||
                            data.name === 'puppeteerWebScraper' ||
                            data.name === 'playwrightWebScraper') &&
                            inputParam.name === 'url' && (
                                <>
                                    <Button
                                        className="modern-node-manage-links-btn"
                                        disabled={disabled}
                                        sx={{ borderRadius: '12px', width: '100%', mt: 1 }}
                                        variant="outlined"
                                        onClick={() =>
                                            onManageLinksDialogClicked(
                                                data.inputs[inputParam.name] ?? inputParam.default ?? '',
                                                data.inputs.selectedLinks,
                                                data.inputs['relativeLinksMethod'] ?? 'webCrawl',
                                                parseInt(data.inputs['limit']) ?? 0
                                            )
                                        }
                                    >
                                        Manage Links
                                    </Button>
                                    <ManageScrapedLinksDialog
                                        show={showManageScrapedLinksDialog}
                                        dialogProps={manageScrapedLinksDialogProps}
                                        onCancel={() => setShowManageScrapedLinksDialog(false)}
                                        onSave={onManageLinksDialogSave}
                                    />
                                </>
                            )}
                    </Box>
                </>
            )}

            {/* Dialogs */}
            <ToolDialog
                show={showAsyncOptionDialog === 'selectedTool'}
                dialogProps={asyncOptionEditDialogProps}
                onCancel={() => setAsyncOptionEditDialog('')}
                onConfirm={onConfirmAsyncOption}
            />
            <AssistantDialog
                show={showAsyncOptionDialog === 'selectedAssistant'}
                dialogProps={asyncOptionEditDialogProps}
                onCancel={() => setAsyncOptionEditDialog('')}
                onConfirm={onConfirmAsyncOption}
            />
            <ExpandTextDialog
                show={showExpandDialog}
                dialogProps={expandDialogProps}
                onCancel={() => setShowExpandDialog(false)}
                onConfirm={(newValue, inputParamName) => onExpandDialogSave(newValue, inputParamName)}
                onInputHintDialogClicked={onInputHintDialogClicked}
            />
            <ConditionDialog
                show={showConditionDialog}
                dialogProps={conditionDialogProps}
                onCancel={() => {
                    setShowConditionDialog(false)
                    onHideNodeInfoDialog(false)
                }}
                onConfirm={(newData, inputParam, tabValue) => onConditionDialogSave(newData, inputParam, tabValue)}
            />
            <InputHintDialog
                show={showInputHintDialog}
                dialogProps={inputHintDialogProps}
                onCancel={() => setShowInputHintDialog(false)}
            />
        </div>
    )
}

ModernNodeInput.propTypes = {
    inputAnchor: PropTypes.object,
    inputParam: PropTypes.object,
    data: PropTypes.object,
    disabled: PropTypes.bool,
    isAdditionalParams: PropTypes.bool,
    disablePadding: PropTypes.bool,
    onHideNodeInfoDialog: PropTypes.func
}

export default ModernNodeInput
