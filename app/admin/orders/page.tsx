import { createClient } from '../../../lib/supabase/server'

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: orders, error } = await supabase.from('orders').select('id,status,total,created_at,customer_id').order('created_at', { ascending: false }).limit(100)
  return <main style={{ maxWidth: 1180, margin: '0 auto', padding: '48px 24px' }}><p style={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Admin</p><h1>Orders</h1>{error ? <p role="alert">{error.message}</p> : <div style={{ overflowX: 'auto', marginTop: 24 }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr><th align="left">Order</th><th align="left">Customer</th><th align="left">Status</th><th align="right">Total</th><th align="left">Created</th></tr></thead><tbody>{orders?.map(o => <tr key={o.id}><td style={{ padding: 12 }}>#{o.id.slice(0, 8)}</td><td style={{ padding: 12 }}>{o.customer_id.slice(0, 8)}</td><td style={{ padding: 12 }}>{o.status}</td><td style={{ padding: 12, textAlign: 'right' }}>₹{Number(o.total).toFixed(2)}</td><td style={{ padding: 12 }}>{new Date(o.created_at).toLocaleString('en-IN')}</td></tr>)}</tbody></table></div>}</main>
}
