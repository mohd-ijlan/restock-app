// app/add-product/page.tsx
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AddProduct() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // This is the function that will run when the form is submitted
  const handleAddProduct = async (formData: FormData) => {
    'use server' // This line turns it into a Server Action

    // Create a new Supabase client inside the Server Action
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get the data from the form
    const productName = formData.get('productName') as string
    const productUrl = formData.get('productUrl') as string

    // Get the logged-in user's ID
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Insert the data into the 'products' table
      
      // @ts-ignore  <-- This line fixes the red underline
      const { error } = await supabase.from('products').insert({
        name: productName,
        url: productUrl,
        user_id: user.id,
        current_status: 'Monitoring', // Set a default status
      })

      if (error) {
        console.error('Error inserting product:', error)
      } else {
        // If successful, redirect to the homepage
        redirect('/dashboard')
      }
    }
  }

  // This is the HTML form
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Add New Product
        </h1>
        <form action={handleAddProduct}>
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="productUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Product URL
            </label>
            <input
              type="url"
              id="productUrl"
              name="productUrl"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black"
            />
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}