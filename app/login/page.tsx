// app/login/page.tsx
'use client' // This tells Next.js this is a Client Component

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client' // Import your client

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient() // Get the Supabase client

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent the form from refreshing the page
    setError(null) // Clear any previous errors

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message) // Show error to the user
    } else {
      // Login successful!
      router.push('/dashboard') // Redirect to the homepage
      router.refresh() // Refresh the page to update server components
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-xs p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">
          Login to Restock
        </h1>
        <form onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black"
            />
          </div>

          {/* Show error message if login fails */}
          {error && (
            <p className="mt-4 text-sm text-center text-red-600">{error}</p>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}