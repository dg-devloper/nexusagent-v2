import PropTypes from 'prop-types'

// Node Types
export const NODE_TYPES = {
    CANVAS: 'canvas',
    CANVAS_NODE: 'canvasNode',
    INPUT: 'input',
    OUTPUT: 'output'
}

// Edge Types
export const EDGE_TYPES = {
    BUTTON: 'buttonEdge',
    LOADING: 'loadingEdge'
}

// Input Types
export const INPUT_TYPES = {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    PASSWORD: 'password',
    JSON: 'json',
    CODE: 'code',
    FILE: 'file',
    OPTIONS: 'options',
    MULTI_OPTIONS: 'multiOptions',
    ASYNC_OPTIONS: 'asyncOptions',
    CREDENTIAL: 'credential',
    TABS: 'tabs',
    DATAGRID: 'datagrid'
}

// Node Styles
export const NODE_STYLES = {
    DEFAULT: 'default',
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error'
}

// Custom PropTypes
export const CustomPropTypes = {
    node: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(Object.values(NODE_TYPES)).isRequired,
        data: PropTypes.object.isRequired,
        position: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired
        }).isRequired,
        style: PropTypes.object,
        selected: PropTypes.bool,
        dragging: PropTypes.bool
    }),

    edge: PropTypes.shape({
        id: PropTypes.string.isRequired,
        source: PropTypes.string.isRequired,
        target: PropTypes.string.isRequired,
        type: PropTypes.oneOf(Object.values(EDGE_TYPES)),
        animated: PropTypes.bool,
        style: PropTypes.object,
        selected: PropTypes.bool
    }),

    anchor: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        label: PropTypes.string,
        description: PropTypes.string,
        optional: PropTypes.bool,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired,
                type: PropTypes.string,
                description: PropTypes.string,
                hidden: PropTypes.bool,
                isAnchor: PropTypes.bool
            })
        )
    }),

    inputParam: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.oneOf(Object.values(INPUT_TYPES)).isRequired,
        description: PropTypes.string,
        optional: PropTypes.bool,
        default: PropTypes.any,
        placeholder: PropTypes.string,
        rows: PropTypes.number,
        options: PropTypes.array,
        loadOptions: PropTypes.func,
        fileType: PropTypes.string,
        acceptVariable: PropTypes.bool,
        list: PropTypes.bool,
        async: PropTypes.bool,
        additionalParams: PropTypes.bool,
        warning: PropTypes.string,
        hint: PropTypes.shape({
            label: PropTypes.string.isRequired,
            description: PropTypes.string,
            examples: PropTypes.arrayOf(PropTypes.string)
        }),
        tabs: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired,
                type: PropTypes.string,
                disabled: PropTypes.bool
            })
        ),
        tabIdentifier: PropTypes.string,
        datagrid: PropTypes.arrayOf(
            PropTypes.shape({
                field: PropTypes.string.isRequired,
                headerName: PropTypes.string.isRequired,
                type: PropTypes.string,
                editable: PropTypes.bool,
                valueOptions: PropTypes.array
            })
        )
    }),

    nodeData: PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string,
        category: PropTypes.string,
        description: PropTypes.string,
        version: PropTypes.string,
        badge: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        selected: PropTypes.bool,
        inputAnchors: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            label: PropTypes.string,
            description: PropTypes.string,
            optional: PropTypes.bool
        })),
        outputAnchors: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            label: PropTypes.string,
            description: PropTypes.string,
            options: PropTypes.array
        })),
        inputParams: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            label: PropTypes.string,
            description: PropTypes.string,
            optional: PropTypes.bool,
            additionalParams: PropTypes.bool
        })),
        inputs: PropTypes.object,
        outputs: PropTypes.object,
        credential: PropTypes.string
    })
}