import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import { baseURL } from '../../../api'
axios.defaults.withCredentials = true

const data =
  localStorage.getItem('loginData') !== null
    ? JSON.parse(String(localStorage.getItem('loginData')))
    : []

export type User = {
  _id: string
  first_name: string
  last_name: string
  email: string
  password: string
  // age: number
  // gender: string
  image: string
  address: string
  phone: string
  // role: string
  isAdmin: boolean
  isBanned: boolean
  order: []
  createdAt?: Date
  updatedAt?: Date
}

export type UserState = {
  users: User[]
  error: null | string
  isLoading: boolean
  isLoggedIn: boolean
  search: string
  userData: User | null
  newUser: User[]
  pagination: { totalUsers: number; totalPages: number; currentPage: number }
}

const initialState: UserState = {
  users: [],
  error: null,
  isLoading: false,
  isLoggedIn: false,
  userData: null,
  newUser: data,
  search: '',
  pagination: {
    totalUsers: 0,
    totalPages: 1,
    currentPage: 1
  }
}

export const fetchUser = createAsyncThunk('user/fetchUser', async (page: number) => {
  try {
    const response = await axios.get(`${baseURL}/api/users?page=${page}`)
    return response.data.payload
  } catch (error) {
    console.log(error)
  }
})
export const fetchUserById = createAsyncThunk('user/fetchUserById', async (id: string) => {
  try {
    const response = await axios.get(`${baseURL}/api/users/${id}`)
    return response.data.payload
  } catch (error) {
    console.log(error)
  }
})
export const registerUser = createAsyncThunk('user/registerUser', async (newUserData: FormData) => {
  try {
    const response = await axios.post(`${baseURL}/api/users/registering`, newUserData)
    return response.data
  } catch (error) {
    console.log(error)
  }
})
export const activateUser = async (token: string) => {
  try {
    const response = await axios.post(`${baseURL}/api/users/activate`, { token })
    return response.data
  } catch (error) {
    console.log(error)
  }
}
export const deleteUser = createAsyncThunk('user/deleteUser', async (id: string) => {
  try {
    const response = await axios.delete(`${baseURL}/api/users/${id}`)
    return response.data.payload
  } catch (error) {
    console.log(error)
  }
})
export const banUser = createAsyncThunk('user/banUser', async (id: string) => {
  try {
    const response = await axios.put(`${baseURL}/api/users/ban/${id}`)
    console.log('Banned a user ' + response.data.payload)
    return response.data.payload
  } catch (error) {
    console.log(error)
  }
})
export const unbanUser = createAsyncThunk('user/unbanUser', async (id: string) => {
  try {
    const response = await axios.put(`${baseURL}/api/users/unban/${id}`)
    console.log('Unbanned a user ' + response.data.payload)
    return response.data.payload
  } catch (error) {
    console.log(error)
  }
})
export const adminUser = createAsyncThunk('user/adminUser', async (id: string) => {
  try {
    const response = await axios.put(`${baseURL}/api/users/adminrole/${id}`)
    console.log('Role of user id Admin ' + response.data.payload)
    return response.data.payload
  } catch (error) {
    console.log(error)
  }
})
export const unadminUser = createAsyncThunk('user/unadminUser', async (id: string) => {
  try {
    const response = await axios.put(`${baseURL}/api/users/unadminrole/${id}`)
    console.log('Unadmin a user ' + response.data.payload)
    return response.data.payload
  } catch (error) {
    console.log(error)
  }
})
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, updatedData }: { id: string; updatedData: FormData }) => {
    try {
      const response = await axios.put(`${baseURL}/api/users/${id}`, updatedData)
      console.log('Update a user ' + response.data.payload)
      return response.data.payload
    } catch (error) {
      console.log(error)
    }
  }
)

export const loginUser = createAsyncThunk('user/loginUser', async (loginData: object) => {
  try {
    const response = await axios.post(`${baseURL}/api/auth/login`, loginData)
    return response.data
  } catch (error) {
    console.log(error)
  }
})
export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  try {
    const response = await axios.post(`${baseURL}/api/auth/logout`)
    return response.data
  } catch (error) {
    console.log(error)
  }
})
export const forgetPassword = async (email: string) => {
  try {
    const response = await axios.post(`${baseURL}/api/users/forget-password`, { email })
    return response.data
  } catch (error) {
    console.log(error)
  }
}
export const resetPassword = async (token: string, password: string, confirmPassword: string) => {
  try {
    const response = await axios.post(`${baseURL}/api/users/reset-password`, {
      token,
      password,
      confirmPassword
    })
    console.log(response.data.status)
    return response.data.status
  } catch (error) {
    console.log(error)
  }
}
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    searchUser: (state, action) => {
      state.search = action.payload
    },
    sortUsers: (state, action) => {
      const sortingValue = action.payload
      if (sortingValue === 'name') {
        state.users.sort((a, b) => a.first_name.localeCompare(b.first_name))
      } else if (sortingValue === 'createdAt') {
        state.users.sort((a, b) => {
          const getDateWithoutTime = (dateString: string | undefined) => {
            if (!dateString) return 0 // Handle undefined or empty dateString
            const date = new Date(dateString)
            date.setHours(0, 0, 0, 0) // Set time to midnight
            return date.getTime()
          }

          const aDateWithoutTime = getDateWithoutTime(String(a.createdAt))
          const bDateWithoutTime = getDateWithoutTime(String(b.createdAt))

          return aDateWithoutTime - bDateWithoutTime
        })
      }
    },
    addUser: (state, action) => {
      state.users.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload.users
        state.pagination = {
          currentPage: action.payload.pagination.currentPage,
          totalPages: action.payload.pagination.totalPages,
          totalUsers: action.payload.pagination.totalUsers
        }
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload
      })
      .addCase(banUser.fulfilled, (state, action) => {
        const foundUser = state.users.find((user) => user._id === action.payload)
        if (foundUser) {
          foundUser.isBanned = true
        }
      })
      .addCase(unbanUser.fulfilled, (state, action) => {
        const foundUser = state.users.find((user) => user._id === action.payload)
        if (foundUser) {
          foundUser.isBanned = false
        }
      })
      .addCase(adminUser.fulfilled, (state, action) => {
        const foundUser = state.users.find((user) => user._id === action.payload)
        if (foundUser) {
          foundUser.isAdmin = true
        }
      })
      .addCase(unadminUser.fulfilled, (state, action) => {
        const foundUser = state.users.find((user) => user._id === action.payload)
        if (foundUser) {
          foundUser.isAdmin = false
        }
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (state.userData) {
          const value = action.payload
          state.userData.first_name = value.first_name
          state.userData.last_name = value.last_name
          state.userData.email = value.email
          state.userData.phone = value.phone
          state.userData.address = value.address
          state.userData.image = value.image
          localStorage.setItem(
            'loginData',
            JSON.stringify({
              isLoggedIn: state.isLoggedIn,
              userData: state.userData
            })
          )
        }
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggedIn = true
        state.userData = action.payload.payload
        localStorage.setItem(
          'loginData',
          JSON.stringify({
            isLoggedIn: state.isLoggedIn,
            userData: state.userData
          })
        )
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoggedIn = false
        state.userData = null
        localStorage.setItem(
          'logoutData',
          JSON.stringify({
            isLoggedIn: state.isLoggedIn,
            userData: state.userData
          })
        )
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload)
        state.isLoading = false
      })

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
export const { sortUsers, addUser, searchUser } = userSlice.actions

export default userSlice.reducer
