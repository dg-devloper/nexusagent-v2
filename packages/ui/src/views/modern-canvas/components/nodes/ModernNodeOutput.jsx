import PropTypes from 'prop-types'
import { Handle, Position, useUpdateNodeInternals } from 'reactflow'
import { useEffect, useRef, useState, useContext } from 'react'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Box, Typography, Tooltip } from '@mui/material'

// project imports
import { flowContext } from '@/store/context/ReactFlowContext'
import { isValidConnection } from '@/utils/genericHelper'
import { Dropdown } from '@/ui-component/dropdown/Dropdown'
import { themeVariables } from '../../config'

const ModernNodeOutput = ({ outputAnchor, data, disabled = false }) => {
    const theme = useTheme()
    const ref = useRef(null)
    const updateNodeInternals = useUpdateNodeInternals()
    const [position, setPosition] = useState(0)
    const [clientHeight, setClientHeight] = useState(0)
    const [offsetTop, setOffsetTop] = useState(0)
    const [dropdownValue, setDropdownValue] = useState(null)
    const { reactFlowInstance } = useContext(flowContext)

    const getAvailableOptions = (options = []) => {
        return options.filter((option) => !option.hidden && !option.isAnchor)
    }

    const getAnchorOptions = (options = []) => {
        return options.filter((option) => !option.hidden && option.isAnchor)
    }

    const getAnchorPosition = (options, index) => {
        const spacing = clientHeight / (getAnchorOptions(options).length + 1)
        return offsetTop + spacing * (index + 1)
    }

    const getHandleStyle = (isSelected) => ({
        height: 10,
        width: 10,
        backgroundColor: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
        border: `1px solid ${isSelected ? theme.palette.primary.main : theme.palette.text.secondary}`,
        transition: `all ${themeVariables.effects.transition.duration} ${themeVariables.effects.transition.timing}`
    })

    useEffect(() => {
        if (ref.current && ref.current?.offsetTop && ref.current?.clientHeight) {
            setTimeout(() => {
                setClientHeight(ref.current?.clientHeight)
                setOffsetTop(ref.current?.offsetTop)
                setPosition(ref.current?.offsetTop + ref.current?.clientHeight / 2)
                updateNodeInternals(data.id)
            }, 0)
        }
    }, [data.id, ref, updateNodeInternals])

    useEffect(() => {
        setTimeout(() => {
            updateNodeInternals(data.id)
        }, 0)
    }, [data.id, position, updateNodeInternals])

    useEffect(() => {
        if (dropdownValue) {
            setTimeout(() => {
                updateNodeInternals(data.id)
            }, 0)
        }
    }, [data.id, dropdownValue, updateNodeInternals])

    return (
        <div ref={ref} className="modern-node-output">
            {/* Regular Output */}
            {outputAnchor.type !== 'options' && !outputAnchor.options && (
                <>
                    <Tooltip title={outputAnchor.type} placement="right">
                        <Handle
                            type="source"
                            position={Position.Right}
                            key={outputAnchor.id}
                            id={outputAnchor.id}
                            isValidConnection={(connection) => isValidConnection(connection, reactFlowInstance)}
                            style={{
                                ...getHandleStyle(data.selected),
                                top: position
                            }}
                        />
                    </Tooltip>
                    <Box className="modern-node-output-label">
                        <Typography>{outputAnchor.label}</Typography>
                    </Box>
                </>
            )}

            {/* Options Output */}
            {data.name !== 'ifElseFunction' &&
                outputAnchor.type === 'options' &&
                outputAnchor.options &&
                getAnchorOptions(outputAnchor.options).length > 0 && (
                    <div className="modern-node-output-options">
                        {getAnchorOptions(outputAnchor.options).map((option, index) => (
                            <div key={option.id} className="modern-node-output-option">
                                <Tooltip title={option.type} placement="right">
                                    <Handle
                                        type="source"
                                        position={Position.Right}
                                        key={index}
                                        id={option?.id}
                                        isValidConnection={(connection) => isValidConnection(connection, reactFlowInstance)}
                                        style={{
                                            ...getHandleStyle(data.selected),
                                            top: getAnchorPosition(outputAnchor.options, index)
                                        }}
                                    />
                                </Tooltip>
                                <Box className="modern-node-output-label">
                                    <Typography>{option.label}</Typography>
                                </Box>
                            </div>
                        ))}
                    </div>
                )}

            {/* If/Else Function Output */}
            {data.name === 'ifElseFunction' && outputAnchor.type === 'options' && outputAnchor.options && (
                <div className="modern-node-output-ifelse">
                    <div className="modern-node-output-option">
                        <Tooltip
                            title={
                                outputAnchor.options.find((opt) => opt.name === data.outputs?.[outputAnchor.name])?.type ??
                                outputAnchor.type
                            }
                            placement="right"
                        >
                            <Handle
                                type="source"
                                position={Position.Right}
                                key={outputAnchor.options.find((opt) => opt.name === 'returnTrue')?.id ?? ''}
                                id={outputAnchor.options.find((opt) => opt.name === 'returnTrue')?.id ?? ''}
                                isValidConnection={(connection) => isValidConnection(connection, reactFlowInstance)}
                                style={{
                                    ...getHandleStyle(data.selected),
                                    top: position - 25
                                }}
                            />
                        </Tooltip>
                        <Box className="modern-node-output-label">
                            <Typography>True</Typography>
                        </Box>
                    </div>
                    <div className="modern-node-output-option">
                        <Tooltip
                            title={
                                outputAnchor.options.find((opt) => opt.name === data.outputs?.[outputAnchor.name])?.type ??
                                outputAnchor.type
                            }
                            placement="right"
                        >
                            <Handle
                                type="source"
                                position={Position.Right}
                                key={outputAnchor.options.find((opt) => opt.name === 'returnFalse')?.id ?? ''}
                                id={outputAnchor.options.find((opt) => opt.name === 'returnFalse')?.id ?? ''}
                                isValidConnection={(connection) => isValidConnection(connection, reactFlowInstance)}
                                style={{
                                    ...getHandleStyle(data.selected),
                                    top: position + 25
                                }}
                            />
                        </Tooltip>
                        <Box className="modern-node-output-label">
                            <Typography>False</Typography>
                        </Box>
                    </div>
                </div>
            )}

            {/* Output Dropdown */}
            {data.name !== 'ifElseFunction' &&
                outputAnchor.type === 'options' &&
                outputAnchor.options &&
                getAvailableOptions(outputAnchor.options).length > 0 && (
                    <>
                        <Tooltip
                            title={
                                outputAnchor.options.find((opt) => opt.name === data.outputs?.[outputAnchor.name])?.type ??
                                outputAnchor.type
                            }
                            placement="right"
                        >
                            <Handle
                                type="source"
                                position={Position.Right}
                                id={outputAnchor.options.find((opt) => opt.name === data.outputs?.[outputAnchor.name])?.id ?? ''}
                                isValidConnection={(connection) => isValidConnection(connection, reactFlowInstance)}
                                style={{
                                    ...getHandleStyle(data.selected),
                                    top: position
                                }}
                            />
                        </Tooltip>
                        <Box className="modern-node-output-dropdown">
                            <Dropdown
                                disabled={disabled}
                                disableClearable={true}
                                name={outputAnchor.name}
                                options={getAvailableOptions(outputAnchor.options)}
                                onSelect={(newValue) => {
                                    setDropdownValue(newValue)
                                    data.outputs[outputAnchor.name] = newValue
                                }}
                                value={data.outputs[outputAnchor.name] ?? outputAnchor.default ?? 'choose an option'}
                            />
                        </Box>
                    </>
                )}
        </div>
    )
}

ModernNodeOutput.propTypes = {
    outputAnchor: PropTypes.object,
    data: PropTypes.object,
    disabled: PropTypes.bool
}

export default ModernNodeOutput