"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const myLogger = (req, res, next) => {
    const filePath = './src/logs/requests.txt';
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString();
    const time = currentDate.toLocaleTimeString();
    const msg = `Method: ${req.method}, Path: ${req.path}, Date: ${date}, Time: ${time}\n`;
    fs_1.default.appendFile(filePath, msg, (err) => {
        if (err) {
            return next(new Error('FAILED TO LOG'));
        }
        next();
    });
};
exports.default = myLogger;
