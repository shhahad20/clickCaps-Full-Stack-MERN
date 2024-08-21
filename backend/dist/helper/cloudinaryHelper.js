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
exports.deleteFromCloudinary = exports.valueWithoutExtension = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
require("dotenv/config");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const uploadToCloudinary = (image, folderName) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield cloudinary_1.v2.uploader.upload(image, {
        folder: folderName,
    });
    return response.secure_url;
});
exports.uploadToCloudinary = uploadToCloudinary;
const valueWithoutExtension = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    // Split the URL by slashes to get an array of path segments
    const pathSegments = imageUrl.split('/');
    // Get the last segment
    const lastSegment = pathSegments[pathSegments.length - 1];
    // Remove the file extension (.jpg) from the last segment
    // const valueWithoutExtension = lastSegment.replace('.jpg', '')
    const filenameParts = lastSegment.split('.');
    filenameParts.pop();
    const valueWithoutExtension = filenameParts.join('.');
    return valueWithoutExtension;
});
exports.valueWithoutExtension = valueWithoutExtension;
const deleteFromCloudinary = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield cloudinary_1.v2.uploader.destroy(publicId);
        if (response.result !== 'ok') {
            throw ApiError_1.default.badRequest('image was not deleted from cloudinary');
        }
        console.log('image was deleted from cloudinary');
    }
    catch (error) {
        throw error;
    }
});
exports.deleteFromCloudinary = deleteFromCloudinary;
