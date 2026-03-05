import { Mail, Github, Linkedin, DownloadIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export function HeaderSection() {
  const [isAvailable] = useState<boolean>(false)
  return (
    <header className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <p className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
          Available for work
        </p>

        {isAvailable ? (
          <>
            <div className="h-3 w-3 bg-lime-500 animate-pulse" />
            <p>Online</p>
          </>
        ) : (
          <>
            <div className="h-3 w-3 bg-amber-500 animate-pulse" />
            <p>Offline</p>
          </>
        )}

      </div>

      <div className="flex items-start gap-6">
        <div className="relative flex-shrink-0 h-24 w-24 md:h-32 md:w-32 border border-border overflow-hidden bg-accent">
          <Image
            src="/avatar.jpg"
            alt="Profile photo"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 96px, 128px"
          />
          {/* Scanline overlay for pixel aesthetic */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
            }}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col gap-2 min-w-0">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight text-balance">
            Georgi Mumdzhiev
          </h1>
          <p className="text-sm md:text-base text-muted-foreground tracking-wide">
            Software Engineer / Creative Developer
          </p>
        </div>
      </div>

      <p className="text-xs md:text-sm text-foreground leading-relaxed max-w-xl opacity-80">
        I craft digital experiences at the intersection of design and engineering.
        Passionate about building performant, accessible, and visually striking interfaces
        that leave a lasting impression.
      </p>

      <nav className="flex items-center gap-6" aria-label="Social links">
        <a
          href="mailto:george.mumdzhiev@gmail.com"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Email"
        >
          <Mail className="h-4 w-4" />
        </a>
        <a
          href="https://github.com/gmumdzhiev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="GitHub"
        >
          <Github className="h-4 w-4" />
        </a>
        <a
          href="https://www.linkedin.com/in/georgi-mumdzhiev/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </a>
        <a
            href="/Georgi-Mumdzhiev-CV.pdf"
            download
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Download CV"
        >
          <DownloadIcon className="h-4 w-4 animate-bounce" />
        </a>

      </nav>
    </header>
  )
}
