import { createClient } from '../../../lib/supabase/server'

export default async function AdminCustomersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <main style={{ padding: 40 }}>Please sign in.</main>
  const { data: profile } = await supabase.from('profiles').select('role,tenant_id').eq('id', user.id).maybeSingle()
  if (!profile || !['owner', 'admin', 'staff'].includes(profile.role)) return <main style={{ padding: 40 }}><h1>Access denied</h1></main>
  const { data: customers, error } = await supabase.from('profiles').select('id,full_name,phone,role,created_at').eq('tenant_id', profile.tenant_id).eq('role','customer').order('created_at', { ascending: false })
  return <main style={{ maxWidth: 1180, margin: '0 auto', padding: '48px 24px' }}><p style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Admin</p><h1>Customers</h1><p style={{ color: '#667085' }}>Wholesale customer accounts in your tenant.</p>{error ? <p role="alert">{error.message}</p> : <div style={{ marginTop: 24, overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr><th align="left">Customer</th><th align="left">Phone</th><th align="left">Joined</th></tr></thead><tbody>{customers?.map(c => <tr key={c.id}><td style={{ padding: 12, borderTop: '1px solid #eee' }}>{c.full_name || c.id.slice(0,8)}</td><td style={{ padding: 12, borderTop: '1px solid #eee' }}>{c.phone || '—'}</td><td style={{ padding: 12, borderTop: '1px solid #eee' }}>{new Date(c.created_at).toLocaleDateString('en-IN')}</td></tr>)}</tbody></table></div>}</main>
}
