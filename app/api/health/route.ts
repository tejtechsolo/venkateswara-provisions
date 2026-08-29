import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'venkateswara-provisions',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    database: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'not_configured',
  })
}
