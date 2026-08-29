import { createClient } from '../supabase/server'
import type { CreateOrderItem } from './types'

export async function createWholesaleOrder(items: CreateOrderItem[], notes?: string) {
  if (!items.length) throw new Error('Cart is empty')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')

  const { data, error } = await supabase.rpc('create_order', {
    p_items: items,
    p_notes: notes ?? null,
  })
  if (error) throw new Error(error.message)
  return data as string
}
