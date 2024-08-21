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
exports.updateRoleStatusById = exports.updateBanStatusById = exports.isExist = exports.findUserAndDelete = exports.findUserById = exports.getUsers = void 0;
const userSchema_1 = __importDefault(require("../models/userSchema"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const cloudinaryHelper_1 = require("../helper/cloudinaryHelper");
const getUsers = (page = 1, limit = 5, search = '') => __awaiter(void 0, void 0, void 0, function* () {
    const countUsers = yield userSchema_1.default.countDocuments();
    const totalPages = Math.ceil(countUsers / limit);
    if (page > totalPages) {
        page = totalPages;
    }
    const skip = (page - 1) * limit;
    const searchRegExp = new RegExp('.*' + search + '.*', 'i');
    const filter = {
        // isAdmin: { $ne: true },
        $or: [
            { email: { $regex: searchRegExp } },
            { address: { $regex: searchRegExp } },
            { phone: { $regex: searchRegExp } },
            { first_name: { $regex: searchRegExp } },
        ],
    };
    const ignoreOptions = {
        // password: 0,
        __v: 0,
        updatedAt: 0,
        // isAdmin: 0,
    };
    const users = yield userSchema_1.default.find(filter, ignoreOptions)
        .populate('order')
        .skip(skip)
        .limit(limit)
        .sort({ first_name: 1, created_at: 1 });
    return {
        users,
        totalPages,
        countUsers,
        currentPage: page,
    };
});
exports.getUsers = getUsers;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userSchema_1.default.findById(id, { password: 0 }).populate('order');
        if (!user) {
            const error = new ApiError_1.default(404, `User not found with this id ${id}`);
            throw error;
        }
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.findUserById = findUserById;
const findUserAndDelete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToDelete = yield userSchema_1.default.findById(id);
        if (!userToDelete) {
            const error = new ApiError_1.default(404, `User not found with this id ${id}`);
            throw error;
        }
        if (userToDelete && userToDelete.image) {
            // await deleteImage(userToDelete.image)
            const publicId = yield (0, cloudinaryHelper_1.valueWithoutExtension)(userToDelete.image);
            yield (0, cloudinaryHelper_1.deleteFromCloudinary)(`Full-Stack-Project/Users/${publicId}`);
        }
        const deletedUser = yield userSchema_1.default.findByIdAndDelete(id);
        return deletedUser;
    }
    catch (error) {
        throw error;
    }
});
exports.findUserAndDelete = findUserAndDelete;
const isExist = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield userSchema_1.default.exists({ email: email });
    if (userExist) {
        const error = ApiError_1.default.exist('User with this email already exist');
        throw error;
    }
});
exports.isExist = isExist;
const updateBanStatusById = (id, isBanned) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userSchema_1.default.findByIdAndUpdate(id, { isBanned }, { new: true });
    if (!user) {
        const error = ApiError_1.default.notFound('User with this id not found');
        throw error;
    }
});
exports.updateBanStatusById = updateBanStatusById;
const updateRoleStatusById = (id, isAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userSchema_1.default.findByIdAndUpdate(id, { isAdmin }, { new: true });
    if (!user) {
        const error = ApiError_1.default.notFound('User with this id not found');
        throw error;
    }
});
exports.updateRoleStatusById = updateRoleStatusById;
