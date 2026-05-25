"use client"

import { useEffect, useRef } from "react"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  isHub: boolean
  phase: number
  depth: number
}

interface Particle {
  from: number
  to: number
  t: number
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
    const NODE_COUNT = 80
    const HUB_COUNT = 10
    const PARTICLE_COUNT = 30
    const MAX_DIST = 220

    function W() { return window.innerWidth }
    function H() { return window.innerHeight }

    function resize() {
      canvas.width = W() * window.devicePixelRatio
      canvas.height = H() * window.devicePixelRatio
      // setTransform resets accumulated scales from previous resize calls
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
    }

    function init() {
      nodes.length = 0
      particles.length = 0
      for (let i = 0; i < NODE_COUNT; i++) {
        const isHub = i < HUB_COUNT
        const depth = Math.random()
        nodes.push({
          x: Math.random() * W(),
          y: Math.random() * H(),
          vx: (Math.random() - 0.5) * (isHub ? 0.3 : 0.6) * (0.5 + depth * 0.5),
          vy: (Math.random() - 0.5) * (isHub ? 0.3 : 0.6) * (0.5 + depth * 0.5),
          radius: isHub ? 4 + Math.random() * 4 : 1.5 + Math.random() * 2.5 * depth,
          isHub,
          phase: Math.random() * Math.PI * 2,
          depth,
        })
      }
      for (let i = 0; i < PARTICLE_COUNT; i++) resetParticle(i)
    }

    function resetParticle(i: number) {
      const from = Math.floor(Math.random() * NODE_COUNT)
      let to = Math.floor(Math.random() * NODE_COUNT)
      while (to === from) to = Math.floor(Math.random() * NODE_COUNT)
      particles[i] = { from, to, t: 0, speed: 0.005 + Math.random() * 0.012 }
    }

    function glowCircle(x: number, y: number, r: number, color: string, alpha: number, layers = 3) {
      for (let l = layers; l >= 0; l--) {
        const layerR = r + l * r * 1.8
        const layerA = alpha * (l === 0 ? 1 : 0.12 / l)
        ctx.beginPath()
        ctx.arc(x, y, layerR, 0, Math.PI * 2)
        ctx.fillStyle = l === 0
          ? `rgba(${color},${layerA})`
          : `rgba(${color},${Math.min(layerA, 0.15)})`
        ctx.fill()
      }
    }

    function glowLine(
      x1: number, y1: number,
      x2: number, y2: number,
      alpha: number,
      width: number,
      color: string
    ) {
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = `rgba(${color},${alpha * 0.25})`
      ctx.lineWidth = width * 3.5
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = `rgba(${color},${alpha})`
      ctx.lineWidth = width
      ctx.stroke()
    }

    function draw(time: number) {
      const w = W()
      const h = H()
      ctx.clearRect(0, 0, w, h)

      // Subtle dot grid
      ctx.fillStyle = "rgba(232,114,10,0.09)"
      const gs = 48
      for (let gx = 0; gx <= w; gx += gs) {
        for (let gy = 0; gy <= h; gy += gs) {
          ctx.beginPath()
          ctx.arc(gx, gy, 1, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > MAX_DIST) continue

          const proximity = 1 - dist / MAX_DIST
          const pulse = 0.55 + 0.45 * Math.sin(time * 0.00085 + a.phase + b.phase)
          const depthBoost = (a.depth + b.depth) * 0.5
          const hubBoost = (a.isHub || b.isHub) ? 2.2 : 1
          const alpha = proximity * pulse * depthBoost * hubBoost * 0.65
          const width = proximity * depthBoost * hubBoost * 1.4

          glowLine(
            a.x, a.y, b.x, b.y,
            Math.min(alpha, 0.75),
            Math.min(width, 2.2),
            (a.isHub || b.isHub) ? "255,160,40" : "232,114,10"
          )
        }
      }

      // Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const from = nodes[p.from]
        const to = nodes[p.to]
        if (!from || !to) { resetParticle(i); continue }

        const dist = Math.hypot(from.x - to.x, from.y - to.y)
        if (dist > MAX_DIST * 1.6) { resetParticle(i); continue }

        const px = from.x + (to.x - from.x) * p.t
        const py = from.y + (to.y - from.y) * p.t

        const trailLen = 0.12
        const trailStart = Math.max(0, p.t - trailLen)
        const tx = from.x + (to.x - from.x) * trailStart
        const ty = from.y + (to.y - from.y) * trailStart

        const grad = ctx.createLinearGradient(tx, ty, px, py)
        grad.addColorStop(0, "rgba(255,200,80,0)")
        grad.addColorStop(1, "rgba(255,220,100,0.85)")
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(px, py)
        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.stroke()

        glowCircle(px, py, 2.5, "255,220,80", 0.95, 2)

        p.t += p.speed
        if (p.t >= 1) resetParticle(i)
      }

      // Nodes
      for (const node of nodes) {
        const pulse = 0.75 + 0.25 * Math.sin(time * 0.0012 + node.phase)
        const r = node.radius * pulse
        const alpha = (0.5 + 0.5 * node.depth) * pulse

        if (node.isHub) {
          glowCircle(node.x, node.y, r, "255,130,20", alpha * 0.9, 4)
          glowCircle(node.x, node.y, r * 0.45, "255,200,100", 1, 1)
        } else {
          glowCircle(node.x, node.y, r, "232,114,10", alpha * 0.85, 2)
        }

        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > w) node.vx *= -1
        if (node.y < 0 || node.y > h) node.vy *= -1
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    init()
    animId = requestAnimationFrame(draw)

    function onResize() {
      resize()
      init()
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9, zIndex: 0 }}
      aria-hidden
    />
  )
}
