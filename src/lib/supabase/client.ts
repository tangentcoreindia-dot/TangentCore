import { createBrowserClient } from '@supabase/ssr';

const DEFAULT_SUPABASE_URL = 'https://ivpgnbsgsckyyuudolsr.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cGduYnNnc2NreXl1dWRvbHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MTQyOTUsImV4cCI6MjEwMjM5MDI5NX0.HPIVQAEa2DvrxYZcWlRYYlx-0L24X95s7-SDyeBLlnk';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        try {
          return await fetch(input, init);
        } catch (err) {
          // If Supabase host is unreachable / paused / offline (e.g. ENOTFOUND or Failed to fetch),
          // return 401 unauthenticated session so GoTrue does NOT throw AuthRetryableFetchError
          // and does NOT trigger retry loops or console errors.
          return new Response(
            JSON.stringify({
              message: 'Auth session missing!',
              error: 'missing_authorization_header',
            }),
            {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      },
    },
  });
}
