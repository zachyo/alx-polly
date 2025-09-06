import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in browser environments.
 *
 * This function initializes a Supabase client using the public URL and
 * anonymous key provided as environment variables. This client is intended
 * for use in client-side components where server-side authentication
 * handling (like cookies) is not available directly.
 *
 * @returns {SupabaseClient} An instance of the Supabase client.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
