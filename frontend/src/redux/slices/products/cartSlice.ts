import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { Product } from './productSlice'

const data =
  localStorage.getItem('cart') !== null ? JSON.parse(String(localStorage.getItem('cart'))) : []

export type CartState = {
  cart: Product[]
  cartItems: Product[]
}

const initialState: CartState = {
  cart: [],
  cartItems: data
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const item = action.payload
      state.cartItems.push(action.payload)
      localStorage.setItem('cart', JSON.stringify(state.cartItems))
    },
    removeItemFromCart: (state, action: { payload: { productId: string } }) => {
      state.cartItems = state.cartItems.filter(
        (product) => product._id !== action.payload.productId
      )
      localStorage.setItem('cart', JSON.stringify(state.cartItems))
    },
    clearCart: (state) => {
      state.cartItems = []
      localStorage.removeItem('cart')
    }
  }
})
export const { clearCart, addToCart, removeItemFromCart } = cartSlice.actions

export default cartSlice.reducer
