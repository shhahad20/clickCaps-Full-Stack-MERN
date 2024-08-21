import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import { ChangeEvent, useEffect, useState } from 'react'

import { OrderDispatch } from '../types/types'
import { Order, fetchOrders, searchOrder, updateOrder } from '../redux/slices/products/orderSlice'
import '../App.css'
import style from './styles/users.module.css'

const Orders = () => {
  const { orders, isLoading, error,search } = useSelector((state: RootState) => state.ordersReducer)
  const dispatch: OrderDispatch = useDispatch()
  const dispatch2: AppDispatch = useDispatch()

  const [newStatus, setNewStatus] = useState('pending')

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const handleOrderStatus = async (orderId: string) => {
    try {
      await dispatch(updateOrder({ id: orderId, updatedData: newStatus }))
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const searchItem = event.target.value
    dispatch2(searchOrder(searchItem))
  }


  if (isLoading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>{error}</p>
  }
  return (
    <>
      <div className={style.container}>
      <label htmlFor="search">Search:</label>
        <input type="text" placeholder="Search . . ." onChange={handleSearch} value={search} />
        <div className={style.row}>
          <div className={style.custom_col}>
            <table className={style.table_contanier}>
              <thead>
                <tr>
                  <th>Order Id</th>
                  <th>Buyer Id</th>
                  <th>Order Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  {/* <th>Purchased At</th> */}
                </tr>
              </thead>
              {orders &&
                orders.map((order: Order) => {
                  const { _id, orderItems, user, status, totalAmount } = order || {}
                  
                  return (
                    <tbody key={_id}>
                      <tr>
                        <td>
                          <a href="#">
                            <div className={style.first_line}>
                              <div className="">
                                <p className={style.user_name}>{order._id}</p>
                              </div>
                            </div>
                          </a>
                        </td>
                        <td>Buyer</td>
                        <td>{order.orderItems?.length || 0}</td>
                        <td>${order.totalAmount || 0}</td>
                        <td>{order.status || 'N/A'}</td>
                        <td>
                          <div className={style.dropdown}>
                            <button
                              className={`${style.btn} ${style['btn_sm']} ${style['btn_icon']}`}
                              type="button"
                              id="dropdownMenuButton2"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false">
                              <i
                                className={`${style.bx} ${style['bx_dots_horizontal_rounded']}`}
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Actions">
                                •••
                              </i>
                            </button>
                            <div
                              className={style.dropdown_menu}
                              aria-labelledby="dropdownMenuButton2">
                              <button
                                className={style.dropdown_btn_item}
                                onClick={() => {
                                  setNewStatus('confirmed')
                                  handleOrderStatus(order._id)
                                }}>
                                confirmed
                              </button>
                              <button
                                className={style.dropdown_btn_item}
                                onClick={() => {
                                  setNewStatus('shipped')
                                  handleOrderStatus(order._id)
                                }}>
                                shipped
                              </button>
                              <button
                                className={style.dropdown_btn_item}
                                onClick={() => {
                                  setNewStatus('delivered')
                                  handleOrderStatus(order._id)
                                }}>
                                delivered
                              </button>
                              <button
                                className={style.dropdown_btn_item}
                                onClick={() => {
                                  setNewStatus('cancelled')
                                  handleOrderStatus(order._id)
                                }}>
                                cancelled
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  )
                })}
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Orders
