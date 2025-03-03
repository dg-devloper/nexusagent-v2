import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getBezierPath } from 'reactflow'

// material-ui
import { useTheme } from '@mui/material/styles'

// project imports
import { themeVariables, edgeStyles } from '../../config'

const ModernLoadingEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd,
    style = {}
}) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const [progress, setProgress] = useState(0)

    // Animation logic
    useEffect(() => {
        setProgress(0) // Reset progress when resetAnimation changes
        setTimeout(() => {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        return 100
                    }
                    return prev + 1 // Increment progress
                })
            }, 90) // Animation speed

            return () => clearInterval(interval)
        }, data?.delay || 0)
    }, [data?.resetAnimation, data?.delay]) // Restart animation when resetAnimation changes

    // Calculate the edge path
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
    })

    const getEdgeStyle = () => ({
        ...edgeStyles.base,
        ...style,
        stroke: isDark ? themeVariables.colors.border.dark : themeVariables.colors.border.light,
        strokeWidth: 2,
        fill: 'none'
    })

    return (
        <>
            {/* Background Path (Default Color) */}
            <path
                id={`${id}-background`}
                className="modern-edge-path"
                d={edgePath}
                style={{
                    ...getEdgeStyle(),
                    stroke: theme.palette.error.main // Background color for loading edge
                }}
                markerEnd={markerEnd}
            />

            {/* Foreground Path (Loading Animation) */}
            <path
                id={`${id}-foreground`}
                className="modern-edge-path"
                d={edgePath}
                style={{
                    ...getEdgeStyle(),
                    stroke: theme.palette.primary.main, // Loading color
                    strokeDasharray: '100%', // Total length of the path
                    strokeDashoffset: `${100 - progress}%`, // Animate the fill
                    transition: `stroke-dashoffset ${themeVariables.effects.transition.duration} ${themeVariables.effects.transition.timing}`
                }}
                markerEnd={markerEnd}
            />
        </>
    )
}

ModernLoadingEdge.propTypes = {
    id: PropTypes.string.isRequired,
    sourceX: PropTypes.number.isRequired,
    sourceY: PropTypes.number.isRequired,
    targetX: PropTypes.number.isRequired,
    targetY: PropTypes.number.isRequired,
    sourcePosition: PropTypes.string.isRequired,
    targetPosition: PropTypes.string.isRequired,
    data: PropTypes.shape({
        resetAnimation: PropTypes.any,
        delay: PropTypes.number
    }),
    markerEnd: PropTypes.string,
    style: PropTypes.object
}

export default ModernLoadingEdge