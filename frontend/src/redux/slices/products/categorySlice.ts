import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import { baseURL } from '../../../api'

axios.defaults.withCredentials = true

export type Category = {
  _id: string
  title: string
  slug: string
  createdAt?: Date
  updatedAt?: Date
}

export type CatgeoryState = {
  categories: Category[]
  error: null | string
  isLoading: boolean
  search: string
  category: Category | null
  pagination: { totalCategories: number; totalPages: number; currentPage: number }
}

const initialState: CatgeoryState = {
  categories: [],
  error: null,
  isLoading: false,
  search: '',
  category: null,
  pagination: {
    totalCategories: 0,
    totalPages: 1,
    currentPage: 1
  }
}
export const fetchCategory = createAsyncThunk('categories/fetchCategory', async (page: number) => {
  try {
    const response = await axios.get(`${baseURL}/api/categories?page=${page}`)
    return response.data.payload
  } catch (error) {
    console.log(error)
  }
})
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id: string) => {
    try {
      const response = await axios.get(`${baseURL}/api/categories/${id}`)
      return response.data.payload
    } catch (error) {
      console.log(error)
    }
  }
)
export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (id: string) => {
  try {
    const response = await axios.delete(`${baseURL}/api/categories/${id}`)
    return id
  } catch (error) {
    console.log(error)
  }
})
export const addCategory = createAsyncThunk('categories/addCategory', async (title: string) => {
  try {
    const response = await axios.post(`${baseURL}/api/categories`, { title })
    return response.data
  } catch (error) {
    console.log(error)
  }
})
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, updatedData }: { id: string; updatedData: object }) => {
    try {
      const response = await axios.put(`${baseURL}/api/categories/${id}`, updatedData)
      return response.data.payload
    } catch (error) {
      console.log(error)
    }
  }
)

export const catgeorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    searchCategory: (state, action) => {
      state.search = action.payload
    },
    sortCategories: (state, action) => {
      const sortingValue = action.payload
      if (sortingValue === 'title') {
        state.categories.sort((a, b) => a.title.localeCompare(b.title))
      } else if (sortingValue === 'createdAt') {
        state.categories.sort((a, b) => {
          const getDateWithoutTime = (dateString: string | undefined) => {
            if (!dateString) return 0
            const date = new Date(dateString)
            date.setHours(0, 0, 0, 0)
            return date.getTime()
          }

          const aDateWithoutTime = getDateWithoutTime(String(a.createdAt))
          const bDateWithoutTime = getDateWithoutTime(String(b.createdAt))
          return aDateWithoutTime - bDateWithoutTime
        })
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.categories = action.payload.categories
        const paginationValue = action.payload.pagination
        state.pagination = {
          currentPage: paginationValue.currentPage,
          totalPages: paginationValue.totalPages,
          totalCategories: paginationValue.totalCategories
        }
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false
        state.category = action.payload
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((category) => category._id !== action.payload)
        state.isLoading = false
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.category) {
          const value = action.payload
          state.category.title = value.name
        }
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.categories.push(action.payload)
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
export const { searchCategory, sortCategories } = catgeorySlice.actions

export default catgeorySlice.reducer
