import { getCatalog } from '../../lib/commerce/catalog'
import CatalogClient from './CatalogClient'

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams
  let products: Awaited<ReturnType<typeof getCatalog>> = []
  let error = ''
  try { products = await getCatalog(params.q, params.category) } catch (e) { error = e instanceof Error ? e.message : 'Unable to load catalog' }
  return <main style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px' }}>
    <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>Wholesale Catalog</p>
    <h1 style={{ fontSize: 42, margin: '10px 0 8px' }}>Order provisions in bulk</h1>
    <p style={{ color: '#667085', marginBottom: 28 }}>Live products, stock and customer pricing are supplied by Supabase.</p>
    {error ? <p role="alert">{error}. Configure Supabase to load live products.</p> : products.length === 0 ? <p>No products found.</p> : <CatalogClient products={products} />}
  </main>
}
