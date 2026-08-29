import { NextResponse } from 'next/server'
import { createClient } from '../../../../../lib/supabase/server'

const allowed = new Set(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role,tenant_id').eq('id', user.id).maybeSingle()
  if (!profile || !['owner', 'admin', 'staff'].includes(profile.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await request.json(); const status = String(body.status ?? '')
  if (!allowed.has(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  const { id } = await params
  const { data, error } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id).eq('tenant_id', profile.tenant_id).select('id,status').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
