import mongoose, { Schema } from 'mongoose'

import { OrderInterface } from '../types/orderInterface'

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        _id: { type: String },
        quantity: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivred', 'cancelled'],
      required: true,
      default: 'pending',
      validate: {
        validator: function (v: string) {
          return ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(v)
        },
        message: (props: { value: any }) => `${props.value} is not a valid status!`,
      },
    },
  },
  { timestamps: true }
)

export default mongoose.model<OrderInterface>('Order', orderSchema)
