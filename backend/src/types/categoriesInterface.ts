import { Document } from 'mongoose'

export interface CategoryInterface extends Document {
  _id: string
  title: string
  slug: string
  createdAt?: NativeDate
  updatedAt?: NativeDate
}

export type CategoryInput = Omit<CategoryInterface, '_id'>
