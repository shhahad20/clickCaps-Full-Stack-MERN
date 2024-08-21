import { Document } from 'mongoose'

import { ProductInterface } from '../types/productTypes'
import { UserInterface } from './userTypes'

export interface OrderItem {
  _id: string
  quantity: number
  product: ProductInterface['_id']
}

export interface OrderInterface extends Document {
  id: string
  user: UserInterface['_id']
  orderItems: OrderItem[]
  status: string
  createdAt?: NativeDate
  updatedAt?: NativeDate
}
