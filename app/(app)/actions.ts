// app/(app)/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteProduct(productId: string) {
  console.log('--- SERVER ACTION: deleteProduct ---') // Log 1
  console.log('Attempting to delete ID:', productId) // Log 2

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  type ProductTable = { id: string; name: string; url: string }

  // Run the delete command
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) {
    console.error('Full error object:', error) // Log 3 (The Error)
    return { error: `Failed: ${error.message}` }
  }

  revalidatePath('/dashboard')
  console.log('Delete successful for ID:', productId) // Log 4 (Success)
  return { success: true }
}

// app/(app)/actions.ts

// ... (your existing deleteProduct function is up here)

// Define the Product type to match your 'products' table structure
type Product = {
  id: string
  name: string
  url: string
  // Add other fields as needed
}

// app/(app)/actions.ts

// ... (your existing deleteProduct function is up here)

export async function updateProduct(productId: string, formData: FormData) {
  'use server'

  console.log('--- SERVER ACTION: updateProduct ---')
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get the new data from the form
  const newName = formData.get('productName') as string
  const newUrl = formData.get('productUrl') as string

  if (!newName || !newUrl) {
    return { error: 'Name and URL are required.' }
  }

  // Run the update command

  // @ts-ignore
  const { error } = await (supabase.from('products') as any)
    .from('products')
    .update({ name: newName, url: newUrl })
    .eq('id', productId) // Only update this specific product

  if (error) {
    console.error('Error updating product:', error)
    return { error: error.message }
  }

  // Refresh the dashboard and redirect
  revalidatePath('/dashboard')
  redirect('/dashboard')
}