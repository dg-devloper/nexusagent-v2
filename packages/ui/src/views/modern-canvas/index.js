// Base Components
export { default as ModernNodeCardWrapper } from './components/base/ModernNodeCardWrapper'
export { default as ModernNodeConnector } from './components/base/ModernNodeConnector'
export { default as ModernNodeDialog } from './components/base/ModernNodeDialog'
export { default as ModernNodeInputHandler } from './components/base/ModernNodeInputHandler'
export { default as ModernNodeOutputHandler } from './components/base/ModernNodeOutputHandler'
export { default as ModernCanvasSubHeader } from './components/base/ModernCanvasSubHeader'
export { default as ModernStickyNote } from './components/base/ModernStickyNote'

// Node Components
export { default as ModernCanvas, nodeTypes, edgeTypes } from './components/nodes/ModernCanvas'
export { default as ModernCanvasNode } from './components/nodes/ModernCanvasNode'
export { default as ModernNodeInput } from './components/nodes/ModernNodeInput'
export { default as ModernNodeOutput } from './components/nodes/ModernNodeOutput'

// Edge Components
export { default as ModernButtonEdge } from './components/edges/ModernButtonEdge'
export { default as ModernLoadingEdge } from './components/edges/ModernLoadingEdge'

// Dialog Components
export { default as ModernAdditionalParamsDialog } from './components/dialogs/ModernAdditionalParamsDialog'
export { default as ModernNodeInfoDialog } from './components/dialogs/ModernNodeInfoDialog'

// Types
export {
    NODE_TYPES,
    EDGE_TYPES,
    INPUT_TYPES,
    NODE_STYLES,
    CustomPropTypes
} from './types'

// Configurations
export {
    themeVariables,
    nodeStyles,
    edgeStyles,
    defaultProps,
    keyframes,
    cssVariables,
    nodeTypes as nodeTypeConfig,
    nodeCategories
} from './config'

// Import all components first
import { default as ModernCanvasComponent } from './components/nodes/ModernCanvas'
import { default as ModernCanvasNodeComponent } from './components/nodes/ModernCanvasNode'
import { default as ModernNodeInputComponent } from './components/nodes/ModernNodeInput'
import { default as ModernNodeOutputComponent } from './components/nodes/ModernNodeOutput'
import { default as ModernButtonEdgeComponent } from './components/edges/ModernButtonEdge'
import { default as ModernLoadingEdgeComponent } from './components/edges/ModernLoadingEdge'
import { default as ModernNodeCardWrapperComponent } from './components/base/ModernNodeCardWrapper'
import { default as ModernNodeConnectorComponent } from './components/base/ModernNodeConnector'
import { default as ModernNodeDialogComponent } from './components/base/ModernNodeDialog'
import { default as ModernNodeInputHandlerComponent } from './components/base/ModernNodeInputHandler'
import { default as ModernNodeOutputHandlerComponent } from './components/base/ModernNodeOutputHandler'
import { default as ModernCanvasSubHeaderComponent } from './components/base/ModernCanvasSubHeader'
import { default as ModernStickyNoteComponent } from './components/base/ModernStickyNote'
import { default as ModernAdditionalParamsDialogComponent } from './components/dialogs/ModernAdditionalParamsDialog'
import { default as ModernNodeInfoDialogComponent } from './components/dialogs/ModernNodeInfoDialog'
import { nodeTypes as nodeTypesConfig, edgeTypes as edgeTypesConfig } from './components/nodes/ModernCanvas'
import { themeVariables as themeConfig, nodeStyles as nodeStylesConfig, edgeStyles as edgeStylesConfig, defaultProps as defaultPropsConfig, keyframes as keyframesConfig, cssVariables as cssVariablesConfig, nodeTypes as nodeTypesConfigFromConfig, nodeCategories as nodeCategoriesConfig } from './config'

// Create default export object
const modernExport = {
    // Components
    ModernCanvas: ModernCanvasComponent,
    ModernCanvasNode: ModernCanvasNodeComponent,
    ModernNodeInput: ModernNodeInputComponent,
    ModernNodeOutput: ModernNodeOutputComponent,
    ModernButtonEdge: ModernButtonEdgeComponent,
    ModernLoadingEdge: ModernLoadingEdgeComponent,
    ModernNodeCardWrapper: ModernNodeCardWrapperComponent,
    ModernNodeConnector: ModernNodeConnectorComponent,
    ModernNodeDialog: ModernNodeDialogComponent,
    ModernNodeInputHandler: ModernNodeInputHandlerComponent,
    ModernNodeOutputHandler: ModernNodeOutputHandlerComponent,
    ModernCanvasSubHeader: ModernCanvasSubHeaderComponent,
    ModernStickyNote: ModernStickyNoteComponent,
    ModernAdditionalParamsDialog: ModernAdditionalParamsDialogComponent,
    ModernNodeInfoDialog: ModernNodeInfoDialogComponent,

    // Types and Configurations
    nodeTypes: nodeTypesConfig,
    edgeTypes: edgeTypesConfig,
    themeVariables: themeConfig,
    nodeStyles: nodeStylesConfig,
    edgeStyles: edgeStylesConfig,
    defaultProps: defaultPropsConfig,
    keyframes: keyframesConfig,
    cssVariables: cssVariablesConfig,
    nodeTypeConfig: nodeTypesConfigFromConfig,
    nodeCategories: nodeCategoriesConfig
}

export default modernExport