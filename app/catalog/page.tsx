const products = [
  { name: "Premium Rice 25kg", category: "Rice", unit: "Bag", price: "₹1,450", stock: "In stock" },
  { name: "Toor Dal 10kg", category: "Pulses", unit: "Bag", price: "₹1,180", stock: "In stock" },
  { name: "Sunflower Oil 15L", category: "Oils", unit: "Tin", price: "₹2,050", stock: "Low stock" },
  { name: "Sugar 50kg", category: "Staples", unit: "Bag", price: "₹2,250", stock: "In stock" },
]

export default function CatalogPage() {
  return <main style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 24px" }}>
    <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>Wholesale Catalog</p>
    <h1 style={{ fontSize: 42, margin: "10px 0 8px" }}>Order provisions in bulk</h1>
    <p style={{ color: "#667085", marginBottom: 32 }}>Customer-specific pricing and live inventory will be supplied by Supabase.</p>
    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
      {products.map(product => <article key={product.name} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, background: "white" }}>
        <span style={{ fontSize: 12, color: "#667085" }}>{product.category} · {product.unit}</span>
        <h2 style={{ fontSize: 19, margin: "10px 0" }}>{product.name}</h2>
        <strong style={{ fontSize: 22 }}>{product.price}</strong>
        <p style={{ color: product.stock === "Low stock" ? "#b54708" : "#027a48", marginBottom: 16 }}>{product.stock}</p>
        <button style={{ width: "100%", padding: 11, borderRadius: 9, border: "1px solid #d0d5dd", background: "white", fontWeight: 700 }}>Add to cart</button>
      </article>)}
    </section>
  </main>
}
