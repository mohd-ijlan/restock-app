// app/components/ThemeToggle.tsx
'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // This hook ensures the component is mounted on the client
  // before rendering, avoiding hydration mismatch.
  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    // Render a placeholder or nothing until mounted
    // This prevents the icon from "flickering" on page load
    return <div className="h-9 w-9" />
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center h-9 w-9 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  )
}