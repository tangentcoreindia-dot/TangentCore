import { createBrowserClient } from '@supabase/ssr';

const DEFAULT_SUPABASE_URL = 'https://ivpgnbsgsckyyuudolsr.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cGduYnNnc2NreXl1dWRvbHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MTQyOTUsImV4cCI6MjEwMjM5MDI5NX0.HPIVQAEa2DvrxYZcWlRYYlx-0L24X95s7-SDyeBLlnk';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
