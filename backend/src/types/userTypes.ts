import { Document } from 'mongoose'

import { OrderInterface } from './orderInterface'

export interface UserInterface extends Document {
  _id: string
  first_name: string
  last_name: string
  email: string
  password: string
  age: number
  gender: string
  image: string
  address: string
  phone: string
  role: string
  isAdmin: boolean
  isBanned: boolean
  order: OrderInterface['_id'][]
  createdAt?: NativeDate
  updatedAt?: NativeDate
}
