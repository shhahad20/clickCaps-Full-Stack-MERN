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
exports.isAdmin = exports.isLoggedOut = exports.isLoggenIn = void 0;
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authController_1 = require("../controllers/authController");
const userSchema_1 = __importDefault(require("../models/userSchema"));
const isLoggenIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.cookies.access_token;
        console.log(accessToken);
        if (!accessToken) {
            throw ApiError_1.default.unauthorized('Plesae Login first');
        }
        const decoded = (yield jsonwebtoken_1.default.verify(accessToken, authController_1.ACCESS_KEY));
        if (!decoded) {
            throw ApiError_1.default.unauthorized('Invaild access token');
        }
        req.userId = decoded._id;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.isLoggenIn = isLoggenIn;
const isLoggedOut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.cookies.access_token;
        if (accessToken) {
            throw ApiError_1.default.unauthorized('You are already Logged in');
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.isLoggedOut = isLoggedOut;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userSchema_1.default.findById(req.userId);
        if (user && user.isAdmin) {
            next();
        }
        else {
            const error = new ApiError_1.default(403, `You are not an admin.`);
            throw error;
        }
    }
    catch (error) {
        next(error);
    }
});
exports.isAdmin = isAdmin;
