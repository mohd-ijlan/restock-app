// app/(app)/profile/page.tsx
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { PencilIcon } from '@heroicons/react/24/outline'

export default async function ProfilePage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Fetch the user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch the profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, avatar_url')
    .eq('id', user!.id)
    .single()

    

  return (
    // Main content container
    <div className="max-w-6xl mx-auto p-6 lg:p-8">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Profile</h1>
          <p className="text-gray-600">View and manage your account details.</p>
        </div>
        <Link
          href="/profile/edit"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <PencilIcon className="h-4 w-4" />
          <span>Edit Profile</span>
        </Link>
      </div>

      {/* Profile Display Card */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-lg">
        <div className="flex items-center gap-4 border-b pb-4">
          {/* Avatar */}
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="h-20 w-20 text-gray-300" />
          )}
          {/* Name */}
          <div>
            <h2 className="text-2xl font-bold text-black">
              {profile?.first_name || profile?.last_name
                ? `${profile.first_name || ''} ${profile.last_name || ''}`
                : 'Your Name'}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              First Name
            </label>
            <p className="text-lg text-black">{profile?.first_name || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Last Name
            </label>
            <p className="text-lg text-black">{profile?.last_name || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Email
            </label>
            <p className="text-lg text-black">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}