# Restock 🛍️

[![Deployed with Vercel](https://vercel.com/button)](https://restock-app.vercel.app)

A full-stack product availability tracker built with Next.js, Supabase, and Vercel. Restock allows users to monitor their favorite products from e-commerce sites and receive email notifications as soon as the items come back in stock.

**Live Demo: [https://restock-app.vercel.app](https://restock-app.vercel.app)**

<br />

<details>
  <summary><b>Click to view Application Screenshots</b></summary>
  
  <p align="center">
    <em>Drag and drop your screenshots here.</em>
  </p>
  
  | Landing Page | Dashboard |
  | <img width="1901" height="877" alt="image" src="https://github.com/user-attachments/assets/57119488-c4d3-466e-a2b0-90a4171ab263" />
 | <img width="1901" height="876" alt="image" src="https://github.com/user-attachments/assets/c9cf5188-70f1-4a26-8e10-b2a9c087a3f7" />
 |
  | <img src="" alt="Landing Page" width="400"> | <img src="" alt="Dashboard" width="400"> |
  
  | Edit Profile | Login Page |
  | <img width="1919" height="874" alt="image" src="https://github.com/user-attachments/assets/58403fb6-6a4a-4d2e-a49f-ab0fa205dd21" />
 | <img width="1917" height="871" alt="image" src="https://github.com/user-attachments/assets/b98f05f7-6684-4629-b445-a76df434ce84" />
 |
  | <img src="" alt="Edit Profile" width="400"> | <img src="" alt="Login" width="400"> |

</details>

<br />

## ✨ Key Features

A checklist of all functionalities implemented in the application.

### 🔐 Authentication & User Management
* **Email & Password:** Full user sign-up, sign-in, and sign-out flow.
* **Google OAuth:** One-click sign-in and sign-up with a Google account.
* **Email Verification:** New user sign-ups require email confirmation (a feature we enabled in Supabase).
* **Profile Management:** Users can update their first name, last name, and upload a custom profile picture.
* **Secure Storage:** Profile avatars are uploaded to Supabase Storage with RLS policies.
* **Protected Routes:** All app-facing pages (`/dashboard`, `/profile`, etc.) are protected by a server-side check in the root layout.

### 🛍️ Product & Dashboard
* **Full CRUD:** Complete **C**reate, **R**ead, **U**pdate, and **D**elete functionality for tracked products.
* **Dynamic Dashboard:** A clean UI displaying stat cards and a card-based grid of all tracked products.
* **Interactive UI:** Client-side components for user interactions, such as a confirmation modal for deleting a product.

### ⚙️ Automation & Scraping
* **Web Scraper:** A backend API route (`/api/check-stock`) built with Axios and Cheerio to parse the HTML of live product pages.
* **Email Notifications:** Automatically sends an email via **Resend** when the scraper finds a product's status has changed to "In Stock".
* **Daily Automation:** A **Vercel Cron Job** is configured to trigger the scraper API once every 24 hours.

## 🚀 How It Works: The Automation Flow

1.  **Track:** A user logs in and adds a product URL to their dashboard. This saves the product to the Supabase `products` table, linked to their `user_id`.
2.  **Scrape:** The Vercel Cron Job triggers the `/api/check-stock` route once daily. This serverless function fetches *all* products from the database.
3.  **Check:** For each product, the scraper uses Axios to download the page HTML and Cheerio to parse it, finding the stock status text (e.g., "Currently unavailable").
4.  **Update:** The scraper updates the `current_status` in the Supabase database.
5.  **Notify:** If a product's status changes to "In Stock", the scraper securely fetches the user's email (using a `SUPABASE_SERVICE_ROLE_KEY`) and uses **Resend** to send them a "Back in Stock" notification.

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [**Next.js 14**](https://nextjs.org/) (App Router) |
| **Language** | [**TypeScript**](https://www.typescriptlang.org/) |
| **Backend** | [**Next.js API Routes**](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) & [**Server Actions**](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) |
| **Database** | [**Supabase**](https://supabase.com/) (PostgreSQL) |
| **Auth** | [**Supabase Auth**](https://supabase.com/auth) (with RLS) |
| **File Storage** | [**Supabase Storage**](https://supabase.com/storage) |
| **Deployment** | [**Vercel**](https://vercel.com/) |
| **Styling** | [**Tailwind CSS**](https://tailwindcss.com/) |
| **Icons** | [**Heroicons**](https://heroicons.com/) |
| **Scraping** | [**Axios**](https://axios-http.com/) & [**Cheerio**](https://cheerio.js.org/) |
| **Email** | [**Resend**](https://resend.com/) |

## 📦 Local Development Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/mohd-ijlan/restock-app.git](https://github.com/mohd-ijlan/restock-app.git)
cd restock-app
```

### 2. Install Dependencies
```bash
npm install
```
### 3. Set Up Environment Variables
Create a file named .env.local in the root of the project and add the following keys.
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

# Resend (for emails)
RESEND_API_KEY=YOUR_RESEND_API_KEY
```
4. Run the Development Server
```bash

npm run dev
```
Open http://localhost:3000 in your browser.


