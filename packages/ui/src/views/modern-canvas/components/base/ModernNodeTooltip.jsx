import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import { Tooltip, tooltipClasses } from '@mui/material'

// Custom styled tooltip with wider max-width
const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500,
        backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.grey[800] 
            : theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.mode === 'dark' 
            ? theme.palette.grey[700] 
            : theme.palette.grey[300]}`,
        boxShadow: theme.shadows[1],
        borderRadius: theme.shape.borderRadius,
        padding: 0
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.mode === 'dark' 
            ? theme.palette.grey[800] 
            : theme.palette.background.paper,
        '&::before': {
            border: `1px solid ${theme.palette.mode === 'dark' 
                ? theme.palette.grey[700] 
                : theme.palette.grey[300]}`
        }
    }
}))

const ModernNodeTooltip = ({
    children,
    title,
    placement = 'right',
    open,
    onClose,
    onOpen,
    disableFocusListener = false,
    disableHoverListener = false,
    disableTouchListener = false,
    arrow = true
}) => {
    return (
        <CustomWidthTooltip
            title={title}
            placement={placement}
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            disableFocusListener={disableFocusListener}
            disableHoverListener={disableHoverListener}
            disableTouchListener={disableTouchListener}
            arrow={arrow}
            PopperProps={{
                sx: {
                    '& .MuiTooltip-tooltip': {
                        minWidth: 180
                    }
                }
            }}
        >
            {children}
        </CustomWidthTooltip>
    )
}

ModernNodeTooltip.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.node.isRequired,
    placement: PropTypes.oneOf([
        'bottom-end',
        'bottom-start',
        'bottom',
        'left-end',
        'left-start',
        'left',
        'right-end',
        'right-start',
        'right',
        'top-end',
        'top-start',
        'top'
    ]),
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    disableFocusListener: PropTypes.bool,
    disableHoverListener: PropTypes.bool,
    disableTouchListener: PropTypes.bool,
    arrow: PropTypes.bool
}

export default ModernNodeTooltip