import { createClient } from '../supabase/server'

export async function getCatalog(search?: string, categoryId?: string) {
  const supabase = await createClient()
  let query = supabase.from('products').select('id,sku,name,description,unit,base_price,active').eq('active', true).order('name')
  if (search?.trim()) query = query.ilike('name', `%${search.trim()}%`)
  if (categoryId) query = query.eq('category_id', categoryId)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getCustomerPrice(productId: string, quantity: number) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('customer_prices').select('price,min_qty').eq('product_id', productId).lte('min_qty', quantity).order('min_qty', { ascending: false }).limit(1).maybeSingle()
  if (error) throw new Error(error.message)
  return data?.price ?? null
}
