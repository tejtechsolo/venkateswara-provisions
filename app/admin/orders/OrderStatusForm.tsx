'use client'

import { useState } from 'react'

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function OrderStatusForm({ orderId, initialStatus }: { orderId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function save() {
    setSaving(true); setMessage('')
    const response = await fetch(`/api/admin/orders/${orderId}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) })
    setMessage(response.ok ? 'Saved' : ((await response.json()).error ?? 'Unable to save'))
    setSaving(false)
  }

  return <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><select value={status} onChange={e => setStatus(e.target.value)}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select><button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>{message && <small>{message}</small>}</div>
}
