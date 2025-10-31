// app/(app)/profile/page.tsx
'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/solid'

// Define the type for our profile data
type Profile = {
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
}

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  // Fetch the user's profile data when the page loads
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Fetch the profile row from the 'profiles' table
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single() // We only expect one row

      if (data) {
        const profileData = data as Profile
        setFirstName(profileData.first_name || '')
        setLastName(profileData.last_name || '')
        setAvatarUrl(profileData.avatar_url)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [supabase, router])

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      // Show a preview of the image
      setAvatarUrl(URL.createObjectURL(file))
    }
  }

  // Handle form submission
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let publicAvatarUrl = avatarUrl // Keep old URL by default

    // 1. If a new file was selected, upload it
    if (avatarFile) {
      const filePath = `${user.id}/${Date.now()}_${avatarFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true, // Overwrite existing file
        })

      if (uploadError) {
        alert(`Error uploading file: ${uploadError.message}`)
        setLoading(false)
        return
      }

      // 2. Get the public URL of the uploaded file
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)
      publicAvatarUrl = data.publicUrl
    }

    // 3. Update the 'profiles' table

    // @ts-ignore
    const { error: updateError } = await (supabase.from('profiles') as any) // <-- ADD (as any)
      .upsert({
        id: user.id, // This is the linking key
        first_name: firstName,
        last_name: lastName,
        avatar_url: publicAvatarUrl,
      }) // 'upsert' will create the row if it doesn't exist, or update it if it does

    if (updateError) {
      alert(`Error updating profile: ${updateError.message}`)
    } else {
      alert('Profile saved successfully!')
      // Force a refresh of the page/layout to show new avatar
      router.push('/profile')
    }
    setLoading(false)
  }

  return (
    // Main content container
    <div className="max-w-6xl mx-auto p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">Profile</h1>
        <p className="text-gray-600">Manage your account settings.</p>
      </div>

      {/* Profile Form Card */}
      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-lg"
      >
        <div className="flex items-center gap-4">
          {/* Avatar Preview */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="h-20 w-20 text-gray-300" />
          )}
          <label className="cursor-pointer">
            <span className="py-2 px-4 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">
              Change Picture
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black"
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black"
            />
          </div>
        </div>

        {/* Email (read-only) */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="p-3 bg-gray-50 rounded-md mt-1">
            <p className="text-gray-800">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="py-2 px-4 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}