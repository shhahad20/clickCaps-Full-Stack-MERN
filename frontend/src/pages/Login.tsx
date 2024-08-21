import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { AppDispatch, RootState } from '../redux/store'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Alert } from '@mui/material'
import { fetchUser, loginUser } from '../redux/slices/products/userSlice'
import style from './styles/login.module.css'

function Login({ pathName }: { pathName: string }) {
  const navigate = useNavigate()
  const { userData, isLoggedIn } = useSelector((state: RootState) => state.usersReducer)

  const [errorAlertMessage, setErrorAlertMessage] = useState('')
  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUser(1))
  }, [dispatch])

  useEffect(() => {
    if (userData) {
      navigate(pathName ? pathName : '/')
    }
  }, [userData, navigate, pathName])
  console.log(isLoggedIn)
  const handelInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target
    setUser((prevState) => {
      return { ...prevState, [name]: value }
    })
  }

  const handelSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const response = await dispatch(loginUser(user)).unwrap()
      return response
    } catch (error) {
      setErrorAlertMessage('Wrong password or email. Please try again.')
      console.log(error)
    }
    setUser({
      email: '',
      password: ''
    })
  } 
  return (
    <div className={style.login_container}>
      <div className={style.login_box}>
        <h2 className={style.login_header}>Login</h2>
        <form className={style.form} action="" onSubmit={handelSubmit}>
          <div className={style.user_box}>
            <input
              className={style.input}
              type="text"
              name="email"
              onChange={handelInputChange}
              required
            />
            <label className={style.label} htmlFor="email">
              Email:
            </label>
          </div>
          <div className={style.user_box}>
            <input
              className={style.input}
              type="password"
              name="password"
              onChange={handelInputChange}
              required
            />
            <label className={style.label} htmlFor="password">
              Password:
            </label>
          </div>
          <button className={style.form_button}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Login
          </button>
          <div className={style.under_button}></div>
          <div>
            <span className={style.forget_password}>
              <Link to="/forget-password">Forget Password?</Link>
            </span>{' '}
          </div>
          <div>
            <sub>
              Don&apos;t have an Account?{' '}
              <span>
                <Link to="/signup">Sign Up</Link>
              </span>{' '}
            </sub>{' '}
            <br />
          </div>
        </form>
        {errorAlertMessage && <Alert severity="error">{errorAlertMessage}</Alert>}
      </div>
    </div>
  )
}

export default Login
