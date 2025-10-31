// app/components/LogoutButton.tsx
'use client' // This IS a client component

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button
      onClick={handleLogout}
      className="py-2 px-4 rounded-md text-white bg-red-600 hover:bg-red-700"
    >
      Log Out
    </button>
  )
}