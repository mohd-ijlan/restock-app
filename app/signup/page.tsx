// app/page.tsx
// This is now a SERVER component (no 'use client')

import { createClient } from '@/utils/supabase/server' // Import the SERVER client
import { redirect } from 'next/navigation'
import LogoutButton from './components/LogoutButton' // Import your new button

export default async function Home() {
  const supabase = createClient() // Get the server client

  // Check if a user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (!user) {
    redirect('/login')
  }

  // If there IS a user, show the page
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Restock</h1>
      <p className="mb-4">You are logged in as: {user.email}</p>

      {/* Use the client component for the button */}
      <LogoutButton />
    </main>
  )
}