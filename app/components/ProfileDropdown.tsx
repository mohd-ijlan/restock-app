// app/components/ProfileDropdown.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline'

// This component receives the user's email as a prop
export default function ProfileDropdown({
  email,
  avatarUrl,
}: {
  email: string
  avatarUrl: string | null | undefined
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // This handles the "Sign Out" logic
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/') // Redirect to the landing page
  }

  // This handles the "click outside" to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  // Get the first letter of the email for the avatar
  const avatarLetter = email ? email.charAt(0).toUpperCase() : '?'

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600 hover:bg-gray-300 overflow-hidden"
        >
            {avatarUrl ? (
                <img
                src={avatarUrl}
                alt="User avatar"
                className="h-full w-full object-cover"
                />
            ) : (
                avatarLetter
            )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {/* Top section with email */}
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="text-sm font-medium text-black truncate">
                {email}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/profile" // Placeholder
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <UserCircleIcon className="h-5 w-5 text-gray-500" />
                <span>Profile</span>
              </Link>
              <Link
                href="#" // Placeholder
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Cog6ToothIcon className="h-5 w-5 text-gray-500" />
                <span>Settings</span>
              </Link>
            </div>

            {/* Sign Out Button */}
            <div className="py-1 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}