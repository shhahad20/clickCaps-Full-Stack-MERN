import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'

import { logoutUser } from '../redux/slices/products/userSlice'

import style from './styles/navbar.module.css'
import MenuIcon from '@mui/icons-material/Menu'
import CartIcon from './CartIcon'

function Navbar() {
  const { isLoggedIn, userData } = useSelector((state: RootState) => state.usersReducer)
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()

  const handelLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  const { cartItems } = useSelector((state: RootState) => state.cartReducer)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className={style.navbar}>
      <ul className={style.nav_contanier}>
        <div className={style.logo}>
          <Link to="/">
            <h2 className={style.logo_text}>ClickCaps</h2>
          </Link>
        </div>
        {!isMobile && (
          <>
            <div className={style.left_nav}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              {isLoggedIn && (
                <li>
                  <Link to={`/dashboard/${userData?.isAdmin ? 'admin' : 'user'}`}>
                    {userData?.isAdmin ? 'Admin' : 'User'} Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link to="*">About us</Link>
              </li>
              <li>
                <Link to="*">Contact us</Link>
              </li>
            </div>
          </>
        )}

        <div className={style.right_nav}>
          <li className={style.mini_cart}>
            <Link to="/cart">
              <CartIcon value={cartItems.length > 0 ? cartItems.length : 0} />
            </Link>
          </li>
          {isLoggedIn && (
            <>
              <li className={style.login_signup}>
                <Link to="/" onClick={handelLogout}>
                  Logout
                </Link>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li className={style.login_signup}>
                <Link to="/login">Login</Link>
              </li>
              <li className={style.login_signup}>
                <Link to="/signup">Sign Up</Link>
              </li>
            </>
          )}
          {isMobile && (
            <li onClick={handleMobileMenuToggle} className={style.mobile_menu_toggle}>
              <MenuIcon />
            </li>
          )}
        </div>
      </ul>

      {isMobile && isMobileMenuOpen && (
        <div className={style.mobile_menu}>
          <ul className={style.mobile_menu_items}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link to={`/dashboard/${userData?.isAdmin ? 'admin' : 'user'}`}>
                  {userData?.isAdmin ? 'Admin' : 'User'} Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link to="*">About us</Link>
            </li>
            <li>
              <Link to="*">Contact us</Link>
            </li>
            {isLoggedIn && (
              <>
                <li className={style.login_signup}>
                  <Link to="/" onClick={handelLogout}>
                    Logout
                  </Link>
                </li>
              </>
            )}
            {!isLoggedIn && (
              <>
                <li className={style.login_signup}>
                  <Link to="/login">Login</Link>
                </li>
                <li className={style.login_signup}>
                  <Link to="/signup">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Navbar
