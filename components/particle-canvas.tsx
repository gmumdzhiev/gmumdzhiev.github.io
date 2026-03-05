"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  size: number
  density: number
  color: string
}

const WORDS = ["HELLO", "HALLO", "BONJOUR"]

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const textRef = useRef<string>(WORDS[0])
  const wordIndexRef = useRef(0)
  const isHoveringRef = useRef(false)
  const hasInteractedRef = useRef(false)

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)

    const displayWidth = canvas.offsetWidth
    const displayHeight = canvas.offsetHeight

    ctx.clearRect(0, 0, displayWidth, displayHeight)
    ctx.fillStyle = "#e8e4df"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const fontSize = Math.min(displayWidth / 5, displayHeight / 2, 100)
    ctx.font = `bold ${fontSize}px monospace`
    ctx.fillText(textRef.current, displayWidth / 2, displayHeight / 2)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const particles: Particle[] = []
    const gap = 3

    for (let y = 0; y < canvas.height; y += gap) {
      for (let x = 0; x < canvas.width; x += gap) {
        const index = (y * canvas.width + x) * 4
        const alpha = imageData.data[index + 3]
        if (alpha > 128) {
          const posX = x / dpr
          const posY = y / dpr
          particles.push({
            x: posX,
            y: posY,
            baseX: posX,
            baseY: posY,
            size: 1.5,
            density: Math.random() * 30 + 1,
            color: `rgba(232, 228, 223, ${0.6 + Math.random() * 0.4})`,
          })
        }
      }
    }

    particlesRef.current = particles
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const displayWidth = canvas.offsetWidth
    const displayHeight = canvas.offsetHeight

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.scale(dpr, dpr)

    const mouse = mouseRef.current
    const radius = 100

    for (const p of particlesRef.current) {
      const dx = mouse.x - p.x
      const dy = mouse.y - p.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      const forceDirectionX = dx / distance
      const forceDirectionY = dy / distance

      const maxDistance = radius
      const force = (maxDistance - distance) / maxDistance
      const directionX = forceDirectionX * force * p.density
      const directionY = forceDirectionY * force * p.density

      if (distance < radius) {
        p.x -= directionX * 2
        p.y -= directionY * 2
      } else {
        if (p.x !== p.baseX) {
          const dx2 = p.x - p.baseX
          p.x -= dx2 / 10
        }
        if (p.y !== p.baseY) {
          const dy2 = p.y - p.baseY
          p.y -= dy2 / 10
        }
      }

      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fill()
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }

    const handleMouseEnter = () => {
      if (!isHoveringRef.current) {
        isHoveringRef.current = true
        if (hasInteractedRef.current) {
          wordIndexRef.current = (wordIndexRef.current + 1) % WORDS.length
          textRef.current = WORDS[wordIndexRef.current]
          initParticles()
        }
        hasInteractedRef.current = true
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
      isHoveringRef.current = false
    }

    initParticles()
    animate()

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("touchmove", handleTouchMove)
    canvas.addEventListener("mouseenter", handleMouseEnter)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("resize", initParticles)

    return () => {
      cancelAnimationFrame(animationRef.current)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("mouseenter", handleMouseEnter)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("resize", initParticles)
    }
  }, [initParticles, animate])

  return (
    <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden border border-border">
      <div className="absolute bottom-2 left-3 text-[10px] text-muted-foreground tracking-widest uppercase">
        {"[ press arrow key to interact ]"}
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        aria-label="Interactive particle text animation - hover to cycle greetings in different languages"
      />
      <div className="absolute bottom-2 right-3 text-[10px] text-muted-foreground tracking-widest uppercase">
        {"[ move cursor to interact ]"}
      </div>
    </div>
  )
}
