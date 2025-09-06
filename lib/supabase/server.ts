import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for use in server-side environments.
 *
 * This function initializes a Supabase client that is aware of the server-side
 * context, using the `cookies` from `next/headers` to manage user sessions.
 * This is the correct way to interact with Supabase from Server Components,
 * Server Actions, or API routes in Next.js.
 *
 * The `try...catch` block around `setAll` handles cases where this function
 * might be called in a context where cookies cannot be set (e.g., a Server Component
 * that is not part of a request that can modify headers). This is safe to ignore
 * if you have middleware refreshing user sessions.
 *
 * @returns {SupabaseClient} An instance of the Supabase client for server-side use.
 */
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}