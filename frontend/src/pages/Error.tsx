import style from './styles/error.module.css'

const Error = () => {
  return (
    <div id="content" className={style.error_container}>
      <div className="text-center error-page-w">
        <img src="https://i.imgur.com/qIufhof.png" alt="404" className={style.error_img} />
        <h1 className={style.error_header}>Oops! Page not found</h1>
        <p className={style.error_message}>
          The page you are looking for might have been removed had <br /> its name changed or is
          temporarily unavailable.
        </p>
        <a className={style.error_btn} href="/">
          Back to Home
        </a>
      </div>
    </div>
  )
}

export default Error
