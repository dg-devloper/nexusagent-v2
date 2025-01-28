import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getBezierPath } from 'reactflow'

const FilledLoadingEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    label,
    markerEnd,
    style = {}
}) => {
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
            }, 90) // Adjust speed of animation

            return () => clearInterval(interval)
        }, data.delay)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.resetAnimation]) // Restart animation when resetAnimation changes

    // Calculate the edge path
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
    })

    return (
        <>
            {/* Background Path (Default Color) */}
            <path
                id={`${id}-background`}
                className='react-flow__edge-path'
                d={edgePath}
                style={{
                    ...style,
                    stroke: 'red', // Default background color
                    strokeWidth: 2, // Edge thickness
                    fill: 'none'
                }}
                markerEnd={markerEnd}
            />

            {/* Foreground Path (Loading Color) */}
            <path
                id={`${id}-foreground`}
                className='react-flow__edge-path'
                d={edgePath}
                style={{
                    ...style,
                    stroke: '#007bff', // Loading color
                    strokeWidth: 2, // Edge thickness
                    strokeDasharray: '100%', // Total length of the path
                    strokeDashoffset: `${100 - progress}%`, // Animate the fill
                    fill: 'none',
                    transition: 'stroke-dashoffset 0.1s ease' // Smooth transition
                }}
                markerEnd={markerEnd}
            />
        </>
    )
}

FilledLoadingEdge.propTypes = {
    id: PropTypes.string,
    sourceX: PropTypes.any,
    sourceY: PropTypes.any,
    targetX: PropTypes.any,
    targetY: PropTypes.any,
    sourcePosition: PropTypes.any,
    targetPosition: PropTypes.any,
    data: PropTypes.object,
    label: PropTypes.any,
    markerEnd: PropTypes.any,
    style: PropTypes.object,
    resetAnimation: PropTypes.any,
    delay: PropTypes.number
}

export default FilledLoadingEdge
