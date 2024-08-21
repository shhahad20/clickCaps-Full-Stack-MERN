import axios from 'axios'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'

import { OrderItem, OrderType, initOrder } from '../types/type'

const Home = () => {
  const [orders, setOrders] = useState<OrderType>(initOrder)

  const url = 'http://localhost:5050/api'

  const fetchOrders = async () => {
    const { data } = await axios.get(`${url}/orders/656c0d83eb5c8c3691ec2434`)
    setOrders(data.payload)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const increment = (id: string, item: OrderItem) => {
    const updatedOrders = orders.orderItems.map((order) => {
      if (order._id === id) {
        return { ...order, quantity: item.quantity + 1 }
      }
      return order
    })
    const neworders = {
      _id: orders._id,
      user: orders.user,
      orderItems: updatedOrders,
      totalAmount: orders.totalAmount,
      status: orders.status,
    }
    console.log(neworders)
    updateQuantity(neworders)
  }

  const decrement = (id: string, item: OrderItem) => {
    const updatedOrders = orders.orderItems.map((order) => {
      if (order._id === id) {
        let quantity = item.quantity - 1
        if (quantity === 0) {
          quantity = 1
        }
        return { ...order, quantity: quantity }
      }
      return order
    })
    const neworders = {
      _id: orders._id,
      user: orders.user,
      orderItems: updatedOrders,
      totalAmount: orders.totalAmount,
      status: orders.status,
    }
    updateQuantity(neworders)
  }

  const updateQuantity = async (neworders: OrderType) => {
    try {
      const response = await axios.put(`${url}/orders/cart/6568e0842cd1376fceab9c04`, {
        neworders,
      })
      fetchOrders()
    } catch (error) {
      console.log('Data cannot be updated')
    }
  }

  const checkout = (orders: OrderType) => {
    axios
      .post(`${url}/orders/create-checkout-session`, {
        orders,
        userId: '656b535d4bafb857e8e980f4',
      })
      .then((response) => {
        if (response.data.url) {
          window.location.href = response.data.url
        }
      })
      .catch((err) => console.log(err.message))
  }

  return (
    <>
      {!orders ? (
        <p style={{ padding: 0, margin: '2rem' }}>The orders list is empty...</p>
      ) : (
        <>
          <div className="container" style={{ height: '5rem' }}>
            <div className="image">
              <h3>Product image</h3>
            </div>
            <div className="details">
              <h3>Name</h3>
            </div>
            <div className="price">
              <h3>Price</h3>
            </div>
            <div className="quantity">
              <h3>Quantity</h3>
            </div>
            <div className="edit" style={{ color: '#213547' }}>
              <h3>Edit</h3>
            </div>
            <div className="delete" style={{ color: '#213547' }}>
              <h3>Delete</h3>
            </div>
          </div>
          {orders.orderItems.map((item) => {
            const { name, image, price } = item.product
            return (
              <div className="container" key={item._id}>
                <div className="image">
                  <img
                    src={`http://localhost:5050/${image.split('\\').slice(1).join('/')}`}
                    alt={name}
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="details">
                  <h2>{name}</h2>
                </div>
                <div className="price">
                  <h4>${price}</h4>
                </div>
                <div className="quantity">
                  <div className="cart-product-quantity">
                    <button onClick={() => decrement(item._id, item)}>-</button>
                    <div className="count">{item.quantity}</div>
                    <button onClick={() => increment(item._id, item)}>+</button>
                  </div>
                </div>
                <div className="edit">
                  <FontAwesomeIcon icon={faPen} /> Edit
                </div>
                <div className="delete">
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </div>
              </div>
            )
          })}
          <h3>
            Amount to be paid:
            <span style={{ color: 'red' }}> ${orders.totalAmount}</span>
          </h3>
          <button className="checkout" onClick={() => checkout(orders)}>
            Checkout
          </button>
        </>
      )}
    </>
  )
}

export default Home
