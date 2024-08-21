import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';

import { fetchOrders, fetchSingleOrder, Order, OrderState } from '../redux/slices/products/orderSlice';
import { fetchUserById } from '../redux/slices/products/userSlice';
import style from './styles/users.module.css'

const UserOrdersComponent = () => {
    const dispatch: AppDispatch = useDispatch()

  // Fetch user orders on component mount
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Retrieve user orders from Redux store
  const { orders, isLoading, error } = useSelector((state: RootState) => state.ordersReducer)
  const { userData } = useSelector((state: RootState) => state.usersReducer)
  const id = userData?._id
  const [orderDetails, setOrderDetails] = useState<Order[]>([]);
const userOrders = userData?.order


  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }



  return (
    <div className={style.user_orders}>
      <h2>User Orders</h2>
      {userData?.order.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              {/* <th>User</th>
              <th>Order Items</th>
              <th>Total Amount</th>
              <th>Status</th> */}
            </tr>
          </thead>
          <tbody>
            {userData?.order.map((order: Order) => (
              <tr key={order._id}>
                <td>{userOrders}</td>
                {/* <td>{order._id}</td>
                <td>{order.user}</td> */}
                {/* <td>
                  <ul>
                    {order.orderItems.map((item) => (
                      <li key={item._id}>
                        Product: {item.product}, Quantity: {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{order.status}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserOrdersComponent;
