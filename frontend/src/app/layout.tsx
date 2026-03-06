import type { Metadata } from 'next'
import Script from 'next/script'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lighthouse',
  description: 'Research opportunities at Johns Hopkins University',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}

