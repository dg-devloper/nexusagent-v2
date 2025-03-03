# Modern Canvas Components

A modern, themeable component system for building canvas-based node editors.

## Directory Structure

```
modern/
├── components/
│   ├── base/           # Base components
│   │   ├── ModernNodeCardWrapper.jsx
│   │   ├── ModernNodeConnector.jsx
│   │   └── ModernNodeDialog.jsx
│   ├── nodes/          # Node components
│   │   ├── ModernCanvasNode.jsx
│   │   ├── ModernNodeInput.jsx
│   │   └── ModernNodeOutput.jsx
│   ├── edges/          # Edge components
│   │   ├── ModernButtonEdge.jsx
│   │   └── ModernLoadingEdge.jsx
│   └── dialogs/        # Dialog components
│       ├── ModernAdditionalParamsDialog.jsx
│       └── ModernNodeInfoDialog.jsx
├── styles/             # Component styles
├── config.js           # Theme and style configuration
├── types.js            # Type definitions
└── index.js           # Main exports
```

## Features

-   Modern, consistent design language
-   Dark mode support
-   Customizable theming
-   Responsive layout
-   Accessible components
-   Smooth animations and transitions

## Components

### Base Components

-   **ModernNodeCardWrapper**: Base card component for nodes
-   **ModernNodeConnector**: Handles node input/output connections
-   **ModernNodeDialog**: Base dialog component

### Node Components

-   **ModernCanvasNode**: Main node component
-   **ModernNodeInput**: Input parameter handling
-   **ModernNodeOutput**: Output parameter handling

### Edge Components

-   **ModernButtonEdge**: Interactive edge with button controls
-   **ModernLoadingEdge**: Edge with loading animation

### Dialog Components

-   **ModernAdditionalParamsDialog**: Additional parameters editor
-   **ModernNodeInfoDialog**: Node information and documentation

## Configuration

### Theme Variables

Theme variables are defined in `config.js` and include:

-   Colors
-   Spacing
-   Typography
-   Effects (transitions, shadows, etc.)
-   Border radius
-   Node styles
-   Edge styles

### Types

Type definitions in `types.js` include:

-   Node types
-   Edge types
-   Input types
-   Node styles
-   Component prop types

## Usage

```jsx
import { ModernCanvasNode, ModernButtonEdge, nodeTypes, edgeTypes, themeVariables } from './modern'

// Use in ReactFlow
const nodeTypes = {
    canvas: ModernCanvasNode
}

const edgeTypes = {
    button: ModernButtonEdge
}

// Apply theme
const theme = createTheme({
    ...themeVariables
})
```

## Styling

Components use a combination of Material-UI's styling system and CSS classes. Custom styles can be applied through:

1. Theme customization (config.js)
2. CSS overrides (styles/)
3. Material-UI's sx prop
4. className prop

## Best Practices

1. Use base components for consistency
2. Follow the established theming system
3. Maintain accessibility standards
4. Keep components modular and reusable
5. Document any custom implementations
