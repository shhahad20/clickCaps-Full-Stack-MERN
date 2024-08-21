import { Document } from 'mongoose'
import { CategoryInterface } from './categoriesInterface'

export interface ProductInterface extends Document {
  name: string
  price: number
  slug: string
  image: string
  description: string
  sold: number
  shipping: number
  quantity: number
  category: CategoryInterface['_id']
  createdAt?: NativeDate
  updatedAt?: NativeDate
}

export type ProductInput = Omit<ProductInterface, '_id'>
