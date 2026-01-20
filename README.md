# Social Share

A social sharing platform built with Next.js, TypeScript, and Supabase.

## Features

- User authentication (signup/login)
- Create and browse threads
- Share text, images, and videos
- **Custom-built Audio Player** for a premium listening experience
- Private threads with member management
- Real-time updates

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the provided `supabase_setup.sql` in the Supabase SQL editor to set up tables, storage, and RLS policies
   - Ensure the storage bucket named "posts" is public (the SQL handles this)
   - Copy your Supabase URL and anon key

4. Create environment variables:
   - Create `.env.local` file
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
     ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

This project is configured for Vercel deployment. Simply connect your GitHub repository to Vercel and add your environment variables.

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
