type CategoryType = {
  id: string
  title: string
  slug: string
}

export type ProductType = {
  id: string
  name: string
  price: number
  slug: string
  description: string
  image: string
  sold: number
  shipping: number
  quantity: number
  category: CategoryType
}

export type OrderItem = {
  _id: string
  quantity: number
  product: ProductType
}

export type OrderType = {
  _id: string
  user: string
  orderItems: OrderItem[]
  totalAmount: number
  status: string
}

const initCategory: CategoryType = {
  id: '',
  title: '',
  slug: '',
}

const initProduct: ProductType = {
  id: '',
  name: '',
  price: 0,
  slug: '',
  description: '',
  image: '',
  sold: 0,
  shipping: 0,
  quantity: 0,
  category: initCategory,
}

const initOrderItem: OrderItem = {
  _id: '',
  quantity: 0,
  product: initProduct,
}

export const initOrder: OrderType = {
  _id: '',
  user: '',
  orderItems: [initOrderItem],
  totalAmount: 0,
  status: '',
}
