export type Product = {
  id: string
  sku: string
  name: string
  description: string | null
  unit: string
  base_price: number
  active: boolean
}

export type CartItem = Product & { quantity: number; unitPrice: number }

export type CreateOrderItem = { product_id: string; quantity: number }
