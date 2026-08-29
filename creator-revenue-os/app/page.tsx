const content = [
  ['How AI can save small businesses 10 hours a week', 'YouTube + Blog', 'Research'],
  ['7 free tools every creator should use', 'YouTube + Newsletter', 'Ready'],
  ['Build a digital product in a weekend', 'Blog + Product', 'Draft'],
  ['From 1 video to 10 pieces of content', 'YouTube + Social', 'Scheduled'],
];

const integrations = ['Gmail', 'Airtable', 'Notion', 'Canva', 'GitHub', 'Analytics', 'Search Console', 'Stripe', 'Vercel'];

export default function Home() {
  return <div className="shell">
    <aside className="side"><div className="brand">Creator Revenue OS</div><div className="nav">
      <div className="active">Overview</div><div>Content Studio</div><div>Content Pipeline</div><div>Audience</div><div>Monetization</div><div>Products</div><div>Sponsors & Leads</div><div>Analytics</div><div>Integrations</div><div>Settings</div>
    </div></aside>
    <main className="main">
      <header className="top"><div><div className="eyebrow">Revenue workspace</div><h1 className="title">Good afternoon 👋</h1><div className="sub">Turn one idea into content, audience and revenue.</div></div><button className="btn">+ New content</button></header>
      <section className="grid">
        <div className="card"><div className="muted">Monthly revenue</div><div className="metric">₹0</div><div className="muted">Connect Stripe to track sales</div></div>
        <div className="card"><div className="muted">Content published</div><div className="metric">0</div><div className="muted">Start with your first campaign</div></div>
        <div className="card"><div className="muted">Audience</div><div className="metric">0</div><div className="muted">Analytics connection pending</div></div>
        <div className="card"><div className="muted">Revenue opportunities</div><div className="metric">12</div><div className="muted">Ideas ready to validate</div></div>
      </section>
      <section className="section">
        <div className="card"><h2>Content pipeline</h2><div className="muted">Your next publishing opportunities</div><div className="list">{content.map(([name, channels, status]) => <div className="row" key={name}><div><strong>{name}</strong><div className="muted">{channels}</div></div><span className="pill">{status}</span></div>)}</div></div>
        <div className="card"><h2>Connected stack</h2><div className="muted">Operational integrations</div><div className="list">{integrations.map((x,i)=><div className="row" key={x}><span>{x}</span><span className="score">{i < 2 ? 'Ready' : 'Connect'}</span></div>)}</div></div>
      </section>
    </main>
  </div>;
}
