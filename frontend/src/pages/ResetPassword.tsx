import { ChangeEvent, FormEvent, useState } from 'react'
import jwtDecode from 'jwt-decode'
import { useNavigate, useParams } from 'react-router-dom'

import { resetPassword } from '../redux/slices/products/userSlice'
import style from './styles/resetForgetPassword.module.css'

const ResetPassword = ({ pathName }: { pathName: string }) => {
  const { token } = useParams()
  const decoded = jwtDecode(token)
  const navigate = useNavigate()
  const [password, setNewPassword] = useState({
    password: '',
    confirmPassword: ''
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setNewPassword((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handelResetPassword = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const response = await resetPassword(
        String(token),
        password.password,
        password.confirmPassword
      )
      navigate(pathName ? pathName : '/login')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={style.reset_container}>
      <div className={style.login_box}>
        <h2>Reset Password</h2>
        <form onSubmit={handelResetPassword}>
          <div className={style.user_box}>
            <input
              type="password"
              name="password"
              value={password.password}
              onChange={handleChange}
              required
            />
            <label>Password</label>
          </div>
          <div className={style.user_box}>
            <input
              type="password"
              name="confirmPassword"
              value={password.confirmPassword}
              onChange={handleChange}
              required
            />
            <label>confirm Password</label>
          </div>
          <button className={style.send_button}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Reset
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
