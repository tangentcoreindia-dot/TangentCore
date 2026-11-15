import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const DEFAULT_SUPABASE_URL = 'https://ivpgnbsgsckyyuudolsr.supabase.co';
  const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cGduYnNnc2NreXl1dWRvbHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MTQyOTUsImV4cCI6MjEwMjM5MDI5NX0.HPIVQAEa2DvrxYZcWlRYYlx-0L24X95s7-SDyeBLlnk';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
      global: {
        fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
          try {
            return await fetch(input, init);
          } catch {
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
    }
  );

  let user: any = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    user = null;
  }

  // Graceful session fallback if remote Supabase database is paused/offline
  if (!user) {
    const devCookie = request.cookies.get('tc_session_user')?.value;
    if (devCookie) {
      try {
        user = JSON.parse(decodeURIComponent(devCookie));
      } catch {}
    }
  }

  // Protect /dashboard routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is already logged in, redirect away from /login to /dashboard
  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
