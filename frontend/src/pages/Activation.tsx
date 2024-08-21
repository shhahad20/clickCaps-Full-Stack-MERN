import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

import style from './styles/activationPage.module.css'
import { activateUser } from '../redux/slices/products/userSlice'
import { Alert } from '@mui/material'

const Activate = () => {
  const { token } = useParams()
  const decoded = jwtDecode(token)
  const navigate = useNavigate()
  const [alertMessage, setAlertMessage] = useState('')
  const [successAlertMessage, setSuccessAlertMessage] = useState('')

  const handelActivation = async () => {
    try {
      const response = await activateUser(String(token))
      setSuccessAlertMessage('Your Account is activaited successfully!')
      navigate('/login')
    } catch (error) {
      setAlertMessage(`There is somthing wrong! ${error}`)
      console.log(error)
    }
  }
  return (
    <div className={style.content}>
      {successAlertMessage && <Alert severity="success">{successAlertMessage}</Alert>}
      {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
      <div className={style.content__div}>
        <h1 className={style.content__h1}>
          Hello {decoded.first_name} {decoded.last_name}
        </h1>
        <p>
          Thank you for signing up with us!
          <br />
          We&apos;re excited to have you join our community. <br /> To complete the registration
          process and activate your account, <br /> please click on the following button:
        </p>
        <button className={style.activation_button} onClick={handelActivation}>
          Activate
        </button>
      </div>
    </div>
  )
}

export default Activate
