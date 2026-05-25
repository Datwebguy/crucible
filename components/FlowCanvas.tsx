"use client"

import { useEffect, useRef } from "react"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

interface Edge {
  from: number
  to: number
  opacity: number
  pulse: number
}

export function FlowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const nodes: Node[] = []
    const edges: Edge[] = []
    const NODE_COUNT = 40

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    function initNodes() {
      if (!canvas) return
      nodes.length = 0
      edges.length = 0
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.4 + 0.1,
        })
      }
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          if (Math.random() < 0.08) {
            edges.push({ from: i, to: j, opacity: Math.random() * 0.15, pulse: Math.random() * Math.PI * 2 })
          }
        }
      }
    }

    function draw(t: number) {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw edges
      for (const edge of edges) {
        const a = nodes[edge.from]
        const b = nodes[edge.to]
        const dist = Math.hypot(a.x - b.x, a.y - b.y)
        if (dist > 300) continue
        const alpha = edge.opacity * (1 - dist / 300) * (0.5 + 0.5 * Math.sin(t * 0.001 + edge.pulse))
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(232, 114, 10, ${alpha})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232, 114, 10, ${node.opacity})`
        ctx.fill()

        // Update position
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    initNodes()
    animId = requestAnimationFrame(draw)

    const ro = new ResizeObserver(() => {
      resize()
      initNodes()
    })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  )
}
