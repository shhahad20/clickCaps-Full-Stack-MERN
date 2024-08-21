"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidation = void 0;
const express_validator_1 = require("express-validator");
exports.orderValidation = [
    (0, express_validator_1.check)('user')
        .trim()
        .notEmpty()
        .withMessage('User ID is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('User ID should be at least 3-50 characters long'),
    (0, express_validator_1.check)('orderItems').notEmpty().withMessage('Order Items are required'),
    (0, express_validator_1.check)('totalAmount').notEmpty().withMessage('total Amount is required'),
    (0, express_validator_1.check)('status')
        .trim()
        .notEmpty()
        .withMessage('Status is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Status should be at least 3-50 characters long'),
];
