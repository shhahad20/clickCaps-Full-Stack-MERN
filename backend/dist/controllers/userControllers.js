"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.unadminUser = exports.adminUser = exports.resetPassword = exports.forgetPassword = exports.unbanUser = exports.banUser = exports.activateUser = exports.updateUser = exports.registerUser = exports.deleteUserById = exports.getSingleUser = exports.getAllUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const sendEmail_1 = require("../helper/sendEmail");
const userServices_1 = require("../services/userServices");
const gernerateToken_1 = __importDefault(require("../util/gernerateToken"));
const emails_1 = require("../helper/emails");
const cloudinaryHelper_1 = require("../helper/cloudinaryHelper");
const DEFAULT_IMAGES_PATH = 'public/images/usersImages/default/usrImage.png';
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        let search = req.query.search;
        const { users, totalPages, currentPage, countUsers } = yield (0, userServices_1.getUsers)(page, limit, search);
        if ((users === null || users === void 0 ? void 0 : users.length) === 0) {
            next(ApiError_1.default.notFound('Users not found'));
            return;
        }
        res.status(200).json({
            message: 'all users are here',
            payload: {
                users,
                pagination: {
                    totalUsers: countUsers,
                    totalPages,
                    currentPage: page,
                },
            },
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            const error = new ApiError_1.default(400, `Not vaild id`);
            next(error);
        }
        else {
            next(error);
        }
    }
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        const user = yield (0, userServices_1.findUserById)(id);
        res.status(200).json({ message: 'Get user by id', payload: user });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            const error = new ApiError_1.default(400, `Not vaild id`);
            next(error);
        }
        else {
            next(error);
        }
    }
});
exports.getSingleUser = getSingleUser;
const deleteUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        const deletedUser = yield (0, userServices_1.findUserAndDelete)(id);
        res.status(200).json({
            message: `You deleted a user`,
        });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            const error = new ApiError_1.default(400, `Not vaild id`);
            next(error);
        }
        else {
            next(error);
        }
    }
});
exports.deleteUserById = deleteUserById;
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { first_name, last_name, email, password, address, phone, age, gender, order } = req.body;
        const imagePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        const userExist = yield (0, userServices_1.isExist)(email);
        const hashPassword = bcrypt_1.default.hashSync(password, 10);
        const tokenPayload = new userSchema_1.default({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashPassword,
            gender: gender,
            age: age,
            address: address,
            phone: phone,
            image: DEFAULT_IMAGES_PATH,
            order: order,
        });
        if (imagePath) {
            tokenPayload.image = imagePath;
        }
        const tokenPayloadObject = tokenPayload.toObject();
        const token = (0, gernerateToken_1.default)(tokenPayloadObject, RESETPASSWORD_KEY, '60m');
        const emailToSend = (0, emails_1.registeringEmail)(email, first_name, last_name, token);
        yield (0, sendEmail_1.emailSender)(emailToSend);
        res.status(200).json({
            message: 'Please check your email to activate your account',
            token: token,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.registerUser = registerUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        let image = req.file && req.file.path;
        const updatedUser = req.body;
        const newPassword = req.body.password;
        if (newPassword) {
            updatedUser.password = bcrypt_1.default.hashSync(newPassword, 10);
        }
        const userImageToDelete = yield (0, userServices_1.findUserById)(id);
        const updateData = yield userSchema_1.default.findByIdAndUpdate(id, updatedUser, {
            new: true,
        });
        if (image) {
            if (userImageToDelete && userImageToDelete.image) {
                const publicId = yield (0, cloudinaryHelper_1.valueWithoutExtension)(userImageToDelete.image);
                yield (0, cloudinaryHelper_1.deleteFromCloudinary)(`Full-Stack-Project/Users/${publicId}`);
            }
            const cloudinaryUrl = yield (0, cloudinaryHelper_1.uploadToCloudinary)(image, 'Full-Stack-Project/Products');
            image = cloudinaryUrl;
        }
        if (!updateData) {
            next(ApiError_1.default.notFound('User not found'));
            return;
        }
        res.status(200).json({
            message: `You updated a user`,
            payload: updateData,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            const error = new ApiError_1.default(400, `Not vaild id`);
            next(error);
        }
        else {
            next(error);
        }
    }
});
exports.updateUser = updateUser;
const activateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const token = String(req.query.token)
        const { token } = req.body;
        if (!token) {
            next(ApiError_1.default.notFound('Plesae provide a vaild token'));
            return;
        }
        const decodedUserData = jsonwebtoken_1.default.verify(token, ACTIVATION_KEY);
        if (!decodedUserData) {
            next(ApiError_1.default.unauthorized('Invaild token'));
            return;
        }
        const cloudinaryUrl = yield (0, cloudinaryHelper_1.uploadToCloudinary)(decodedUserData.image, 'Full-Stack-Project/Users');
        decodedUserData.image = cloudinaryUrl;
        yield userSchema_1.default.create(decodedUserData);
        res.status(201).json({
            message: 'User is registered successfully',
        });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            next(ApiError_1.default.unauthorized('Token has expired'));
        }
        else {
            next(error);
        }
    }
});
exports.activateUser = activateUser;
const banUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        const user = yield (0, userServices_1.updateBanStatusById)(id, true);
        res.status(200).json({
            message: `You banned a user with ID: ${id}`,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            const error = new ApiError_1.default(400, `Not vaild id`);
            next(error);
        }
        else {
            next(error);
        }
    }
});
exports.banUser = banUser;
const unbanUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        const user = yield (0, userServices_1.updateBanStatusById)(id, false);
        res.status(200).json({
            message: `You unbanned a user with ID: ${id}`,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            const error = new ApiError_1.default(400, `Not vaild id`);
            next(error);
        }
        else {
            next(error);
        }
    }
});
exports.unbanUser = unbanUser;
const forgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const user = yield userSchema_1.default.findOne({ email: email });
        if (!user) {
            next(ApiError_1.default.notFound(`${email} not exisits`));
            return;
        }
        const token = (0, gernerateToken_1.default)({ email }, RESETPASSWORD_KEY, '60m');
        const emailToSend = (0, emails_1.forgetPasswordEmail)(email, user.first_name, user.last_name, token);
        yield (0, sendEmail_1.emailSender)(emailToSend);
        res.status(200).json({
            message: `The email sent successfully, check your email `,
            payload: token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.forgetPassword = forgetPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password, confirmPassword, email } = req.body;
        if (!token) {
            next(ApiError_1.default.notFound('Plesae provide a vaild token'));
            return;
        }
        if (password !== confirmPassword) {
            throw ApiError_1.default.unauthorized('Passwords does not match');
        }
        const decoded = jsonwebtoken_1.default.verify(token, RESETPASSWORD_KEY);
        if (!decoded) {
            next(ApiError_1.default.unauthorized('Invaild token'));
            return;
        }
        const updatedPassword = yield userSchema_1.default.findOneAndUpdate({ email: decoded.email }, { $set: { password: bcrypt_1.default.hashSync(password, 10) } });
        if (!updatedPassword) {
            throw ApiError_1.default.badRequest('Unsuccesssful password reset');
        }
        res.status(201).json({
            status: 200,
            message: 'Password is resteted successfully',
        });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            next(ApiError_1.default.unauthorized('Token has expired'));
        }
        else {
            next(error);
        }
    }
});
exports.resetPassword = resetPassword;
const adminUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        const user = yield (0, userServices_1.updateRoleStatusById)(id, true);
        res.status(200).json({
            message: `You make the role of user with ID: ${id} is Admin`,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            const error = new ApiError_1.default(400, `Not vaild id`);
            next(error);
        }
        else {
            next(error);
        }
    }
});
exports.adminUser = adminUser;
const unadminUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        const user = yield (0, userServices_1.updateRoleStatusById)(id, false);
        res.status(200).json({
            message: `You make the role of user with ID: ${id} is not Admin`,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            const error = new ApiError_1.default(400, `Not vaild id`);
            next(error);
        }
        else {
            next(error);
        }
    }
});
exports.unadminUser = unadminUser;
