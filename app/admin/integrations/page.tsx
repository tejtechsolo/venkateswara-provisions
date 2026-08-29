import { getIntegrationStatus, getMissingConfiguration } from "@/lib/integrations/config"
import type { IntegrationName } from "@/lib/integrations/types"

const integrations: { name: IntegrationName; title: string; description: string }[] = [
  { name: "airtable", title: "Airtable", description: "Operational sync for products, customers, orders and inventory." },
  { name: "notion", title: "Notion", description: "Operations SOPs, documentation and runbooks." },
  { name: "github", title: "GitHub", description: "Source control, release and development metadata." },
  { name: "vercel", title: "Vercel", description: "Deployment and application health metadata." },
  { name: "canva", title: "Canva", description: "Marketing, catalog and promotional asset references." },
]

export default function IntegrationsPage() {
  return <main style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 24px" }}>
    <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>Admin</p>
    <h1 style={{ fontSize: 42, margin: "10px 0 8px" }}>Integration Hub</h1>
    <p style={{ color: "#667085", marginBottom: 32 }}>Supabase remains the source of truth. Providers are isolated and never receive browser-side secrets.</p>
    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
      {integrations.map(item => {
        const status = getIntegrationStatus(item.name)
        const missing = getMissingConfiguration(item.name)
        return <article key={item.name} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 14, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><h2 style={{ margin: 0, fontSize: 20 }}>{item.title}</h2><span style={{ fontSize: 12, fontWeight: 700 }}>{status.replace("_", " ")}</span></div>
          <p style={{ color: "#667085", lineHeight: 1.5 }}>{item.description}</p>
          {missing.length > 0 && <p style={{ fontSize: 12, color: "#667085" }}>Configuration required: {missing.join(", ")}</p>}
        </article>
      })}
    </section>
  </main>
}
