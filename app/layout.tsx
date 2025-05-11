import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Split Wisely',
  description: 'Created by Manuel Colusso',
  icons: {
    icon: 'icon.svg'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
