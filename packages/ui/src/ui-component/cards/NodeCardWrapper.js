import { styled } from '@mui/material/styles'
import { Paper } from '@mui/material'

const NodeCardWrapper = styled(Paper)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
    color: theme.palette.text.primary,
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    width: '300px',
    height: 'auto',
    boxShadow: theme.palette.mode === 'dark' 
        ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
        : '0 4px 12px rgba(0, 0, 0, 0.1)',

    // Header
    '& .node-header': {
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',

        '& .node-icon': {
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    },

    // Input Section
    '& .input-section': {
        padding: '12px 16px',
        borderBottom: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',

        '& .input-label': {
            fontSize: '0.75rem',
            color: theme.palette.text.secondary,
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },

        '& .input-field': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
            borderRadius: '6px',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            padding: '8px 12px',
            fontSize: '0.875rem',
            width: '100%',
            transition: 'all 0.2s ease-in-out',

            '&:hover': {
                borderColor: theme.palette.primary.main
            },

            '&:focus': {
                outline: 'none',
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`
            }
        },

        '& .input-select': {
            width: '100%',
            fontSize: '0.875rem',
            
            '& .MuiSelect-select': {
                padding: '8px 12px'
            }
        },

        '& .input-switch': {
            padding: '8px 0'
        }
    },

    // Handle Points
    '& .handle': {
        width: '10px',
        height: '10px',
        backgroundColor: theme.palette.primary.main,
        borderRadius: '50%',
        border: `2px solid ${theme.palette.background.paper}`,
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',

        '&.input-handle': {
            left: '-5px'
        },

        '&.output-handle': {
            right: '-5px'
        },

        '&:hover': {
            transform: 'translateY(-50%) scale(1.2)'
        }
    },

    // Selected State
    '&.selected': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`
    }
}))

export default NodeCardWrapper