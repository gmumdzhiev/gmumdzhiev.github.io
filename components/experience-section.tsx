"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

interface ExperienceItem {
  period: string
  role: string
  company: string
  description: string
  tags: string[]
}

const experiences: ExperienceItem[] = [
  {
    period: "2025 -- Present",
    role: "Senior Software Engineer",
    company: "Recurv",
    description:
      "Frontend architecture for the core platform. Build and maintain design systems, implement performance optimizations, and mentor junior developers.",
    tags: ["React", "TypeScript", "Next.js", "GraphQL"],
  },
  {
    period: "2024 -- 2024",
    role: "Software Engineer",
    company: "RedBanana",
    description:
        "Developed commercial webshops. Build upon PHP",
    tags: ["PHP",],
  },
  {
    period: "2021 -- 2023",
    role: "Software Engineer",
    company: "Optios BV",
    description:
      "Developed full-stack features for a SaaS product serving 50K+ users. Implemented real-time collaboration tools and payment integrations.",
    tags: ["Node.js", "PHP", "React", "PostgreSQL", "AWS"],
  },
  {
    period: "2019 -- 2021",
    role: "Frontend Developer",
    company: "DN Analytics",
    description:
      "Built interactive websites and web applications for clients across various industries. Focused on animations, accessibility, and responsive design.",
    tags: ["JavaScript", "React", "CSS", "PostgreSQL"],
  },
  {
    period: "2018 -- 2019",
    role: "Junior Developer / Internship",
    company: "CanDoIt",
    description:
      "Started career building landing pages and small web apps. Learned fundamentals of web development and modern tooling.",
    tags: ["HTML", "CSS", "JavaScript", "React", "React-native", "Git"],
  },
]

export function ExperienceSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section aria-labelledby="experience-heading">
      <h2
        id="experience-heading"
        className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-6"
      >
        {"// Experience"}
      </h2>

      <div className="flex flex-col">
        {experiences.map((exp, i) => (
          <button
            key={i}
            className="group text-left border-t border-border py-4 cursor-pointer transition-colors hover:bg-accent/30"
            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
            aria-expanded={expandedIndex === i}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <ChevronRight
                    className={`h-3 w-3 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                      expandedIndex === i ? "rotate-90" : ""
                    }`}
                  />
                  <span className="text-xs md:text-sm text-foreground font-bold truncate">
                    {exp.role}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground pl-5">
                  {exp.company}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground tracking-wider whitespace-nowrap font-mono">
                {exp.period}
              </span>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                expandedIndex === i ? "max-h-60 opacity-100 mt-3" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-xs text-foreground opacity-70 leading-relaxed pl-5 mb-3">
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-2 pl-5">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 border border-border text-muted-foreground tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
        <div className="border-t border-border" />
      </div>
    </section>
  )
}
