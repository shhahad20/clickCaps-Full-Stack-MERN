import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import { baseURL } from '../../../api'
import { Category } from './categorySlice'
// axios.defaults.withCredentials = true

export type Product = {
  _id: string
  name: string
  price: number
  slug: string
  image: File | undefined | string
  description: string
  sold: number
  shipping: number
  quantity: number
  category: Category
  // variants: string[]
  // sizes: string[]
  createdAt?: Date
  updatedAt?: Date
}

export type ProductState = {
  products: Product[]
  error: null | string
  isLoading: boolean
  search: string
  pagination: { totalProducts: number; totalPages: number; currentPage: number }
  singleProduct: Product | null
  addedProduct: Product | null
}

const initialState: ProductState = {
  products: [],
  error: null,
  isLoading: false,
  search: '',
  singleProduct: null,
  pagination: {
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1
  },
  addedProduct: null
}

export const fetchData = createAsyncThunk(
  'product/fetchData',
  async (data: { page: number; limit: number }) => {
    try {
      const response = await axios.get(`${baseURL}/api/products?page=${data.page}&${data.limit}`)
      return response.data.payload
    } catch (error) {
      console.log(error)
    }
  }
)
export const updatedProduct = createAsyncThunk(
  'product/updatedProduct',
  async ({ id, updatedData }: { id: string; updatedData: FormData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseURL}/api/products/${id}`, updatedData)
      return response.data.payload
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.msg)
      }
    }
  }
)

export const fetchSingleProduct = createAsyncThunk(
  'product/fetchSingleProduct',
  async (id: string) => {
    try {
      const response = await axios.get(`${baseURL}/api/products/${id}`)
      return response.data.payload
    } catch (error) {
      console.log(error)
      throw error
    }
  }
)
export const deleteProduct = createAsyncThunk('product/deleteProduct', async (id: string) => {
  try {
    const response = await axios.delete(`${baseURL}/api/products/${id}`)
    return id
  } catch (error) {
    console.log(error)
  }
})
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (newProductData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseURL}/api/products`, newProductData)
      console.log('Hi slice :' + response)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.msg)
      }
    }
  }
)
export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addProductToCart: (state, action) => {
      const id = action.payload
      const addedProduct = state.products.find((product) => product._id === id)
      if (addedProduct) {
        state.addedProduct = addedProduct
      } else {
        state.addedProduct = null
      }
    },
    searchProduct: (state, action) => {
      state.search = action.payload
    },
    sortProduct: (state, action) => {
      const sortingValue = action.payload
      if (sortingValue === 'name') {
        state.products.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sortingValue === 'price') {
        state.products.sort((a, b) => a.price - b.price)
      } else if (sortingValue === 'h-price') {
        state.products.sort((a, b) => b.price - a.price)
      }
    },
    sortByCategory: (state, action) => {
      const categoryValue = action.payload
    },
    productsRequest: (state) => {
      state.isLoading = true
    },
    productsSuccess: (state, action) => {
      state.isLoading = false
      state.products = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload.products
        state.pagination = {
          currentPage: action.payload.pagination.currentPage,
          totalPages: action.payload.pagination.totalPages,
          totalProducts: action.payload.pagination.totalProducts
        }
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.singleProduct = action.payload
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product._id !== action.payload)
        state.isLoading = false
      })
      .addCase(updatedProduct.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.singleProduct) {
          const value = action.payload
          state.singleProduct = {
            ...state.singleProduct,
            name: value.name,
            price: value.price,
            description: value.description,
            image: value.image
          }
        }
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.products.push(action.payload)
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
export const {
  productsRequest,
  productsSuccess,
  searchProduct,
  sortProduct,
  addProductToCart,
  sortByCategory
} = productSlice.actions

export default productSlice.reducer
