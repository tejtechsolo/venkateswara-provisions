"use client"

import { FormEvent, useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  function submit(event: FormEvent) {
    event.preventDefault()
    setMessage("Authentication is ready to connect to Supabase. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable sign-in.")
  }

  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
    <form onSubmit={submit} style={{ width: "100%", maxWidth: 420, background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: 28 }}>
      <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2 }}>Venkateswara Provisions</p>
      <h1 style={{ fontSize: 32, margin: "8px 0" }}>Sign in</h1>
      <p style={{ color: "#667085" }}>Access your wholesale account or operations console.</p>
      <label style={{ display: "block", marginTop: 24, fontWeight: 600 }}>Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ display: "block", width: "100%", marginTop: 8, padding: 12, border: "1px solid #d0d5dd", borderRadius: 10 }} /></label>
      <button type="submit" style={{ width: "100%", marginTop: 16, padding: 13, border: 0, borderRadius: 10, background: "#17202a", color: "white", fontWeight: 700 }}>Continue</button>
      {message && <p style={{ marginTop: 16, fontSize: 13, lineHeight: 1.5 }}>{message}</p>}
    </form>
  </main>
}
