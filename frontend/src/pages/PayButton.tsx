import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { baseURL } from '../api'

const PayButton = ({ cartItem }) => {
  const { userData } = useSelector((state: RootState) => state.usersReducer)
  const userId = userData?._id


  const handelCheckout = () => {
    console.log(cartItem)
    axios
      .post(`${baseURL}/api/orders/create-checkout-session`, { cartItem, userId })
      .then((res) => {
        const { url } = res.data;
        if (url) {
          window.open(url, '_blank'); // Open the Stripe checkout in a new tab
        }
      })
      .catch((error) => console.log(error.message))
  }

  return (
    <>
      <button onClick={() => handelCheckout()}>Checkout</button>
    </>
  )
}

export default PayButton
