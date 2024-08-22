import mongoose from 'mongoose';
import ApiError from '../errors/ApiError.js';
import Order from '../models/orderSchema.js';
import User from '../models/userSchema.js';
import { emailSender } from '../helper/sendEmail.js';
import { OrderCreatedEmail, OrderUpdatedEmail } from '../helper/emails.js';
export const getAllOrders = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 3;
        const skip = (page - 1) * limit;
        const status = req.query.status || null;
        let filter = {};
        if (status) {
            filter = { status: status };
        }
        const { search } = req.query;
        if (search && typeof search === 'string') {
            filter = {
                $or: [{ user: search }, { products: search }],
            };
        }
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate(['user', 'orderItems.product']);
        const count = await Order.countDocuments(filter);
        const totalPages = Math.ceil(count / limit);
        res.status(200).json({
            message: 'return all orders',
            payload: { orders, totalPages: totalPages, currentPage: page },
        });
    }
    catch (error) {
        next(error);
    }
};
export const getOrderById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await Order.findById(id).populate(['user', 'orderItems.product']);
        if (order) {
            res.status(200).json({
                success: true,
                message: 'return a single order by ID',
                payload: order,
            });
        }
        else {
            throw new ApiError(404, `Order not found`);
        }
    }
    catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            const error = new ApiError(400, `Id format is not valid`);
            next(error);
        }
        else {
            next(error);
        }
    }
};
export const createOrder = async (req, res, next) => {
    try {
        const { user, orderItems, totalAmount } = req.body;
        const userInfo = await User.findById(user);
        const neworder = new Order({
            user: user,
            orderItems: orderItems,
            totalAmount: totalAmount,
        });
        await neworder.save();
        if (userInfo) {
            userInfo.order.push(neworder._id);
            await userInfo.save();
            const emailToSend = OrderCreatedEmail(userInfo.email, userInfo.first_name, userInfo.last_name, totalAmount);
            await emailSender(emailToSend);
        }
        res.status(201).send({ message: 'Order is created', payload: neworder });
    }
    catch (error) {
        next(error);
    }
};
export const updateOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(id, data, { new: true });
        const currentOrder = await Order.findById(id);
        if (!updatedOrder || !currentOrder)
            throw Error('No such order found');
        const users = await User.find({ _id: { $in: updatedOrder.user } });
        users.map(async (user) => {
            const emailToSend = OrderUpdatedEmail(user.email, user.first_name, user.last_name, updatedOrder.status);
            await emailSender(emailToSend);
        });
        res.status(200).json({ message: 'Order status upadted', payload: updatedOrder });
    }
    catch (error) {
        next(error);
    }
};
export const deleteOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedOrder = await Order.findByIdAndDelete(id);
        res.status(200).send({ message: 'Deleted an order', payload: deletedOrder });
    }
    catch (error) {
        next(error);
    }
};
export const updateOrderByUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const updatedOrder = await Order.findOneAndUpdate({ _id: id }, data.neworders, {
            new: true,
        });
        res.status(200).json(updatedOrder);
    }
    catch (error) {
        next(error);
    }
};
