"use client"

import { useState, useEffect } from "react"
import { HeaderSection } from "@/components/header-section"
import { ParticleCanvas } from "@/components/particle-canvas"
import { ExperienceSection } from "@/components/experience-section"
import { SkillsSection } from "@/components/skills-section"
import { ProjectsSection } from "@/components/projects-section"
import { ContactSection } from "@/components/contact-section"
import { SnakeGame } from "@/components/snake-game"

export default function Page() {
  const [showSnake, setShowSnake] = useState(false)
  const [hintPulsing, setHintPulsing] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        !showSnake &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault()
        setShowSnake(true)
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [showSnake])

  // Pulse the hint periodically to draw attention
  useEffect(() => {
    const interval = setInterval(() => {
      setHintPulsing(true)
      setTimeout(() => setHintPulsing(false), 1000)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-16">
          <HeaderSection />

          <ParticleCanvas />

          <ExperienceSection />

          <ProjectsSection />

          <SkillsSection />

          <ContactSection />
        </div>

        <div
          className="fixed bottom-0 left-0 w-full h-px bg-border"
          aria-hidden="true"
        />

        {/* Bottom-left snake hint */}
        <div
          className={`fixed bottom-2 left-3 text-[10px] text-muted-foreground tracking-widest uppercase transition-opacity duration-500 cursor-default select-none ${
            hintPulsing ? "opacity-100" : "opacity-50"
          }`}
        >
          {"[ press arrow key to play ]"}
        </div>
      </main>

      {showSnake && <SnakeGame onClose={() => setShowSnake(false)} />}
    </>
  )
}
