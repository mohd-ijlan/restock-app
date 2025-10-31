// app/(app)/layout.tsx
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ProfileDropdown from '@/app/components/ProfileDropdown'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // This layout will now protect all child pages
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile to get avatar_url
  const { data, error } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .single()

  // This line manually tells TypeScript the type
  const profile = data as { avatar_url: string | null } | null

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-black">
      {/* 1. This is your Navbar */}
      <nav className="h-16 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto h-full flex justify-between items-center px-6">
          {/* Logo and Nav Links */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-1">
              <Image
                src="/icon.png" // Assumes your logo is named icon.png
                alt="Restock Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">Restock</span>
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
            <Link
              href="/add-product"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              + Add Product
            </Link>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-4">
            <ProfileDropdown email={user.email!} avatarUrl={profile?.avatar_url} />
          </div>
        </div>
      </nav>

      {/* 2. This is where your page content will go */}
      <main className="flex-grow">{children}</main>
    </div>
  )
}