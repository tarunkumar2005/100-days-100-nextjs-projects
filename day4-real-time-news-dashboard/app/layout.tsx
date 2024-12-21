import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Real Time News Dashboard',
  description: 'Stay updated with the latest news in a sleek, modern interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text`}>
        <div className="min-h-screen gradient-bg">
          {children}
        </div>
      </body>
    </html>
  )
}