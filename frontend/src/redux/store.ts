import { configureStore } from '@reduxjs/toolkit'

import productSlice from './slices/products/productSlice'
import cartSlice from './slices/products/cartSlice'
import userSlice from './slices/products/userSlice'
import orderSlice from './slices/products/orderSlice'
import catgeorySlice from './slices/products/categorySlice'

export const store = configureStore({
  reducer: {
    productsReducer: productSlice,
    cartReducer: cartSlice,
    usersReducer: userSlice,
    ordersReducer: orderSlice,
    categoryReducer: catgeorySlice
  }
})

export type RootState = {
  productsReducer: ReturnType<typeof productSlice>
  cartReducer: ReturnType<typeof cartSlice>
  usersReducer: ReturnType<typeof userSlice>
  ordersReducer: ReturnType<typeof orderSlice>
  categoryReducer: ReturnType<typeof catgeorySlice>
}
export type AppDispatch = typeof store.dispatch
