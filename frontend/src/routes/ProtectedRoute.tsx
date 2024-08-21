import React from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../redux/store'
import { Outlet, useLocation } from 'react-router-dom'

import Login from '../pages/Login'

const ProtectedRoute = () => {
  const pathName = useLocation()
  const { isLoggedIn } = useSelector((state: RootState) => state.usersReducer)

  return isLoggedIn ? <Outlet /> : <Login pathName={location.pathname} />
}

export default ProtectedRoute
