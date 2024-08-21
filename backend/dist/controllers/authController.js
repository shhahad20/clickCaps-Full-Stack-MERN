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
exports.handelLogout = exports.handelLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const handelLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const ignoreOptions = {
            password: 0,
            __v: 0,
            updatedAt: 0,
            // isAdmin: 0,
        };
        const user = yield userSchema_1.default.findOne({ email: email });
        if (!user) {
            throw ApiError_1.default.notFound(`User not found with this email ${email}`);
        }
        const isPasswordMatch = bcrypt_1.default.compareSync(password, user.password);
        if (!isPasswordMatch) {
            throw ApiError_1.default.unauthorized('Wrong password');
        }
        if (user.isBanned) {
            const error = new ApiError_1.default(403, `User is banned. For more info contact us.`);
            throw error;
        }
        const userId = user._id;
        const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, ACCESS_KEY, { expiresIn: '1h' });
        // const accessToken = generateToken(userId)
        res.cookie('access_token', accessToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            // secure: true
            secure: process.env.NODE_ENV === 'production',
        });
        const userDataToDisplay = yield userSchema_1.default.findById(userId, ignoreOptions);
        res.status(200).json({
            status: 200,
            message: `User is logged in`,
            payload: userDataToDisplay,
            // accessToken: accessToken,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.handelLogin = handelLogin;
const handelLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('access_token', { sameSite: 'none' });
        res.status(200).json({
            message: `User is logged out`,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.handelLogout = handelLogout;
