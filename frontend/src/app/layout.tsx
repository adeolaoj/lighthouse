import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Script from 'next/script'
import { Providers } from './providers'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

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
    <html lang="en" className={poppins.className}>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
