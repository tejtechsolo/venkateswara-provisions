import { createClient } from '../../../lib/supabase/server'

export default async function AdminInventoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <main style={{ padding: 40 }}>Please sign in.</main>
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (!profile || !['owner', 'admin', 'staff'].includes(profile.role)) return <main style={{ padding: 40 }}><h1>Access denied</h1></main>
  const { data: inventory, error } = await supabase.from('inventory').select('product_id,quantity,reserved,updated_at,products(name,sku,unit)').order('updated_at', { ascending: false }).limit(200)
  return <main style={{ maxWidth: 1180, margin: '0 auto', padding: '48px 24px' }}><p style={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Admin</p><h1>Inventory</h1><p style={{ color: '#667085' }}>Monitor available and reserved wholesale stock.</p>{error ? <p role="alert">{error.message}</p> : <div style={{ overflowX: 'auto', marginTop: 24 }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr><th align="left">Product</th><th align="left">SKU</th><th align="right">On hand</th><th align="right">Reserved</th><th align="right">Available</th></tr></thead><tbody>{inventory?.map((row: any) => <tr key={row.product_id}><td style={{ padding: 12, borderTop: '1px solid #eee' }}>{row.products?.name ?? row.product_id}</td><td style={{ padding: 12, borderTop: '1px solid #eee' }}>{row.products?.sku ?? '—'}</td><td style={{ padding: 12, borderTop: '1px solid #eee', textAlign: 'right' }}>{Number(row.quantity).toLocaleString('en-IN')}</td><td style={{ padding: 12, borderTop: '1px solid #eee', textAlign: 'right' }}>{Number(row.reserved).toLocaleString('en-IN')}</td><td style={{ padding: 12, borderTop: '1px solid #eee', textAlign: 'right', fontWeight: 700 }}>{(Number(row.quantity) - Number(row.reserved)).toLocaleString('en-IN')}</td></tr>)}</tbody></table></div>}</main>
}
