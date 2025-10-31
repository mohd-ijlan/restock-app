// app/page.tsx
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// An array for your feature cards
const features = [
  {
    title: 'Instant Notifications',
    description:
      'Get email alerts the moment your tracked products come back in stock.',
  },
  {
    title: 'Track Unlimited Products',
    description:
      'Monitor as many products as you want across different stores.',
  },
  {
    title: 'Smart Monitoring',
    description:
      'Customize when to get notified - when keywords appear or disappear.',
  },
  {
    title: 'Secure & Reliable',
    description: 'Your data is safe with us. Automated checks every hour, 24/7.',
  },
]

export default async function LandingPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Check if user is already logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If logged in, redirect them to their dashboard
  if (user) {
    redirect('/dashboard')
  }

  // If not logged in, show the landing page
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* 1. Navigation Bar */}
      <nav className="w-full h-16 border-b border-gray-200">
        <div className="max-w-6xl mx-auto h-full flex justify-between items-center px-6">
          <Link href="/" className="text-xl font-bold">
            Restock
          </Link>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <main className="flex-grow flex flex-col items-center text-center px-6 py-24">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Never Miss a <span className="text-blue-600">Restock</span> Again
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Track product availability across the web and get instant email
          notifications when items come back in stock.
        </p>
        <Link
          href="/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700"
        >
          Get Started
        </Link>
      </main>

      {/* 3. Features Section */}
      <section className="bg-gray-50 w-full py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              {/* You can add icons here later */}
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}