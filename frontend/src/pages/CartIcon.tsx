import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import style from './styles/cartPage.module.css'

interface CartIconProps {
  value: number
}

const CartIcon: React.FC<CartIconProps> = (value) => {
  return (
    <div>
      <ShoppingCartIcon className={style.cart_icon} />
      <span className={style.in_cart}>{value.value}</span>
    </div>
  )
}

export default CartIcon
