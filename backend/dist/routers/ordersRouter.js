"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderControllers_1 = require("../controllers/orderControllers");
const stripeControllers_1 = require("../controllers/stripeControllers");
const ordersRouter = express_1.default.Router();
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
ordersRouter.get('/', orderControllers_1.getAllOrders);
ordersRouter.get('/:id', orderControllers_1.getOrderById);
ordersRouter.post('/', orderControllers_1.createOrder);
ordersRouter.put('/:id', orderControllers_1.updateOrder);
ordersRouter.delete('/:id', orderControllers_1.deleteOrder);
ordersRouter.put('/cart/:id', orderControllers_1.updateOrderByUser);
ordersRouter.post('/create-checkout-session', stripeControllers_1.stripeCheckout);
exports.default = ordersRouter;
