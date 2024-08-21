import { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, RootState } from '../redux/store'
import { User, registerUser } from '../redux/slices/products/userSlice'

import { Alert } from '@mui/material'
import style from './styles/login.module.css'

const SignUp = () => {
  const navigate = useNavigate()
  const [alertMessage, setAlertMessage] = useState('')

  const { newUser } = useSelector((state: RootState) => state.usersReducer)

  const [newUserData, setNewUser] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    phone: '',
    address: '',
    image: '',
    isBanned: false,
    isAdmin: false
  })

  const emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
  const dispatch: AppDispatch = useDispatch()

  const handelChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Please do not forget to move uploading the image --> update user profile. *Not in the registeration proccess
    if (event.target.type === 'file') {
      const imageFile = event.target.files?.[0]
      console.log(typeof imageFile)
      const { name } = event.target
      setNewUser((prevUser) => {
        return { ...prevUser, [name]: imageFile }
      })
    } else {
      const { value, name } = event.target
      setNewUser((prevUser) => {
        return { ...prevUser, [name]: value }
      })
    }
  }

  const handelCreateUser = async (event: FormEvent) => {
    event.preventDefault()
    if (newUserData.first_name.length < 2 || newUserData.last_name.length < 2) {
      setAlertMessage('Invalid Names length. Names must have at least 2 characters.')
      return
    }
    if (!emailRegex.test(newUserData.email)) {
      setAlertMessage('Error! You have entered an invalid email.')
      return
    }
    try {
      const formData = new FormData()
      formData.append('first_name', newUserData.first_name)
      formData.append('last_name', newUserData.last_name)
      formData.append('email', newUserData.email)
      formData.append('password', newUserData.password)
      formData.append('phone', newUserData.phone)
      formData.append('image', newUserData.image)
      formData.append('address', newUserData.address)
      const response = await dispatch(registerUser(formData))
    } catch (error) {
      console.log(error)
    }
    navigate('/signup-message')
  }

  return (
    <div className={style.login_container}>
      <div className={style.login_box}>
        <h2 className={style.login_header}>Sign Up</h2>
        <form className={style.form} action="" onSubmit={handelCreateUser}>
          <div className={style.user_box}>
            <input
              className={style.input}
              type="text"
              name="first_name"
              value={newUserData.first_name}
              onChange={handelChange}
              required
            />
            <label className={style.label} htmlFor="FullName">
              First Name:
            </label>
          </div>
          <div className={style.user_box}>
            <input
              className={style.input}
              type="text"
              name="last_name"
              value={newUserData.last_name}
              onChange={handelChange}
              required
            />{' '}
            <label className={style.label} htmlFor="FullName">
              Last Name:
            </label>
          </div>
          <div className={style.user_box}>
            <input
              className={style.input}
              type="text"
              name="email"
              value={newUserData.email}
              onChange={handelChange}
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
              value={newUserData.password}
              onChange={handelChange}
              required
            />
            <label className={style.label} htmlFor="password">
              Password:
            </label>
          </div>
          {alertMessage && (
            <Alert severity="error">
              {alertMessage}
              <br />
            </Alert>
          )}
          <div className={style.user_box}>
            <input
              className={style.input}
              type="tel"
              name="phone"
              value={newUserData.phone}
              onChange={handelChange}
              required
            />
            <label className={style.label} htmlFor="phone">
              Phone:
            </label>
          </div>
          <div className={style.user_box}>
            <input
              className={style.input}
              type="text"
              name="address"
              value={newUserData.address}
              onChange={handelChange}
              required
            />
            <label className={style.label} htmlFor="address">
              Address:
            </label>
          </div>
          <div className={`${style.user_box} ${style.image_preview}`}>
            <img src={newUserData.image} alt="" />
          </div>
          <div className={style.user_box}>
            <input
              className={style.input}
              type="file"
              name="image"
              accept="image/*"
              onChange={handelChange}
            />
          </div>

          <label htmlFor="terms" className={style.terms}>
            <input type="checkbox" required />
            Accept our terms and police ...
          </label>
          <button className={style.form_button} type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp
