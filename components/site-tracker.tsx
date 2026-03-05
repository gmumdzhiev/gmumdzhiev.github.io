"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore"
import { ThumbsUp, Eye } from "lucide-react"

const PASTEL_COLORS = [
    "#ffb3ba", "#ffdfba", "#ffffba", "#baffc9",
    "#bae1ff", "#e8baff", "#ffd1dc", "#c9f0ff",
]

interface Particle {
    id: number
    x: number
    y: number
    vx: number
    vy: number
    color: string
    size: number
    life: number
    maxLife: number
}

function PixelFireworks({ trigger }: { trigger: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const animFrameRef = useRef<number>(0)
    const counterRef = useRef(0)



    const spawnBurst = useCallback((x: number, y: number) => {
        const count = 48
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2
            const speed = 2 + Math.random() * 4
            particlesRef.current.push({
                id: counterRef.current++,
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
                size: Math.random() < 0.5 ? 4 : 6,
                life: 1,
                maxLife: 60 + Math.random() * 40,
            })
        }
    }, [])

    useEffect(() => {
        if (trigger === 0) return

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const positions = [
            { x: canvas.width * 0.3, y: canvas.height * 0.35 },
            { x: canvas.width * 0.6, y: canvas.height * 0.25 },
            { x: canvas.width * 0.5, y: canvas.height * 0.5 },
        ]

        positions.forEach((pos, i) => {
            setTimeout(() => spawnBurst(pos.x, pos.y), i * 180)
        })

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particlesRef.current = particlesRef.current.filter(p => p.life > 0)

            for (const p of particlesRef.current) {
                p.x += p.vx
                p.y += p.vy
                p.vy += 0.08
                p.vx *= 0.98
                p.life -= 1 / p.maxLife

                ctx.globalAlpha = Math.max(0, p.life)
                ctx.fillStyle = p.color
                ctx.fillRect(
                    Math.round(p.x),
                    Math.round(p.y),
                    p.size,
                    p.size
                )
            }

            ctx.globalAlpha = 1

            if (particlesRef.current.length > 0) {
                animFrameRef.current = requestAnimationFrame(animate)
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
            }
        }

        animFrameRef.current = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animFrameRef.current)
    }, [trigger, spawnBurst])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
            style={{ imageRendering: "pixelated" }}
        />
    )
}

export default function SiteTracker() {
    const [views, setViews] = useState<number | null>(null)
    const [likes, setLikes] = useState<number | null>(null)
    const [hasLiked, setHasLiked] = useState(false)
    const [fireworksTrigger, setFireworksTrigger] = useState(0)

    useEffect(() => {
        const run = async () => {
            const ref = doc(db, "stats", "portfolio")
            const snap = await getDoc(ref)

            if (!snap.exists()) {
                await setDoc(ref, { views: 1, likes: 0 })
                setViews(1)
                setLikes(0)
            } else {
                await updateDoc(ref, { views: increment(1) })
                setViews((snap.data().views ?? 0) + 1)
                setLikes(snap.data().likes ?? 0)
            }

            const liked = localStorage.getItem("portfolio-liked")
            if (liked) setHasLiked(true)
        }

        run()
    }, [])

    const handleLike = async () => {
        if (hasLiked) return
        const ref = doc(db, "stats", "portfolio")
        await updateDoc(ref, { likes: increment(1) })
        setLikes((prev) => (prev ?? 0) + 1)
        setHasLiked(true)
        localStorage.setItem("portfolio-liked", "true")
        setFireworksTrigger(prev => prev + 1)  // increment instead of boolean
    }

    return (
        <>
            <PixelFireworks trigger={fireworksTrigger} />
            <div className="fixed bottom-4 right-4 flex items-center gap-3 bg-background/80 backdrop-blur border rounded-full px-4 py-2 shadow-lg text-sm z-40">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Eye className="w-4 h-4" />
            {views ?? "..."}
        </span>
                <button
                    onClick={handleLike}
                    disabled={hasLiked}
                    className={`flex items-center gap-1 transition-colors ${
                        hasLiked ? "text-blue-500" : "text-muted-foreground hover:text-blue-500"
                    }`}
                >
                    <ThumbsUp className="w-4 h-4" />
                    {likes ?? "..."}
                </button>
            </div>
        </>
    )
}