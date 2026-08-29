'use client'

import { useMemo, useState } from 'react'
import type { Product, CartItem } from '../../lib/commerce/types'

export default function CatalogClient({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => products.filter(p => `${p.name} ${p.sku}`.toLowerCase().includes(query.toLowerCase())), [products, query])
  const add = (product: Product) => setCart(current => {
    const found = current.find(i => i.id === product.id)
    return found ? current.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) : [...current, { ...product, quantity: 1, unitPrice: Number(product.base_price) }]
  })
  const total = cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  return <div>
    <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products…" aria-label="Search products" style={{ width: '100%', padding: 12, border: '1px solid #d0d5dd', borderRadius: 10, marginBottom: 20 }} />
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 16 }}>{filtered.map(p => <article key={p.id} style={{ border: '1px solid #e5e7eb', borderRadius: 14, padding: 18 }}><small>{p.sku}</small><h2>{p.name}</h2><p>{p.description}</p><strong>₹{Number(p.base_price).toFixed(2)} / {p.unit}</strong><button onClick={() => add(p)} style={{ display: 'block', width: '100%', marginTop: 14, padding: 11 }}>Add to cart</button></article>)}</section>
    <aside style={{ position: 'sticky', bottom: 0, marginTop: 28, padding: 18, background: 'white', border: '1px solid #d0d5dd', borderRadius: 14 }}><strong>Cart: {cart.reduce((n, i) => n + i.quantity, 0)} items · ₹{total.toFixed(2)}</strong>{cart.length > 0 && <button onClick={async () => { const res = await fetch('/api/orders', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items: cart.map(i => ({ product_id: i.id, quantity: i.quantity })) }) }); if (res.ok) { const data = await res.json(); window.location.href = `/orders/${data.orderId}` } else alert((await res.json()).error ?? 'Order failed') }} style={{ marginLeft: 16, padding: '10px 16px' }}>Place order</button>}</aside>
  </div>
}
