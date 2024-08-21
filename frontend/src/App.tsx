import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Navbar from './pages/Navbar'
import Product from './pages/Product'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Login from './pages/Login'
import ProtectedRoute from './routes/ProtectedRoute'
import User from './pages/User'
import AdminRoute from './routes/AdminRoute'
import Admin from './pages/Admin'
import Category from './pages/Category'
import Footer from './pages/Footer'
import SignUp from './pages/SignUp'
import Error from './pages/Error'

// import './App.css'
import UsersList from './pages/UsersList'
import Activate from './pages/Activation'
import ResetPassword from './pages/ResetPassword'
import ForgetPassword from './pages/ForgetPassword'
import SignUpMessage from './pages/SingupMessage'
import Profile from './pages/Profile'
import Success from './pages/Success'
import { Cancel } from '@mui/icons-material'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/cart" element={<Cart pathName="" />} />
        <Route path="/login" element={<Login pathName="" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-message" element={<SignUpMessage />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/api/users/reset-password/:token" element={<ResetPassword pathName="" />} />

        <Route path="/api/users/activate/:token" element={<Activate />} />
        <Route path="/profile" element={<Profile />} />

        {/* USER ROUTE */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route path="user" element={<User />} />
        </Route>
        {/* ADMIN ROUTE */}
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<Admin />} />
          <Route path="admin/category" element={<Category />} />
          <Route path="admin/users" element={<UsersList />} />
          <Route path="admin/products" element={<Products />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
