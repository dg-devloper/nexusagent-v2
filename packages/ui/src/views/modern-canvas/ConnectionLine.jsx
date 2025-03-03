import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'

const ConnectionLine = ({ fromX, fromY, toX, toY }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === 'dark'

    // Calculate control points for smooth curve
    const midX = (fromX + toX) / 2
    const deltaX = Math.abs(toX - fromX)
    const curvature = Math.min(deltaX * 0.5, 150) // Dynamic curvature based on distance

    // Path commands for smooth curve
    const path = `
        M ${fromX} ${fromY}
        C ${midX - curvature} ${fromY},
          ${midX + curvature} ${toY},
          ${toX} ${toY}
    `

    // Modern gradient effect
    const gradientId = `connection-gradient-${fromX}-${fromY}-${toX}-${toY}`

    return (
        <g>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop
                        offset="0%"
                        stopColor={isDarkMode ? theme.palette.primary.dark : theme.palette.primary.light}
                        stopOpacity={0.8}
                    />
                    <stop
                        offset="100%"
                        stopColor={isDarkMode ? theme.palette.secondary.dark : theme.palette.secondary.light}
                        stopOpacity={0.8}
                    />
                </linearGradient>
            </defs>
            {/* Glow effect */}
            <path
                d={path}
                fill="none"
                stroke={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                strokeWidth={6}
                strokeLinecap="round"
                filter="url(#glow)"
            />
            {/* Main line */}
            <path
                d={path}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth={2}
                strokeLinecap="round"
                style={{
                    animation: 'flowPathAnimation 30s linear infinite',
                    strokeDasharray: '5 3'
                }}
            />
            {/* Connection points */}
            <circle
                cx={fromX}
                cy={fromY}
                r={4}
                fill={theme.palette.background.paper}
                stroke={isDarkMode ? theme.palette.primary.dark : theme.palette.primary.main}
                strokeWidth={2}
            />
            <circle
                cx={toX}
                cy={toY}
                r={4}
                fill={theme.palette.background.paper}
                stroke={isDarkMode ? theme.palette.secondary.dark : theme.palette.secondary.main}
                strokeWidth={2}
            />
            {/* SVG Filters */}
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
        </g>
    )
}

ConnectionLine.propTypes = {
    fromX: PropTypes.number.isRequired,
    fromY: PropTypes.number.isRequired,
    toX: PropTypes.number.isRequired,
    toY: PropTypes.number.isRequired
}

export default ConnectionLine