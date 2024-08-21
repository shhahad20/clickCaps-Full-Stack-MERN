import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

axios.defaults.withCredentials = true

import { baseURL } from '../../../api'

export type Order = {
  _id: string
  user: string
  orderItems: [{ _id: string; quantity: number; product: string }]
  totalAmount: number
  status: string
  createdAt?: Date
  updatedAt?: Date
}

export type OrderState = {
  orders: Order[]
  error: null | string
  isLoading: boolean
  order: Order | null
  search: string
}

const initialState: OrderState = {
  orders: [],
  error: null,
  isLoading: false,
  order: null,
  search: ''
}

export const fetchOrders = createAsyncThunk('order/fetchOrders', async () => {
  try {
    const response = await axios.get(`${baseURL}/api/orders`)
    console.log(response.data.payload)
    return response.data.payload
  } catch (error) {
    console.log(error)
  }
})
export const fetchSingleOrder = createAsyncThunk('order/fetchSingleOrder', async (id: string) => {
  try {
    const response = await axios.get(`${baseURL}/api/orders/${id}`)
    return response.data.payload
  } catch (error) {
    console.log(error)
  }
})
export const deleteOrder = createAsyncThunk('order/deleteOrder', async (id: string) => {
  try {
    const response = await axios.delete(`${baseURL}/api/orders/${id}`)
    return id
  } catch (error) {
    console.log(error)
  }
})
export const createOrder = createAsyncThunk('order/createOrder', async (newOrderData: object) => {
  try {
    const response = await axios.post(`${baseURL}/api/orders`, newOrderData)
    return response.data
  } catch (error) {
    console.log(error)
  }
})
export const updateOrder = createAsyncThunk(
  'order/updateOrder',
  async ({ id, updatedData }: { id: string; updatedData: string }) => {
    try {
      const response = await axios.put(`${baseURL}/api/orders/${id}`, updatedData)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
)
export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    searchOrder: (state, action) => {
      state.search = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload.orders
      })
      .addCase(fetchSingleOrder.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.order = action.payload
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order._id !== action.payload)
        state.isLoading = false
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.orders.push(action.payload)
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        console.log(action.payload.payload)
        state.isLoading = false
        if (state.order) {
          const value = action.payload
          state.order = {
            ...state.order,
            status: value.status
          }
        }
      })
    /// MATCHERS
    builder.addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state) => {
        state.isLoading = true
        state.error = null
      }
    )
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'an error occured'
        console.log(state.error)
      }
    )
  }
})
export const { searchOrder } = orderSlice.actions

export default orderSlice.reducer
