import PropTypes from 'prop-types'
import { useCallback, useState, useEffect } from 'react'
import { getBezierPath, EdgeText } from 'reactflow'

// material-ui
import { useTheme } from '@mui/material/styles'
import { IconButton } from '@mui/material'

// project imports
import { themeVariables, edgeStyles } from '../../config'

// icons
import { IconX } from '@tabler/icons-react'

const foreignObjectSize = 40

const ModernButtonEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
    selected,
    animated,
    onEdgeRemove
}) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const [progress, setProgress] = useState(0)

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
    })

    // Animation logic with theme-based timing
    useEffect(() => {
        setProgress(0)
        const duration = parseInt(themeVariables.effects.transition.duration) * 10 // Convert to ms
        const steps = 100
        const stepDuration = duration / steps

        setTimeout(() => {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        return 100
                    }
                    return prev + 1
                })
            }, stepDuration)

            return () => clearInterval(interval)
        }, 0)
    }, [animated])

    const onRemoveClick = useCallback((event) => {
        event.stopPropagation()
        if (onEdgeRemove) onEdgeRemove(id)
    }, [id, onEdgeRemove])

    const getEdgeStyle = () => ({
        ...edgeStyles.base,
        ...(selected && edgeStyles.selected),
        ...style,
        stroke: selected 
            ? themeVariables.colors.primary.main 
            : isDark 
                ? themeVariables.colors.border.dark 
                : themeVariables.colors.border.light,
        strokeWidth: selected ? 2.5 : 2,
        transition: `all ${themeVariables.effects.transition.duration} ${themeVariables.effects.transition.timing}`
    })

    const getButtonStyle = () => ({
        width: foreignObjectSize,
        height: foreignObjectSize,
        backgroundColor: isDark ? themeVariables.colors.background.dark : themeVariables.colors.background.light,
        border: `1px solid ${isDark ? themeVariables.colors.border.dark : themeVariables.colors.border.light}`,
        borderRadius: themeVariables.borderRadius.circle,
        padding: themeVariables.spacing.xsmall,
        color: isDark ? themeVariables.colors.text.primary : themeVariables.colors.text.primary,
        transition: `all ${themeVariables.effects.transition.duration} ${themeVariables.effects.transition.timing}`,
        '&:hover': {
            backgroundColor: themeVariables.colors.error.main,
            borderColor: themeVariables.colors.error.main,
            color: 'white',
            transform: 'scale(1.1)'
        }
    })

    const getLabelStyle = () => ({
        fill: isDark ? themeVariables.colors.text.primary : themeVariables.colors.text.primary,
        fontSize: '12px',
        fontFamily: 'inherit'
    })

    const getLabelBgStyle = () => ({
        fill: isDark ? themeVariables.colors.background.dark : themeVariables.colors.background.light,
        stroke: isDark ? themeVariables.colors.border.dark : themeVariables.colors.border.light,
        strokeWidth: 1,
        rx: themeVariables.borderRadius.small,
        ry: themeVariables.borderRadius.small
    })

    return (
        <>
            {/* Base Path */}
            <path
                id={id}
                className="modern-edge-path"
                d={edgePath}
                markerEnd={markerEnd}
                style={getEdgeStyle()}
            />

            {/* Animated Path */}
            {animated && (
                <path
                    id={`${id}-animated`}
                    className="modern-edge-path-animated"
                    d={edgePath}
                    style={{
                        ...getEdgeStyle(),
                        stroke: themeVariables.colors.primary.main,
                        strokeDasharray: '100%',
                        strokeDashoffset: `${100 - progress}%`,
                        transition: `stroke-dashoffset ${themeVariables.effects.transition.duration} ${themeVariables.effects.transition.timing}`
                    }}
                    markerEnd={markerEnd}
                />
            )}

            {/* Edge Label */}
            {data?.label && (
                <EdgeText
                    x={labelX}
                    y={labelY}
                    label={data.label}
                    labelStyle={getLabelStyle()}
                    labelBgStyle={getLabelBgStyle()}
                    labelBgPadding={[themeVariables.spacing.xsmall, themeVariables.spacing.small]}
                    labelBgBorderRadius={themeVariables.borderRadius.small}
                />
            )}

            {/* Remove Button */}
            <foreignObject
                width={foreignObjectSize}
                height={foreignObjectSize}
                x={labelX - foreignObjectSize / 2}
                y={labelY - foreignObjectSize / 2}
                className="modern-edge-button"
                requiredExtensions="http://www.w3.org/1999/xhtml"
            >
                <IconButton
                    size="small"
                    onClick={onRemoveClick}
                    sx={getButtonStyle()}
                >
                    <IconX size={14} />
                </IconButton>
            </foreignObject>
        </>
    )
}

ModernButtonEdge.propTypes = {
    id: PropTypes.string.isRequired,
    sourceX: PropTypes.number.isRequired,
    sourceY: PropTypes.number.isRequired,
    targetX: PropTypes.number.isRequired,
    targetY: PropTypes.number.isRequired,
    sourcePosition: PropTypes.string.isRequired,
    targetPosition: PropTypes.string.isRequired,
    style: PropTypes.object,
    markerEnd: PropTypes.string,
    data: PropTypes.object,
    selected: PropTypes.bool,
    animated: PropTypes.bool,
    onEdgeRemove: PropTypes.func
}

export default ModernButtonEdge