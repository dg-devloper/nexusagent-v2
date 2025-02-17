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

    // Animation logic
    useEffect(() => {
        console.log('Called')
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
        }, 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [false]) // Restart animation when resetAnimation changes

    const { deleteEdge } = useContext(flowContext)

    const dispatch = useDispatch()

    const onEdgeClick = (evt, id) => {
        evt.stopPropagation()
        deleteEdge(id)
        dispatch({ type: SET_DIRTY })
    }

    return (
        <>
            <path id={id} style={style} className='react-flow__edge-path' d={edgePath} markerEnd={markerEnd} />
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

            {/* Background Path (Default Color) */}
            <path
                id={`${id}-background`}
                className='react-flow__edge-path'
                d={edgePath}
                style={{
                    ...style,
                    stroke: 'gray', // Default background color
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
