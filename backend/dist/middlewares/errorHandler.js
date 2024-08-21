"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const apiErrorHandler = (err, req, res, next) => {
    if (err instanceof ApiError_1.default) {
        res.status(err.code).json({ msg: err.message });
        return;
    }
    res.status(500).json({ msg: 'Something went wrong.' });
};
exports.default = apiErrorHandler;
