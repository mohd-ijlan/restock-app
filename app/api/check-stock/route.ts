// app/api/check-stock/route.ts
import { createClient } from '@supabase/supabase-js' // We need the standard client for admin
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Resend } from 'resend' // <-- IMPORT RESEND
import axios from 'axios'
import * as cheerio from 'cheerio'
import { Database } from '@/utils/types/supabase'

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Initialize the Supabase Admin client
// This uses your new "master key" to perform secure tasks
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// This function will run when the /api/check-stock URL is called
export async function GET() {
  console.log('Cron Job Started: Checking product stock...')

  // 1. Get all products from the database
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('*')

  if (!products || products.length === 0) {
    console.log('No products to check.')
    return NextResponse.json({ message: 'No products to check.' })
  }

  // 2. Loop through each product
  for (const product of products) {
    console.log(`Checking product: ${product.name}`)
    try {
      // 3. Download the webpage HTML
      const response = await axios.get(product.url!, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        },
      })
      const html = response.data
      const $ = cheerio.load(html)

      // 4. Find the stock status
      const stockText = $('#availability').text().toLowerCase().trim()
      console.log(`  Found stock text: "${stockText}"`)

      let newStatus = 'Check Manually'
      if (stockText.includes('currently unavailable')) {
        newStatus = 'Out of Stock'
      } else if (stockText.includes('in stock') || stockText.includes('add to cart')) {
        newStatus = 'In Stock'
      }

      // 5. Check if the status has changed
      if (product.current_status !== newStatus) {
        console.log(`  Status changed to: ${newStatus}. Updating database...`)

        // 6. Update the product status in the database
        await (supabaseAdmin.from('products') as any)
          .update({ current_status: newStatus })
          .eq('id', product.id)

        // --- 7. SEND THE EMAIL ---
        // If the item is back IN STOCK, and it wasn't in stock before...
        if (newStatus === 'In Stock') {
          console.log('  Item is in stock! Sending email...')

          // 7a. Securely get the user's email address
          const { data: userData, error: userError } =
            await supabaseAdmin.auth.admin.getUserById(product.user_id!)

          if (userError) {
            console.error('  Error getting user email:', userError.message)
            continue // Skip to the next product
          }

          const userEmail = userData.user.email
          if (!userEmail) {
            console.error('  User email not found.')
            continue
          }

          // 7b. Send the email with Resend
          await resend.emails.send({
            from: 'Restock <onboarding@resend.dev>', // This is Resend's default
            to: [userEmail],
            subject: 'Your product is back in stock!',
            html: `
              <h1>It's Back!</h1>
              <p>Your product, <strong>${product.name}</strong>, is back in stock.</p>
              <p>Buy it now: <a href="${product.url}">Click Here</a></p>
            `,
          })
          console.log(`  Email sent to ${userEmail}!`)
        }
      } else {
        console.log('  Status unchanged.')
      }
    } catch (err: any) {
      console.error(`  Error checking product ${product.name}:`, err.message)
    }
  }

  console.log('Cron Job Finished.')
  return NextResponse.json({ message: 'Stock check complete.' })
}