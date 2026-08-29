import { createClient } from '../../../lib/supabase/server'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <main style={{ padding: 40 }}>Please sign in.</main>
  const { data: profile } = await supabase.from('profiles').select('role,tenant_id').eq('id', user.id).maybeSingle()
  if (!profile || !['owner', 'admin', 'staff'].includes(profile.role)) return <main style={{ padding: 40 }}><h1>Access denied</h1></main>
  const { data: products, error } = await supabase.from('products').select('id,sku,name,unit,base_price,active').eq('tenant_id', profile.tenant_id).order('name')
  return <main style={{ maxWidth: 1180, margin: '0 auto', padding: '48px 24px' }}><p style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Admin</p><h1>Products</h1><p style={{ color: '#667085' }}>Manage your wholesale catalog and base pricing.</p>{error ? <p role="alert">{error.message}</p> : <div style={{ overflowX: 'auto', marginTop: 24 }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr><th align="left">SKU</th><th align="left">Product</th><th align="left">Unit</th><th align="right">Base price</th><th align="left">Status</th></tr></thead><tbody>{products?.map(p => <tr key={p.id}><td style={{ padding: 12, borderTop: '1px solid #eee' }}>{p.sku}</td><td style={{ padding: 12, borderTop: '1px solid #eee' }}>{p.name}</td><td style={{ padding: 12, borderTop: '1px solid #eee' }}>{p.unit}</td><td style={{ padding: 12, borderTop: '1px solid #eee', textAlign: 'right' }}>₹{Number(p.base_price).toFixed(2)}</td><td style={{ padding: 12, borderTop: '1px solid #eee' }}>{p.active ? 'Active' : 'Inactive'}</td></tr>)}</tbody></table></div>}</main>
}
