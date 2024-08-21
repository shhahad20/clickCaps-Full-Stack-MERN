"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidation = void 0;
const express_validator_1 = require("express-validator");
exports.categoryValidation = [
    (0, express_validator_1.check)('title')
        .trim()
        .notEmpty()
        .withMessage('Category title is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Category title should be at least 3-50 characters long'),
];
