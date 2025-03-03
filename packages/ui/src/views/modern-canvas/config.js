// Theme Variables
export const themeVariables = {
    colors: {
        primary: {
            main: 'var(--primary-color)',
            light: 'var(--primary-color-light)',
            dark: 'var(--primary-color-dark)'
        },
        error: {
            main: 'var(--error-color)',
            light: 'var(--error-color-light)',
            dark: 'var(--error-color-dark)'
        },
        warning: {
            main: 'var(--warning-color)',
            light: 'var(--warning-color-light)',
            dark: 'var(--warning-color-dark)'
        },
        success: {
            main: 'var(--success-color)',
            light: 'var(--success-color-light)',
            dark: 'var(--success-color-dark)'
        },
        background: {
            light: 'var(--background-color)',
            dark: 'var(--background-color-dark)',
            hover: 'var(--background-color-hover)',
            secondary: 'var(--background-color-secondary)'
        },
        border: {
            light: 'var(--border-color)',
            dark: 'var(--border-color-dark)',
            hover: 'var(--border-color-hover)'
        },
        text: {
            primary: 'var(--text-color)',
            secondary: 'var(--text-color-secondary)',
            disabled: 'var(--text-color-disabled)'
        }
    },
    spacing: {
        xsmall: 'var(--spacing-xsmall)',
        small: 'var(--spacing-small)',
        medium: 'var(--spacing-medium)',
        large: 'var(--spacing-large)',
        xlarge: 'var(--spacing-xlarge)'
    },
    borderRadius: {
        xsmall: 'var(--border-radius-xsmall)',
        small: 'var(--border-radius-small)',
        medium: 'var(--border-radius-medium)',
        large: 'var(--border-radius-large)',
        xlarge: 'var(--border-radius-xlarge)',
        circle: 'var(--border-radius-circle)'
    },
    shadows: {
        xsmall: 'var(--shadow-xsmall)',
        small: 'var(--shadow-small)',
        medium: 'var(--shadow-medium)',
        large: 'var(--shadow-large)',
        xlarge: 'var(--shadow-xlarge)'
    },
    effects: {
        transition: {
            duration: 'var(--transition-duration)',
            timing: 'var(--transition-timing)',
            durationFast: 'var(--transition-duration-fast)',
            durationSlow: 'var(--transition-duration-slow)'
        },
        hover: {
            scale: 'var(--hover-scale)',
            opacity: 'var(--hover-opacity)'
        }
    },
    zIndex: {
        tooltip: 'var(--z-index-tooltip)',
        dropdown: 'var(--z-index-dropdown)',
        modal: 'var(--z-index-modal)',
        overlay: 'var(--z-index-overlay)'
    }
}

// Node Styles
export const nodeStyles = {
    base: {
        padding: 0,
        borderRadius: themeVariables.borderRadius.medium,
        backgroundColor: themeVariables.colors.background.light,
        border: `1px solid ${themeVariables.colors.border.light}`,
        transition: `all ${themeVariables.effects.transition.duration} ${themeVariables.effects.transition.timing}`
    },
    selected: {
        borderColor: themeVariables.colors.primary.main,
        boxShadow: themeVariables.shadows.medium
    },
    hover: {
        borderColor: themeVariables.colors.border.hover,
        boxShadow: themeVariables.shadows.small
    },
    disabled: {
        opacity: 0.7,
        pointerEvents: 'none'
    },
    error: {
        borderColor: themeVariables.colors.error.main
    },
    warning: {
        borderColor: themeVariables.colors.warning.main
    },
    success: {
        borderColor: themeVariables.colors.success.main
    }
}

// Edge Styles
export const edgeStyles = {
    base: {
        strokeWidth: 2,
        fill: 'none'
    },
    selected: {
        stroke: themeVariables.colors.primary.main,
        strokeWidth: 3
    },
    loading: {
        animation: 'flow 1s linear infinite'
    },
    hover: {
        stroke: themeVariables.colors.primary.light,
        strokeWidth: 2.5
    },
    error: {
        stroke: themeVariables.colors.error.main,
        strokeWidth: 2.5
    }
}

// Default Props
export const defaultProps = {
    // Node Props
    node: {
        style: 'default',
        selected: false,
        border: true,
        className: ''
    },
    // Input Props
    input: {
        disabled: false,
        isAdditionalParams: false,
        disablePadding: false
    },
    // Output Props
    output: {
        disabled: false
    },
    // Edge Props
    edge: {
        animated: true,
        style: {}
    },
    // Dialog Props
    dialog: {
        show: false,
        title: '',
        confirmButtonName: 'Confirm',
        cancelButtonName: 'Cancel'
    }
}

// CSS Variables (to be injected into :root)
export const cssVariables = {
    // Colors
    '--primary-color': '#1976d2',
    '--primary-color-light': '#42a5f5',
    '--primary-color-dark': '#1565c0',
    '--error-color': '#d32f2f',
    '--error-color-light': '#ef5350',
    '--error-color-dark': '#c62828',
    '--warning-color': '#ed6c02',
    '--warning-color-light': '#ff9800',
    '--warning-color-dark': '#e65100',
    '--success-color': '#2e7d32',
    '--success-color-light': '#4caf50',
    '--success-color-dark': '#1b5e20',
    '--background-color': '#ffffff',
    '--background-color-dark': '#121212',
    '--background-color-hover': '#f5f5f5',
    '--background-color-secondary': '#f8f9fa',
    '--border-color': '#e0e0e0',
    '--border-color-dark': '#424242',
    '--border-color-hover': '#bdbdbd',
    '--text-color': '#000000',
    '--text-color-secondary': '#666666',
    '--text-color-disabled': '#9e9e9e',

    // Spacing
    '--spacing-xsmall': '4px',
    '--spacing-small': '8px',
    '--spacing-medium': '16px',
    '--spacing-large': '24px',
    '--spacing-xlarge': '32px',

    // Border Radius
    '--border-radius-xsmall': '2px',
    '--border-radius-small': '4px',
    '--border-radius-medium': '8px',
    '--border-radius-large': '12px',
    '--border-radius-xlarge': '16px',
    '--border-radius-circle': '50%',

    // Shadows
    '--shadow-xsmall': '0 1px 2px rgba(0,0,0,0.05)',
    '--shadow-small': '0 2px 4px rgba(0,0,0,0.1)',
    '--shadow-medium': '0 4px 8px rgba(0,0,0,0.1)',
    '--shadow-large': '0 8px 16px rgba(0,0,0,0.1)',
    '--shadow-xlarge': '0 12px 24px rgba(0,0,0,0.1)',

    // Effects
    '--transition-duration-fast': '0.15s',
    '--transition-duration': '0.2s',
    '--transition-duration-slow': '0.3s',
    '--transition-timing': 'ease-in-out',
    '--hover-scale': '1.02',
    '--hover-opacity': '0.8',

    // Z-Index
    '--z-index-tooltip': '1000',
    '--z-index-dropdown': '1100',
    '--z-index-modal': '1200',
    '--z-index-overlay': '1300'
}

// Node Types
export const nodeTypes = {
    input: 'input',
    output: 'output',
    process: 'process',
    condition: 'condition',
    utility: 'utility',
    default: 'default'
}

// Node Categories
export const nodeCategories = {
    input: 'Input',
    process: 'Process',
    output: 'Output',
    condition: 'Condition',
    utility: 'Utility'
}

// Animation Keyframes
export const keyframes = `
    @keyframes flow {
        from {
            stroke-dashoffset: 100%;
        }
        to {
            stroke-dashoffset: 0%;
        }
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideIn {
        from {
            transform: translateY(-10px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`