// app/(app)/edit-product/[id]/page.tsx
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { updateProduct } from '@/app/(app)/actions' // We will create this next

// This 'params' prop is how we get the [id] from the URL
export default async function EditProduct({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // 1. Fetch the specific product's data
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single() // We only expect one result

  if (error || !product) {
    console.error('Error fetching product or product not found', error)
    redirect('/dashboard') // If error or no product, go back
  }

  // 2. Create the 'update' action for this specific product
  // We bind the product.id to the action
  const updateProductWithId = updateProduct.bind(null, product.id)

  // 3. This is the HTML form, pre-filled with data
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Edit Product
        </h1>
        {/* We pass the new action to the form */}
        <form action={updateProductWithId}>
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
              // Pre-fill the form with existing data
              defaultValue={product.name!}
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
              // Pre-fill the form with existing data
              defaultValue={product.url!}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black"
            />
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}