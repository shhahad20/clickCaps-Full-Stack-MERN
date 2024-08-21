"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runValidationUser = exports.runValidation = void 0;
const express_validator_1 = require("express-validator");
const runValidation = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        let errorsList = errors.array().map((error) => error.msg);
        return res.status(422).send({
            message: errorsList[0],
        });
    }
    next();
};
exports.runValidation = runValidation;
const runValidationUser = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        let errorsList = errors.array().map((error) => error.msg);
        return res.status(422).send({
            message: errorsList[0],
        });
    }
    next();
};
exports.runValidationUser = runValidationUser;
