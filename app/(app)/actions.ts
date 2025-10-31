// app/(app)/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteProduct(productId: string) {
  console.log('--- SERVER ACTION: deleteProduct ---')
  console.log('Attempting to delete ID:', productId)

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Run the delete command
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) {
    console.error('Full error object:', error)
    return { error: `Failed: ${error.message}` }
  }

  revalidatePath('/dashboard')
  console.log('Delete successful for ID:', productId)
  return { success: true }
}

export async function updateProduct(productId: string, formData: FormData) {
  'use server'

  console.log('--- SERVER ACTION: updateProduct ---')
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get the new data from the form
  const newName = formData.get('productName') as string
  const newUrl = formData.get('productUrl') as string

  if (!newName || !newUrl) {
    console.error('Error: Name and URL are required.')
    return // <-- Fix for Vercel build
  }

  // Manually cast the type to fix the build error
  const { error } = await (supabase.from('products') as any)
    .update({ name: newName, url: newUrl })
    .eq('id', productId) // Only update this specific product

  if (error) {
    console.error('Error updating product:', error)
    return // <-- Fix for Vercel build
  }

  // Refresh the dashboard and redirect
  revalidatePath('/dashboard')
  redirect('/dashboard')
}