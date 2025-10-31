// app/components/ProductList.tsx
'use client' // This MUST be a Client Component

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { deleteProduct } from '@/app/(app)/actions' // Import our new Server Action
import { XMarkIcon } from '@heroicons/react/24/outline'

// Define Product type for the component props
type Product = {
  id: string
  name: string
  url: string
  current_status: string
}

// This component takes the 'products' array as a "prop"
export default function ProductList({ products }: { products: Product[] }) {
  // --- State Management ---
  // 1. For the pop-up modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 2. To know which product to delete
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  // 3. For loading/disabled state on the delete button
  const [isPending, startTransition] = useTransition()

  // --- Modal Functions ---
  // This runs when the user clicks the "Delete" link
  const openDeleteModal = (id: string) => {
    setSelectedProductId(id)
    setIsModalOpen(true)
  }

  // This runs when the user clicks "Cancel" or the 'X'
  const closeDeleteModal = () => {
    setIsModalOpen(false)
    setSelectedProductId(null)
  }

  // --- Delete Action ---
  // This runs when the user clicks the final "Confirm Delete" button
  const handleConfirmDelete = () => {
    if (!selectedProductId) return

    // 'startTransition' gives us the 'isPending' state
    // so we can disable the button while it works
    startTransition(async () => {
      const result = await deleteProduct(selectedProductId)
      if (result?.error) {
        alert(result.error) // Show an error if it fails
      }
      closeDeleteModal() // Close the modal
    })
  }

  // --- Render ---
  return (
    <div>
      {/* This is your grid of product cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            // ... (Status badge logic, same as before)
            let statusClasses = ''
            if (product.current_status === 'In Stock') {
              statusClasses = 'bg-green-100 text-green-800'
            } else if (product.current_status === 'Out of Stock') {
              statusClasses = 'bg-red-100 text-red-800'
            } else {
              statusClasses = 'bg-gray-100 text-gray-800'
            }

            return (
              <div
                key={product.id}
                className="flex flex-col justify-between rounded-lg shadow-md border border-gray-200"
              >
                {/* ... (Top section, same as before) */}
                <div className="p-4">
                  <h3
                    className="text-lg font-semibold text-black truncate"
                    title={product.name!}
                  >
                    {product.name}
                  </h3>
                  <p
                    className="text-sm text-gray-500 truncate"
                    title={product.url!}
                  >
                    {product.url}
                  </p>
                </div>

                {/* ... (Middle section, same as before) */}
                <div className="px-4 py-2 border-t border-gray-100">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full ${statusClasses}`}
                  >
                    {product.current_status}
                  </span>
                </div>

                {/* Bottom section: Actions (NOW FUNCTIONAL) */}
                <div className="flex justify-end gap-4 p-4 border-t border-gray-100">
                  <Link
                    href={`/edit-product/${product.id}`} // <-- THIS IS THE NEW LINE
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  {/* The Delete link is now a button that opens the modal */}
                  <button
                    onClick={() => openDeleteModal(product.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* --- This is your new Delete Confirmation Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-black">Confirm Deletion</h3>
              <button onClick={closeDeleteModal} className="text-gray-400">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Are you sure you want to delete this product? This action cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={closeDeleteModal}
                className="py-2 px-4 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isPending} // Disable button while deleting
                className="py-2 px-4 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}