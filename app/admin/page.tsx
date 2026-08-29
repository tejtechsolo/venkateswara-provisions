const modules = [
  ['Overview', 'Revenue, orders, low-stock alerts and operational KPIs.'],
  ['Products', 'Manage wholesale catalog, categories, units and pricing.'],
  ['Inventory', 'Track stock, movements and future warehouses.'],
  ['Customers', 'Manage retailer accounts and customer-specific pricing.'],
  ['Orders', 'Review, process and track wholesale orders.'],
  ['Integrations', 'Airtable, Notion, GitHub, Vercel and Canva adapters.'],
]

export default function AdminPage() {
  return <main style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px' }}>
    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase' }}>Admin Console</p>
    <h1 style={{ fontSize: 42, margin: '10px 0 8px' }}>Operations dashboard</h1>
    <p style={{ color: '#667085', marginBottom: 32 }}>The admin foundation is ready for Supabase-backed modules and RBAC.</p>
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
      {modules.map(([name, description]) => <div key={name} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 20 }}><h2 style={{ fontSize: 18, margin: '0 0 8px' }}>{name}</h2><p style={{ color: '#667085', lineHeight: 1.5, margin: 0 }}>{description}</p></div>)}
    </section>
  </main>
}
