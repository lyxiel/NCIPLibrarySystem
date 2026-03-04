"use client"

import React from 'react'

const LineChart = ({ data = [], color = '#0B74FF', height = 120 }) => {
  if (!data || data.length === 0) return null
  const max = Math.max(...data)
  const stepX = 100 / Math.max(1, data.length - 1)
  const points = data
    .map((v, i) => {
      const x = +(i * stepX).toFixed(2)
      const y = +((1 - v / max) * 80 + 10).toFixed(2) // padding
      return `${x},${y}`
    })
    .join(' ')

  const pathD = data
    .map((v, i) => {
      const x = +(i * stepX).toFixed(2)
      const y = +((1 - v / max) * 80 + 10).toFixed(2)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  const areaPath = `${pathD} L 100 90 L 0 90 Z`

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <path d={areaPath} fill={color} fillOpacity="0.08" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((v, i) => {
          const x = (i * stepX)
          const y = (1 - v / max) * 80 + 10
          return <circle key={i} cx={x} cy={y} r="1.6" fill={color} />
        })}
      </svg>
    </div>
  )
}

const BarChart = ({ data = [], color = '#CFAE70', height = 120 }) => {
  if (!data || data.length === 0) return null
  const max = Math.max(...data)
  const barWidth = 100 / data.length
  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {data.map((v, i) => {
          const x = i * barWidth + 2
          const w = barWidth - 4
          const h = (v / max) * 70
          const y = 90 - h
          return <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill={color} />
        })}
      </svg>
    </div>
  )
}

const DonutChart = ({ parts = [], colors = ['#0B74FF', '#FB923C'], size = 120 }) => {
  const total = parts.reduce((s, p) => s + p, 0)
  const radius = 18
  const circumference = 2 * Math.PI * radius
  let offset = 0
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox="0 0 48 48" className="flex-shrink-0">
        <g transform="translate(24,24)">
          {parts.map((p, i) => {
            const frac = total === 0 ? 0 : p / total
            const dash = +(circumference * frac).toFixed(2)
            const gap = +(circumference - dash).toFixed(2)
            const strokeDasharray = `${dash} ${gap}`
            const strokeDashoffset = -offset
            offset += dash
            return (
              <circle
                key={i}
                r={radius}
                cx={0}
                cy={0}
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth="6"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90)"
              />
            )
          })}
        </g>
      </svg>

      <div>
        {parts.map((p, i) => (
          <div key={i} className="text-sm flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm" style={{ background: colors[i % colors.length] }} />
            <span className="text-muted-foreground">{p}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const SimpleChart = (props) => {
  const { type = 'line' } = props
  if (type === 'line') return <LineChart {...props} />
  if (type === 'bar') return <BarChart {...props} />
  if (type === 'donut') return <DonutChart {...props} />
  return null
}

export default SimpleChart
