import PropTypes from 'prop-types'
import { useContext } from 'react'
import { Handle, Position } from 'reactflow'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Box } from '@mui/material'

// project imports
import { flowContext } from '@/store/context/ReactFlowContext'
import { isValidConnection } from '@/utils/genericHelper'
import { themeVariables } from '../../config'

// icons
import {
    IconPlugConnected,
    IconPlugConnectedX,
    IconArrowRight
} from '@tabler/icons-react'

const ModernNodeConnector = ({
    type = 'input', // 'input' or 'output'
    anchorId,
    anchorType,
    selected = false,
    disabled = false,
    label
}) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const { reactFlowInstance } = useContext(flowContext)

    const getConnectorStyle = () => ({
        width: themeVariables.spacing.connector.size,
        height: themeVariables.spacing.connector.size,
        border: '2px solid',
        borderColor: isDark ? themeVariables.colors.border.dark : themeVariables.colors.border.light,
        backgroundColor: selected ? themeVariables.colors.primary : theme.palette.text.secondary
    })

    return (
        <Box
            className={`modern-node-connector modern-node-connector-${type}`}
            sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                opacity: disabled ? 0.5 : 1
            }}
        >
            {type === 'input' && (
                <>
                    <Box className="modern-node-connector-icons">
                        <Handle
                            type="target"
                            position={Position.Left}
                            id={anchorId}
                            isValidConnection={(connection) => isValidConnection(connection, reactFlowInstance)}
                            style={getConnectorStyle()}
                        />
                        <IconPlugConnected
                            size={14}
                            className={`modern-node-handle-icon ${selected ? 'selected' : ''}`}
                        />
                        <IconArrowRight size={14} className="modern-node-handle-icon" />
                    </Box>
                    {label && (
                        <Box className="modern-node-connector-label">
                            {label}
                        </Box>
                    )}
                </>
            )}

            {type === 'output' && (
                <>
                    {label && (
                        <Box className="modern-node-connector-label">
                            {label}
                        </Box>
                    )}
                    <Box className="modern-node-connector-icons">
                        <IconArrowRight size={14} className="modern-node-handle-icon" />
                        <IconPlugConnectedX
                            size={14}
                            className={`modern-node-handle-icon ${selected ? 'selected' : ''}`}
                        />
                        <Handle
                            type="source"
                            position={Position.Right}
                            id={anchorId}
                            isValidConnection={(connection) => isValidConnection(connection, reactFlowInstance)}
                            style={getConnectorStyle()}
                        />
                    </Box>
                </>
            )}
        </Box>
    )
}

ModernNodeConnector.propTypes = {
    type: PropTypes.oneOf(['input', 'output']),
    anchorId: PropTypes.string.isRequired,
    anchorType: PropTypes.string,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.string
}

export default ModernNodeConnector