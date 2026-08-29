import { NextResponse } from 'next/server'
import { createWholesaleOrder } from '../../../lib/commerce/order'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items = Array.isArray(body.items) ? body.items : []
    const orderId = await createWholesaleOrder(items, typeof body.notes === 'string' ? body.notes : undefined)
    return NextResponse.json({ orderId }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create order'
    const status = message === 'Authentication required' ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
