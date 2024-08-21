import { Schema, model } from 'mongoose'

import { ProductInterface } from '../types/productTypes'

 const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    image: {
      type: String,
      default: 'public/images/productsImages/default.webp',
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
      require: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export const Product = model<ProductInterface>('Product', productSchema)

export default Product
