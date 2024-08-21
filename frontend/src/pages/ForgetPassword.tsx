import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { AppDispatch } from '../redux/store'
import { useDispatch } from 'react-redux'

import style from './styles/resetForgetPassword.module.css'
import { Alert } from '@mui/material'
import { fetchUser, forgetPassword } from '../redux/slices/products/userSlice'

const ForgetPassword = () => {
  const [email, setEmail] = useState('')
  const [errorAlertMessage, setErrorAlertMessage] = useState('')
  const [successAlertMessage, setSuccessAlertMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUser(currentPage))
  }, [dispatch])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const emailValue = event.target.value
    setEmail(emailValue)
  }
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const response = await forgetPassword(email)
      if (response?.message.includes('sent successfully')) {
        setSuccessAlertMessage('The email sent successfully, check your email')
      } else {
        setErrorAlertMessage('The email does not exist in our system. Please check and try again.')
      }
      return response.data
    } catch (error) {
      setErrorAlertMessage('There was an error processing your request. Please try again later.')
      console.log(error)
    }
    setEmail('')
  }
  return (
    <div className={style.reset_container}>
      <div className={style.login_box}>
        <h2 className={style.forget_header}>Forget Password</h2>
        <form onSubmit={handleSubmit}>
          <h2 className={style.forget_header_p}>
            You will receive instructions to reset your password on the email
          </h2>
          <div className={style.user_box}>
            <input type="text" name="email" required onChange={handleChange} />
            <label>Email</label>
          </div>
          <button className={style.send_button}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Send Email
          </button>
        </form>
      </div>
      {errorAlertMessage && <Alert severity="error">{errorAlertMessage}</Alert>}
      {successAlertMessage && <Alert severity="success">{successAlertMessage}</Alert>} <br />
    </div>
  )
}

export default ForgetPassword
