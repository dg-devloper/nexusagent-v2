import PropTypes from 'prop-types'
import { useCallback } from 'react'
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'

// material-ui
import { ModernCanvasNode, ModernButtonEdge, ModernLoadingEdge } from '../../nodeConfig'
import { themeVariables } from '../../config'

// Node and Edge Types
const nodeTypes = {
    canvasNode: ModernCanvasNode
}

const edgeTypes = {
    buttonEdge: ModernButtonEdge,
    loadingEdge: ModernLoadingEdge
}

const ModernCanvas = ({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onInit,
    onNodeClick,
    onPaneClick,
    onEdgeClick,
    onNodeDragStop,
    fitView
}) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    const getBackgroundColor = useCallback(() => {
        return isDark ? themeVariables.colors.background.dark : themeVariables.colors.background.light
    }, [isDark])

    const getBackgroundPattern = useCallback(() => {
        return isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
    }, [isDark])

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onEdgeClick={onEdgeClick}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView={fitView}
            style={{
                backgroundColor: getBackgroundColor()
            }}
        >
            <Background
                color={getBackgroundPattern()}
                gap={16}
                size={1}
                style={{
                    backgroundColor: 'transparent'
                }}
            />
            <Controls
                style={{
                    backgroundColor: isDark ? themeVariables.colors.background.dark : themeVariables.colors.background.light,
                    borderColor: isDark ? themeVariables.colors.border.dark : themeVariables.colors.border.light,
                    borderRadius: themeVariables.effects.borderRadius.medium,
                    boxShadow: isDark ? themeVariables.effects.shadow.dark[1] : themeVariables.effects.shadow.light[1]
                }}
            />
            <MiniMap
                style={{
                    backgroundColor: isDark ? themeVariables.colors.background.dark : themeVariables.colors.background.light,
                    borderColor: isDark ? themeVariables.colors.border.dark : themeVariables.colors.border.light,
                    borderRadius: themeVariables.effects.borderRadius.medium,
                    boxShadow: isDark ? themeVariables.effects.shadow.dark[1] : themeVariables.effects.shadow.light[1]
                }}
                nodeColor={(node) => {
                    return node.selected ? theme.palette.primary.main : theme.palette.text.secondary
                }}
            />
        </ReactFlow>
    )
}

ModernCanvas.propTypes = {
    nodes: PropTypes.array,
    edges: PropTypes.array,
    onNodesChange: PropTypes.func,
    onEdgesChange: PropTypes.func,
    onConnect: PropTypes.func,
    onInit: PropTypes.func,
    onNodeClick: PropTypes.func,
    onPaneClick: PropTypes.func,
    onEdgeClick: PropTypes.func,
    onNodeDragStop: PropTypes.func,
    fitView: PropTypes.bool
}

// Export both the component and its node/edge types
export { nodeTypes, edgeTypes }
export default ModernCanvas