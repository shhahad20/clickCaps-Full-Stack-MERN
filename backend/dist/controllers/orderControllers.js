"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderByUser = exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.getOrderById = exports.getAllOrders = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const orderSchema_1 = __importDefault(require("../models/orderSchema"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const sendEmail_1 = require("../helper/sendEmail");
const emails_1 = require("../helper/emails");
const getAllOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const orders = yield orderSchema_1.default.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate(['user', 'orderItems.product']);
        const count = yield orderSchema_1.default.countDocuments(filter);
        const totalPages = Math.ceil(count / limit);
        res.status(200).json({
            message: 'return all orders',
            payload: { orders, totalPages: totalPages, currentPage: page },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllOrders = getAllOrders;
const getOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const order = yield orderSchema_1.default.findById(id).populate(['user', 'orderItems.product']);
        if (order) {
            res.status(200).json({
                success: true,
                message: 'return a single order by ID',
                payload: order,
            });
        }
        else {
            throw new ApiError_1.default(404, `Order not found`);
        }
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            const error = new ApiError_1.default(400, `Id format is not valid`);
            next(error);
        }
        else {
            next(error);
        }
    }
});
exports.getOrderById = getOrderById;
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, orderItems, totalAmount } = req.body;
        const userInfo = yield userSchema_1.default.findById(user);
        const neworder = new orderSchema_1.default({
            user: user,
            orderItems: orderItems,
            totalAmount: totalAmount,
        });
        yield neworder.save();
        if (userInfo) {
            userInfo.order.push(neworder._id);
            yield userInfo.save();
            const emailToSend = (0, emails_1.OrderCreatedEmail)(userInfo.email, userInfo.first_name, userInfo.last_name, totalAmount);
            yield (0, sendEmail_1.emailSender)(emailToSend);
        }
        res.status(201).send({ message: 'Order is created', payload: neworder });
    }
    catch (error) {
        next(error);
    }
});
exports.createOrder = createOrder;
const updateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = req.body;
        const updatedOrder = yield orderSchema_1.default.findByIdAndUpdate(id, data, { new: true });
        const currentOrder = yield orderSchema_1.default.findById(id);
        if (!updatedOrder || !currentOrder)
            throw Error('No such order found');
        const users = yield userSchema_1.default.find({ _id: { $in: updatedOrder.user } });
        users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const emailToSend = (0, emails_1.OrderUpdatedEmail)(user.email, user.first_name, user.last_name, updatedOrder.status);
            yield (0, sendEmail_1.emailSender)(emailToSend);
        }));
        res.status(200).json({ message: 'Order status upadted', payload: updatedOrder });
    }
    catch (error) {
        next(error);
    }
});
exports.updateOrder = updateOrder;
const deleteOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const deletedOrder = yield orderSchema_1.default.findByIdAndDelete(id);
        res.status(200).send({ message: 'Deleted an order', payload: deletedOrder });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteOrder = deleteOrder;
const updateOrderByUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = req.body;
        const updatedOrder = yield orderSchema_1.default.findOneAndUpdate({ _id: id }, data.neworders, {
            new: true,
        });
        res.status(200).json(updatedOrder);
    }
    catch (error) {
        next(error);
    }
});
exports.updateOrderByUser = updateOrderByUser;
