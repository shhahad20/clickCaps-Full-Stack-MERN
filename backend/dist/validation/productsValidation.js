"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductValidator = exports.createProductValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createProductValidator = [
    (0, express_validator_1.check)('name')
        .trim()
        .notEmpty()
        .withMessage('Product Name is missing')
        .isLength({ min: 3, max: 200 })
        .withMessage('Product Name should be between 3 and 200 characters length'),
    (0, express_validator_1.check)('price')
        .trim()
        .notEmpty()
        .withMessage('Product price is required')
        .isFloat({ min: 1 })
        .withMessage('Product price must be a positive number'),
    (0, express_validator_1.check)('category')
        .notEmpty()
        .withMessage('Product category is required')
        .isMongoId()
        .withMessage('Invalid category ID'),
    (0, express_validator_1.check)('description')
        .notEmpty()
        .withMessage('Product description is required')
        .isLength({ min: 3, max: 500 })
        .withMessage('Product description should be between 3 and 500 characters length'),
    (0, express_validator_1.check)('quantity')
        .notEmpty()
        .withMessage('Product qantity is required!')
        .isInt({ min: 0 })
        .withMessage('Product qantity must be a non-negative integer'),
];
exports.updateProductValidator = [
    (0, express_validator_1.check)('name')
        .optional({ nullable: true })
        .isLength({ min: 3, max: 200 })
        .withMessage('Product name should be between 3 and 200 characters length'),
    (0, express_validator_1.check)('price')
        .optional({ nullable: true })
        .isFloat({ min: 1 })
        .withMessage('Product price must be a positive number'),
    (0, express_validator_1.check)('category').optional({ nullable: true }).isMongoId().withMessage('Invalid category ID'),
    (0, express_validator_1.check)('description')
        .optional({ nullable: true })
        .isLength({ min: 3, max: 500 })
        .withMessage('Product description should be between 3 and 500 characters length'),
    (0, express_validator_1.check)('quantity')
        .optional({ nullable: true })
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),
];
