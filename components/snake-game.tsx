"use client"

import { useEffect, useRef, useState, useCallback } from "react"

const CELL_SIZE = 12
const GRID_COLOR = "#1f1f1f"
const SNAKE_COLOR = "#e8e4df"
const FOOD_COLOR = "#6b6660"
const BORDER_COLOR = "#3a3a3a"

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"
type Point = { x: number; y: number }

export function SnakeGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const snakeRef = useRef<Point[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ])
  const directionRef = useRef<Direction>("RIGHT")
  const nextDirectionRef = useRef<Direction>("RIGHT")
  const foodRef = useRef<Point>({ x: 15, y: 10 })
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const gameOverRef = useRef(false)

  const cols = useRef(0)
  const rows = useRef(0)

  const spawnFood = useCallback(() => {
    const snake = snakeRef.current
    let pos: Point
    do {
      pos = {
        x: Math.floor(Math.random() * cols.current),
        y: Math.floor(Math.random() * rows.current),
      }
    } while (snake.some((s) => s.x === pos.x && s.y === pos.y))
    foodRef.current = pos
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height

    // Background
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, w, h)

    // Grid lines
    ctx.strokeStyle = GRID_COLOR
    ctx.lineWidth = 0.5
    for (let x = 0; x <= w; x += CELL_SIZE) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let y = 0; y <= h; y += CELL_SIZE) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    // Food
    const food = foodRef.current
    ctx.fillStyle = FOOD_COLOR
    ctx.fillRect(
      food.x * CELL_SIZE + 1,
      food.y * CELL_SIZE + 1,
      CELL_SIZE - 2,
      CELL_SIZE - 2
    )

    // Snake
    const snake = snakeRef.current
    snake.forEach((segment, i) => {
      const brightness = 1 - (i / snake.length) * 0.5
      ctx.fillStyle =
        i === 0
          ? SNAKE_COLOR
          : `rgba(232, 228, 223, ${brightness})`
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      )
    })

    // Border
    ctx.strokeStyle = BORDER_COLOR
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, w, h)
  }, [])

  const tick = useCallback(() => {
    if (gameOverRef.current) return

    const snake = [...snakeRef.current]
    directionRef.current = nextDirectionRef.current
    const head = { ...snake[0] }

    switch (directionRef.current) {
      case "UP":
        head.y -= 1
        break
      case "DOWN":
        head.y += 1
        break
      case "LEFT":
        head.x -= 1
        break
      case "RIGHT":
        head.x += 1
        break
    }

    // Wall collision
    if (
      head.x < 0 ||
      head.x >= cols.current ||
      head.y < 0 ||
      head.y >= rows.current
    ) {
      gameOverRef.current = true
      setGameOver(true)
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
      return
    }

    // Self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      gameOverRef.current = true
      setGameOver(true)
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
      return
    }

    snake.unshift(head)

    // Eat food
    const food = foodRef.current
    if (head.x === food.x && head.y === food.y) {
      setScore((s) => s + 1)
      spawnFood()
    } else {
      snake.pop()
    }

    snakeRef.current = snake
    draw()
  }, [draw, spawnFood])

  const restart = useCallback(() => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]
    directionRef.current = "RIGHT"
    nextDirectionRef.current = "RIGHT"
    gameOverRef.current = false
    setGameOver(false)
    setScore(0)
    spawnFood()
    draw()

    if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    gameLoopRef.current = setInterval(tick, 100)
  }, [draw, spawnFood, tick])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = canvas.parentElement
    if (!container) return

    const w = container.clientWidth
    const h = container.clientHeight
    canvas.width = Math.floor(w / CELL_SIZE) * CELL_SIZE
    canvas.height = Math.floor(h / CELL_SIZE) * CELL_SIZE
    cols.current = Math.floor(canvas.width / CELL_SIZE)
    rows.current = Math.floor(canvas.height / CELL_SIZE)

    spawnFood()
    draw()

    gameLoopRef.current = setInterval(tick, 100)

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [draw, tick, spawnFood])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const dir = directionRef.current
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          if (dir !== "DOWN") nextDirectionRef.current = "UP"
          break
        case "ArrowDown":
          e.preventDefault()
          if (dir !== "UP") nextDirectionRef.current = "DOWN"
          break
        case "ArrowLeft":
          e.preventDefault()
          if (dir !== "RIGHT") nextDirectionRef.current = "LEFT"
          break
        case "ArrowRight":
          e.preventDefault()
          if (dir !== "LEFT") nextDirectionRef.current = "RIGHT"
          break
        case "Escape":
          e.preventDefault()
          onClose()
          break
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-lg">
        <span className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
          {"// Snake"}
        </span>
        <span className="text-xs text-foreground font-mono tabular-nums">
          Score: {score}
        </span>
        <button
          onClick={onClose}
          className="text-[10px] text-muted-foreground hover:text-foreground tracking-widest uppercase transition-colors cursor-pointer"
        >
          {"[ ESC ]"}
        </button>
      </div>

      {/* Game area */}
      <div className="relative w-full max-w-lg aspect-[4/3] border border-border">
        <canvas ref={canvasRef} className="w-full h-full" />

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80">
            <span className="text-sm text-foreground tracking-wider uppercase">
              Game Over
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Score: {score}
            </span>
            <button
              onClick={restart}
              className="text-[10px] text-foreground border border-border px-4 py-2 tracking-widest uppercase hover:bg-accent transition-colors cursor-pointer"
            >
              {"[ Restart ]"}
            </button>
          </div>
        )}
      </div>

      {/* Controls hint */}
      <div className="flex items-center gap-6 text-[10px] text-muted-foreground tracking-wider">
        <span>Arrow keys to move</span>
        <span>ESC to close</span>
      </div>
    </div>
  )
}
