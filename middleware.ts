import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: values => values.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return response
}

export const config = { matcher: ['/admin/:path*'] }
