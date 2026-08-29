import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'venkateswara-provisions',
    version: process.env.npm_package_version ?? '0.1.0',
    timestamp: new Date().toISOString(),
    supabaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  })
}
