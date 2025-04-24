// app/layout.tsx

'use client'

import './globals.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

// export const metadata = {
//   title: 'My Next App',
//   description: 'A simple layout with header and footer',
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  //const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // const toggleTheme = () => {
  //   setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  // }

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-white text-primary dark:bg-white dark:text-white transition-colors">
        <header className="flex items-center justify-between px-6 py-4 border-b dark:bg-primary dark:border-gray-700">
          <div className="flex items-center gap-4">
            <span className="font-bold text-xl">Logo</span>
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/members" className="hover:underline">Members</Link>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>

        <footer className="bg-secondary dark:bg-primary text-center py-4 text-sm text-accent dark:text-accent">
          © 2025 My Next App. All rights reserved.
        </footer>
      </body>
    </html>
  )
}
