"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (tokenPayload, secretKey, expiresIn) => {
    try {
        if (typeof secretKey !== 'string' || secretKey === '') {
            throw new Error('secretKey invaild,secretKey must not be a non-empty string!');
        }
        const token = jsonwebtoken_1.default.sign(tokenPayload, secretKey, {
            expiresIn: expiresIn,
        });
        return token;
    }
    catch (error) {
        throw error;
    }
};
exports.default = generateToken;
