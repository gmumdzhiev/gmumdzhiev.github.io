import type { Metadata } from 'next'
import { Silkscreen } from 'next/font/google'
import SiteTracker from "@/components/site-tracker"
import './globals.css'

const _silkscreen = Silkscreen({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-silkscreen'
})

export const metadata: Metadata = {
  title: 'Your Name // CV',
  description: 'Personal biography and curriculum vitae',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <SiteTracker />
      </body>
    </html>
  )
}
