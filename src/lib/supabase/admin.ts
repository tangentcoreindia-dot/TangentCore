import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://ivpgnbsgsckyyuudolsr.supabase.co';
const DEFAULT_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cGduYnNnc2NreXl1dWRvbHNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjgxNDI5NSwiZXhwIjoyMTAyMzkwMjk1fQ.uwbt0SWBZ7UHi4-JOlLgTWjknEXgZHANqu2N5gLNGIo';

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_ROLE_KEY;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
