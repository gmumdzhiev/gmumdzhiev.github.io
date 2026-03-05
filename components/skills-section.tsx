"use client"

import { useEffect, useRef, useState } from "react"

interface SkillBar {
  name: string
  level: number
}

const skills: SkillBar[] = [
  { name: "TypeScript", level: 95 },
  { name: "React / Next.js", level: 92 },
    { name: "React-native", level: 75 },
    { name: "Angular", level: 27 },
    { name: "CSS / Tailwind", level: 90 },
    { name: "Javascript", level: 98 },
  { name: "PHP", level: 55 },
  { name: "PostgreSQL", level: 72 },
    { name: "GIT", level: 80 },
    { name: "NPM", level: 80 },
    { name: "Figma", level: 75 },
]

export function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} aria-labelledby="skills-heading">
      <h2
        id="skills-heading"
        className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-6"
      >
        {"// Skills"}
      </h2>

      <div className="flex flex-col gap-3">
        {skills.map((skill, i) => (
          <div key={skill.name} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] md:text-xs text-foreground tracking-wider">
                {skill.name}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {skill.level}%
              </span>
            </div>
            <div className="h-1.5 bg-accent w-full overflow-hidden">
              <div
                className="h-full bg-foreground transition-all ease-out"
                style={{
                  width: visible ? `${skill.level}%` : "0%",
                  transitionDuration: `${800 + i * 100}ms`,
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Years Exp.", value: "7+" },
          { label: "Projects", value: "40+" },
          { label: "Clients", value: "20+" },
          { label: "Commits", value: "10K+" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border border-border p-3 flex flex-col items-center gap-1"
          >
            <span className="text-lg md:text-xl font-bold text-foreground">
              {stat.value}
            </span>
            <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
