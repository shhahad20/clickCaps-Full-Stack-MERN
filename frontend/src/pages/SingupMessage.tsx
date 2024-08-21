import style from './styles/activationPage.module.css'

const SignUpMessage = () => {
  return (
    <div className={style.content}>
      <div className={style.content__div}>
        <h1 className={style.content__h1}>Almost There!</h1>
        <p>
          Thank you for signing up with us!
          <br />
          please check your email for activation.
        </p>
        <a className={style.error_btn} href="/">
          Back to Home
        </a>
      </div>
    </div>
  )
}

export default SignUpMessage
