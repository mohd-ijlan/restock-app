// app/api/check-stock/route.ts
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { NextResponse } from 'next/server'

// This function will run when the /api/check-stock URL is called
export async function GET() {
  console.log('Cron Job Started: Checking product stock...')

  // 1. Create a Supabase client
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // 2. Get all products from the database
  const { data, error } = await supabase.from('products').select('*')

  // Manually cast the type to fix the build error
  const products = data as {
    id: string
    name: string | null
    url: string | null
    user_id: string | null
    created_at: string | null
    current_status: string | null
  }[] | null
  // --- END OF FIX ---


  if (!products || products.length === 0) {
    console.log('No products to check.')
    return NextResponse.json({ message: 'No products to check.' })
  }

  // 3. Loop through each product
  for (const product of products) {
    console.log(`Checking product: ${product.name}`)

    try {
      // --- THIS IS THE SCRAPER ---
      // 4. Download the webpage HTML
      const response = await axios.get(product.url!, {
        // You MUST set a User-Agent, or Amazon/Flipkart will block you
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
        },
      })
      const html = response.data

      // 5. Load the HTML into Cheerio (like a mini web browser)
      const $ = cheerio.load(html)

      // --- THIS IS THE CUSTOM PART FOR YOUR AMAZON LINK ---
      // 6. Find the stock status.
      // We are looking for the div with ID 'availability'
      // Amazon often puts "Currently unavailable." inside a span here.
      const stockText = $('#availability').text().toLowerCase().trim()

      console.log(`  Found stock text: "${stockText}"`)

      // 7. Check if the text contains "in stock" or "unavailable"
      let newStatus = 'Check Manually' // Default to this

      // We MUST check for unavailable FIRST
      if (stockText.includes('currently unavailable')) {
        newStatus = 'Out of Stock'
      } else if (stockText.includes('in stock') || stockText.includes('add to cart')) {
        newStatus = 'In Stock'
      }

      // 8. Update the database if the status changed
      if (product.current_status !== newStatus) {
        console.log(`  Status changed to: ${newStatus}. Updating database...`)
        await supabase
          .from('products')
          .update({ current_status: newStatus })
          .eq('id', product.id)
      } else {
        console.log('  Status unchanged.')
      }
      // -----------------------------
    } catch (err: any) {
      console.error(`  Error checking product ${product.name}:`, err.message)
    }
  }

  console.log('Cron Job Finished.')
  // 9. Send a response to Vercel
  return NextResponse.json({ message: 'Stock check complete.' })
}