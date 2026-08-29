import { getCatalog } from '../../lib/commerce/catalog'

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams
  let products: Awaited<ReturnType<typeof getCatalog>> = []
  let error = ''
  try { products = await getCatalog(params.q, params.category) } catch (e) { error = e instanceof Error ? e.message : 'Unable to load catalog' }
  return <main style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px' }}>
    <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>Wholesale Catalog</p>
    <h1 style={{ fontSize: 42, margin: '10px 0 8px' }}>Order provisions in bulk</h1>
    <p style={{ color: '#667085', marginBottom: 28 }}>Live products, stock and customer pricing are supplied by Supabase.</p>
    <form style={{ display: 'flex', gap: 10, marginBottom: 28 }}><input name="q" defaultValue={params.q} placeholder="Search products…" style={{ flex: 1, padding: 12, border: '1px solid #d0d5dd', borderRadius: 10 }} /><button type="submit">Search</button></form>
    {error ? <p role="alert">{error}. Configure Supabase to load live products.</p> : products.length === 0 ? <p>No products found.</p> : <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>{products.map(product => <article key={product.id} style={{ border: '1px solid #e5e7eb', borderRadius: 14, padding: 20, background: 'white' }}><small>{product.sku}</small><h2 style={{ fontSize: 19, margin: '10px 0' }}>{product.name}</h2><p style={{ color: '#667085' }}>{product.description}</p><strong>₹{Number(product.base_price).toFixed(2)} / {product.unit}</strong><button style={{ display: 'block', width: '100%', marginTop: 16, padding: 11, borderRadius: 9, border: '1px solid #d0d5dd', background: 'white', fontWeight: 700 }}>Add to cart</button></article>)}</section>}
  </main>
}
