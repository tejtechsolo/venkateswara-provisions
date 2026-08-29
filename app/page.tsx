import { ArrowRight, Boxes, Package, ShieldCheck, Users } from 'lucide-react'

const modules = [
  ['Catalog', 'Wholesale products, categories and customer pricing.', Package],
  ['Inventory', 'Stock visibility and warehouse-ready inventory.', Boxes],
  ['Customers', 'Accounts, roles and customer-specific price lists.', Users],
  ['Security', 'Supabase Auth, RBAC and row-level access control.', ShieldCheck],
] as const

export default function Home() {
  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 32, alignItems: 'center', marginBottom: 56 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>Venkateswara Provisions</div>
          <h1 style={{ fontSize: 'clamp(42px, 7vw, 72px)', lineHeight: 1.02, margin: '16px 0' }}>Wholesale commerce, built for operations.</h1>
          <p style={{ fontSize: 19, lineHeight: 1.6, maxWidth: 680, color: '#5b6573' }}>A production-ready foundation for catalog, inventory, customers, orders and connected business tools.</p>
          <a href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 18, padding: '13px 18px', borderRadius: 10, background: '#17202a', color: 'white', fontWeight: 700 }}>Open Admin <ArrowRight size={17} /></a>
        </div>
      </div>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
        {modules.map(([title, description, Icon]) => <article key={title} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, padding: 22 }}><Icon size={24} /><h2 style={{ fontSize: 20, margin: '16px 0 8px' }}>{title}</h2><p style={{ color: '#667085', lineHeight: 1.5, margin: 0 }}>{description}</p></article>)}
      </section>
    </main>
  )
}
