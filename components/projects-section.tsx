"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"

interface Project {
  title: string
  description: string
  tags: string[]
  link: string
  year: string
}

const projects: Project[] = [
  {
    title: "Crud App",
    description:
      "CRUD based application - with add, edit and delete functionality.",
    tags: ["Typescript","React", "Tailwind", "CSS", "HTML"],
    link: "https://github.com/gmumdzhiev/crud-app",
    year: "2025",
  },
  {
    title: "Task planner",
    description:
      "Task application for efficiently managing task, holidays into your planner.",
    tags: ["Typescript","React", "Tailwind", "CSS", "HTML"],
    link: "https://github.com/gmumdzhiev/task-planner",
    year: "2025",
  },
  {
    title: "Brick lab",
    description:
      "Application designed to have fun with Typescript and Rebrickable API.",
    tags: ["Typescript","React", "Tailwind", "CSS", "HTML"],
    link: "https://github.com/gmumdzhiev/brick-lab",
    year: "2025",
  },
  {
    title: "News neuron",
    description:
      "Application designed to efficiently manage news articles.",
    tags: ["Typescript","React", "Styled components", "CSS", "HTML"],
    link: "https://github.com/gmumdzhiev/news-neuron",
    year: "2024",
  },
]

export function ProjectsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section aria-labelledby="projects-heading">
      <h2
        id="projects-heading"
        className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-6"
      >
        {"// Selected Projects"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
        {projects.map((project, i) => (
          <a
            key={i}
            href={project.link}
            className="group bg-background p-5 flex flex-col gap-3 transition-colors hover:bg-accent/30 relative"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs md:text-sm font-bold text-foreground">
                {project.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono">
                  {project.year}
                </span>
                <ExternalLink
                  className={`h-3 w-3 text-muted-foreground transition-all duration-200 ${
                    hoveredIndex === i
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-1"
                  }`}
                />
              </div>
            </div>
            <p className="text-[10px] md:text-xs text-foreground opacity-60 leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 border border-border text-muted-foreground tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
