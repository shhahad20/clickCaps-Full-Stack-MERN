"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetPasswordValidator = exports.updateUserValidator = exports.creatUserValidator = void 0;
const express_validator_1 = require("express-validator");
exports.creatUserValidator = [
    (0, express_validator_1.check)('first_name')
        .notEmpty()
        .withMessage('First name required.')
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters long.'),
    (0, express_validator_1.check)('last_name')
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters long.'),
    (0, express_validator_1.check)('email')
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a vaild email address.'),
    (0, express_validator_1.check)('password')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i')
        .withMessage('Password should be combination of one uppercase , one lower case, one special char,one digit and min 8'),
    (0, express_validator_1.check)('address')
        .isLength({ min: 3 })
        .notEmpty()
        .withMessage('Address must be at least 3 characters'),
    (0, express_validator_1.check)('phone')
        .notEmpty()
        .isMobilePhone('any', { strictMode: false })
        .withMessage('Please provide a valid phone number'),
];
exports.updateUserValidator = [
    (0, express_validator_1.check)('first_name')
        .optional()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters long.'),
    (0, express_validator_1.check)('last_name')
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters long.'),
];
exports.forgetPasswordValidator = [
    (0, express_validator_1.check)('email')
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a vaild email address.'),
];
