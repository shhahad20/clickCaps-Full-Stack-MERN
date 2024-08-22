import express from 'express';
import { createOrder, deleteOrder, getAllOrders, getOrderById, updateOrder, updateOrderByUser, } from '../controllers/orderControllers.js';
import { stripeCheckout } from '../controllers/stripeControllers.js';
const ordersRouter = express.Router();
// ordersRouter.use(
//   cors({
//     origin: 'http://localhost:5173',
//   })
// )
// ordersRouter.get('/', isLoggenIn, isAdmin, getAllOrders)
// ordersRouter.get('/:id', isLoggenIn, getOrderById)
// ordersRouter.post('/', isLoggenIn, createOrder)
// ordersRouter.put('/:id', isLoggenIn, isAdmin, updateOrder)
// ordersRouter.delete('/:id', isLoggenIn, isAdmin, deleteOrder)
// ordersRouter.put('/cart/:id', isLoggenIn, updateOrderByUser)
// ordersRouter.post('/create-checkout-session', isLoggenIn, checkoutOrder)
ordersRouter.get('/', getAllOrders);
ordersRouter.get('/:id', getOrderById);
ordersRouter.post('/', createOrder);
ordersRouter.put('/:id', updateOrder);
ordersRouter.delete('/:id', deleteOrder);
ordersRouter.put('/cart/:id', updateOrderByUser);
ordersRouter.post('/create-checkout-session', stripeCheckout);
export default ordersRouter;
