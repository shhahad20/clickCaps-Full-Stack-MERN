import { AppDispatch, RootState } from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { clearCart, removeItemFromCart } from '../redux/slices/products/cartSlice'
import { createOrder } from '../redux/slices/products/orderSlice'
import { OrderDispatch } from '../types/types'

import style from './styles/cartPage.module.css'
import { Alert } from '@mui/material'
import PayButton from './PayButton'

function Cart({ pathName }: { pathName: string }) {
  const { cartItems } = useSelector((state: RootState) => state.cartReducer)
  const { userData } = useSelector((state: RootState) => state.usersReducer)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [totalPrice, setTotalPrice] = useState(0)
  const [newOrder, setNewOrder] = useState({
    user: userData?._id,
    orderItems: cartItems,
    totalAmount: totalPrice
  })
  const [productQuantities, setProductQuantities] = useState<{ [key: string]: number }>({})
  const [alertMessage, setAlertMessage] = useState('')
  const [SuccessAlertMessage, setSuccessAlertMessage] = useState('')

  const handleIncrement = (productId: string) => {
    if (productQuantities[productId] !== 10) {
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: (prevQuantities[productId] || 0) + 1
      }))
    } else {
      setAlertMessage(`Quantity cannot exceed 10`)
    }
  }
  const handleDecrement = (productId: string) => {
    if (productQuantities[productId] && productQuantities[productId] > 0) {
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: prevQuantities[productId] - 1
      }))
    } else {
      setAlertMessage(`Quantity must be 1 or more`)
    }
  }

  const AppDispatch: OrderDispatch = useDispatch()

  useEffect(() => {
    if (cartItems.length > 0) {
      const total = cartItems.reduce((accumulator, currentItem) => {
        const quantity = productQuantities[currentItem._id] || 1
        return accumulator + currentItem.price * quantity
      }, 0)
      setTotalPrice(total)
    } else {
      setTotalPrice(0)
    }
  }, [cartItems, productQuantities])

  const handlePlaceOrder = async () => {
    try {
      if (userData) {
        const orderItems = cartItems.map((item) => ({
          product: item._id,
          quantity: productQuantities[item._id] || 1
        }))
        const totalAmount = cartItems.reduce((total, item) => {
          const quantity = productQuantities[item._id] || 1
          return total + item.price * quantity
        }, 0)

        const orderWithQuantities = {
          user: userData._id,
          orderItems,
          totalAmount
        }
        await AppDispatch(createOrder(orderWithQuantities))
         dispatch(clearCart())
      } else {
        setAlertMessage(`Login first`)
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className={style.cart_contanier}>
      {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
      <div>
        <h1 className={style.cart_header}>Cart items</h1>
      </div>
      {cartItems &&
        cartItems.map((item) => {
          const { _id, name, description, price, image, quantity } = item
          return (
            <div key={_id} className={style.cart_item}>
              <div className={style.cart_info}>
                <div className={style.left_side_cart}>
                  <div className={style.image_container}>
                    <img src={image} alt="" />
                  </div>
                  <div className={style.item_info}>
                    <h3>{name}</h3>
                    <p>{description}</p>
                  </div>
                </div>
                <div className={style.right_side_cart}>
                  <div className={style.item_meta}>
                    <div className={style.quantity}>
                      <button
                        className={style.quantity_button}
                        onClick={() => handleIncrement(_id)}>
                        +
                      </button>
                      <h4>{productQuantities[_id] || 1}</h4>
                      <button
                        className={style.quantity_button}
                        onClick={() => handleDecrement(_id)}>
                        –
                      </button>
                    </div>

                    <h4 className={style.item_price}>${price}</h4>
                  </div>
                </div>
                <div className={style.close_button_container}>
                  <button
                    className={style.close_button}
                    onClick={() => {
                      dispatch(removeItemFromCart({ productId: _id }))
                    }}>
                    ×
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      <div className={style.bottom_div}>
        <h4 className={style.total_header}>
          Total Price : <span>${totalPrice}</span>
        </h4>
        {/* <button className={style.place_order_btn} onClick={handlePlaceOrder}>
          Place Order
        </button> */}
        <PayButton cartItem={cartItems}/>
      </div>
    </div>
  )
}

export default Cart
