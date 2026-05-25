"use client"

import { useEffect, useRef } from "react"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  isHub: boolean
  pulseOffset: number
}

interface Particle {
  fromNode: number
  toNode: number
  progress: number
  speed: number
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
    const particles: Particle[] = []
    const NODE_COUNT = 65
    const HUB_COUNT = 8
    const PARTICLE_COUNT = 22
    const CONNECT_DIST = 200

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    function initNodes() {
      if (!canvas) return
      nodes.length = 0
      particles.length = 0

      for (let i = 0; i < NODE_COUNT; i++) {
        const isHub = i < HUB_COUNT
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (isHub ? 0.25 : 0.45),
          vy: (Math.random() - 0.5) * (isHub ? 0.25 : 0.45),
          radius: isHub ? Math.random() * 2.5 + 3 : Math.random() * 1.8 + 1,
          opacity: isHub ? 0.85 : Math.random() * 0.45 + 0.3,
          isHub,
          pulseOffset: Math.random() * Math.PI * 2,
        })
      }

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        spawnParticle(i)
      }
    }

    function spawnParticle(idx: number) {
      const from = Math.floor(Math.random() * NODE_COUNT)
      let to = Math.floor(Math.random() * NODE_COUNT)
      while (to === from) to = Math.floor(Math.random() * NODE_COUNT)
      particles[idx] = {
        fromNode: from,
        toNode: to,
        progress: Math.random(),
        speed: Math.random() * 0.004 + 0.002,
      }
    }

    function drawGlow(x: number, y: number, radius: number, color: string, alpha: number, blur: number) {
      if (!ctx) return
      ctx.save()
      ctx.shadowColor = color
      ctx.shadowBlur = blur
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.restore()
    }

    function draw(t: number) {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Subtle dot grid background
      ctx.globalAlpha = 0.06
      ctx.fillStyle = "#E8720A"
      const gridSize = 45
      for (let gx = 0; gx < canvas.width; gx += gridSize) {
        for (let gy = 0; gy < canvas.height; gy += gridSize) {
          ctx.beginPath()
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1

      // Draw edges between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist > CONNECT_DIST) continue

          const proximity = 1 - dist / CONNECT_DIST
          const pulse = 0.5 + 0.5 * Math.sin(t * 0.0008 + a.pulseOffset + b.pulseOffset)
          const alpha = proximity * pulse * 0.35

          ctx.save()
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(232, 114, 10, ${alpha})`
          ctx.lineWidth = proximity * 1.2
          if (a.isHub || b.isHub) {
            ctx.shadowColor = "#E8720A"
            ctx.shadowBlur = 4
            ctx.lineWidth = proximity * 1.8
            ctx.strokeStyle = `rgba(255, 150, 30, ${alpha * 1.4})`
          }
          ctx.stroke()
          ctx.restore()
        }
      }

      // Draw particles traveling along edges
      for (let p = 0; p < particles.length; p++) {
        const particle = particles[p]
        const from = nodes[particle.fromNode]
        const to = nodes[particle.toNode]
        if (!from || !to) continue

        const dist = Math.hypot(from.x - to.x, from.y - to.y)
        if (dist > CONNECT_DIST * 1.5) {
          spawnParticle(p)
          continue
        }

        const px = from.x + (to.x - from.x) * particle.progress
        const py = from.y + (to.y - from.y) * particle.progress

        drawGlow(px, py, 1.8, "#FFD080", 0.9, 8)

        particle.progress += particle.speed
        if (particle.progress >= 1) {
          spawnParticle(p)
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const pulse = 0.7 + 0.3 * Math.sin(t * 0.001 + node.pulseOffset)
        const r = node.radius * pulse
        const alpha = node.opacity * pulse

        if (node.isHub) {
          // Hub node: large glow
          drawGlow(node.x, node.y, r + 4, "#E8720A", alpha * 0.3, 20)
          drawGlow(node.x, node.y, r, "#FFA040", alpha, 10)
        } else {
          drawGlow(node.x, node.y, r, "#E8720A", alpha, 5)
        }

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
