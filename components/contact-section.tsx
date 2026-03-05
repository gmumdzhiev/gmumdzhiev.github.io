"use client"

import { useState, useEffect } from "react"

export function ContactSection() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      )
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="flex flex-col gap-6 border-t border-border pt-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xs text-muted-foreground tracking-[0.3em] uppercase">
            {"// Get in Touch"}
          </h2>
          <a
            href="mailto:george.mumdzhiev@gmail.com"
            className="text-sm md:text-base text-foreground hover:opacity-60 transition-opacity underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            george.mumdzhiev@gmail.com
          </a>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1">
          <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
            Local Time
          </span>
          <span className="text-sm text-foreground font-mono tabular-nums">
            {time}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-border">
        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          {[
            { label: "GitHub", href: "https://github.com" },
            { label: "LinkedIn", href: "https://linkedin.com" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors tracking-wider uppercase"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="text-[10px] text-muted-foreground tracking-wider">
          {"Built with pixels & code"}
        </p>
      </div>
    </footer>
  )
}
