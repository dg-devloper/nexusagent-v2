import { getBezierPath, EdgeText } from 'reactflow'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useContext, useEffect, useState } from 'react'
import { SET_DIRTY } from '@/store/actions'
import { flowContext } from '@/store/context/ReactFlowContext'

import './index.css'

const foreignObjectSize = 40

const ButtonEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data, markerEnd }) => {
    const [edgePath, edgeCenterX, edgeCenterY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
    })

    const [progress, setProgress] = useState(0)

    // Animation logic with slower timing
    useEffect(() => {
        setProgress(0) // Reset progress when animation starts
        const startAnimation = () => {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        return 100
                    }
                    return prev + 0.2 // Smaller increment for slower animation
                })
            }, 50) // Slower interval

            return interval
        }

        const interval = startAnimation()
        return () => clearInterval(interval)
    }, []) // Empty dependency array means this runs once on mount

    const { deleteEdge } = useContext(flowContext)
    const dispatch = useDispatch()

    const onEdgeClick = (evt, id) => {
        evt.stopPropagation()
        deleteEdge(id)
        dispatch({ type: SET_DIRTY })
    }

    return (
        <>
            <path
                id={id}
                style={style}
                className='react-flow__edge-path'
                d={edgePath}
                markerEnd={markerEnd}
            />
            {data && data.label && (
                <EdgeText
                    x={sourceX + 10}
                    y={sourceY + 10}
                    label={data.label}
                    labelStyle={{ fill: 'black' }}
                    labelBgStyle={{ fill: 'transparent' }}
                    labelBgPadding={[2, 4]}
                    labelBgBorderRadius={2}
                />
            )}
            <foreignObject
                width={foreignObjectSize}
                height={foreignObjectSize}
                x={edgeCenterX - foreignObjectSize / 2}
                y={edgeCenterY - foreignObjectSize / 2}
                className='edgebutton-foreignobject'
                requiredExtensions='http://www.w3.org/1999/xhtml'
            >
                <div>
                    <button className='edgebutton' onClick={(event) => onEdgeClick(event, id)}>
                        ×
                    </button>
                </div>
            </foreignObject>

            {/* Background Path (Dashed Gray) */}
            <path
                id={`${id}-background`}
                className='react-flow__edge-path'
                d={edgePath}
                style={{
                    ...style,
                    stroke: '#808080', // Gray color
                    strokeWidth: 2, // Edge thickness
                    strokeDasharray: '4, 8', // Spaced dashes (4px dash, 8px gap)
                    fill: 'none'
                }}
            />

            {/* Foreground Path (Animated Gray) */}
            <path
                id={`${id}-foreground`}
                className='react-flow__edge-path'
                d={edgePath}
                style={{
                    ...style,
                    stroke: '#808080', // Gray color to match background
                    strokeWidth: 2, // Edge thickness
                    strokeDasharray: '4, 8', // Match background dash pattern
                    strokeDashoffset: `${100 - progress}%`, // Animate the fill
                    fill: 'none',
                    transition: 'stroke-dashoffset 0.5s ease' // Slower transition
                }}
            />
        </>
    )
}

ButtonEdge.propTypes = {
    id: PropTypes.string,
    sourceX: PropTypes.number,
    sourceY: PropTypes.number,
    targetX: PropTypes.number,
    targetY: PropTypes.number,
    sourcePosition: PropTypes.any,
    targetPosition: PropTypes.any,
    style: PropTypes.object,
    data: PropTypes.object,
    markerEnd: PropTypes.any
}

export default ButtonEdge