// app/(app)/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import {
  ArchiveBoxIcon,
  BellAlertIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

// Import our client component
import ProductList from '@/app/components/ProductList'


type Product = {
  id: string
  name: string | null
  url: string | null
  current_status: string | null
}

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get user to fetch products
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // --- 1. FETCH DATA ---
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user!.id) // user!.id tells TypeScript user is not null

  // --- 2. PREPARE STATS ---
  const totalProducts = products ? products.length : 0
  const activeMonitors = totalProducts
  const notificationsSent = 0

  // --- 3. RENDER PAGE ---
  return (
    // Main content container
    <div className="max-w-6xl mx-auto p-6 lg:p-8">
      {/* Header (from your screenshot) */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Your Tracked Products</h1>
          <p className="text-gray-600">
            Monitor product availability and get notified of changes
          </p>
        </div>
        <Link
          href="/add-product"
          className="hidden sm:flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" strokeWidth={2} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Stat Cards (from your screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Total Products */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <p className="text-3xl font-bold text-black">{totalProducts}</p>
          </div>
          <ArchiveBoxIcon className="h-10 w-10 text-blue-500" />
        </div>

        {/* Card 2: Active Monitors */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">Active Monitors</p>
            <p className="text-3xl font-bold text-black">{activeMonitors}</p>
          </div>
          <ChartBarIcon className="h-10 w-10 text-green-500" />
        </div>

        {/* Card 3: Notifications Sent */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">Notifications Sent</p>
            <p className="text-3xl font-bold text-black">{notificationsSent}</p>
          </div>
          <BellAlertIcon className="h-10 w-10 text-yellow-500" />
        </div>
      </div>

      {/* Content Area: Shows empty state or product list */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {totalProducts === 0 ? (
          // Empty State (from your screenshot)
          <div className="text-center py-12 px-6">
            <ArchiveBoxIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-black mb-2">
              No products tracked yet
            </h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Start monitoring products by adding their URLs. You'll receive
              email notifications when their availability changes.
            </p>
            <Link
              href="/add-product"
              className="inline-flex items-center gap-1 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5" strokeWidth={2} />
              <span>Add Your First Product</span>
            </Link>
          </div>
        ) : (
          // Populated State - We render the new Client Component
          <ProductList products={products} />
        )}
      </div>
    </div>
  )
}