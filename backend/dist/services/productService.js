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
exports.removeProductById = exports.findProductById = exports.getProducts = void 0;
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const cloudinaryHelper_1 = require("../helper/cloudinaryHelper");
const categorySchema_1 = require("../models/categorySchema");
const productSchema_1 = __importDefault(require("../models/productSchema"));
const getProducts = (page = 1, limit = 2, sortOrder = 'desc', categorySlug, search) => __awaiter(void 0, void 0, void 0, function* () {
    // filtering
    let filterProducts = productSchema_1.default.find();
    if (categorySlug) {
        const category = yield categorySchema_1.Category.findOne({ slug: categorySlug });
        if (category) {
            filterProducts = filterProducts.where({ category: category._id });
        }
        else {
            return {
                products: [],
                totalPages: 0,
                currentPage: 1,
            };
        }
    }
    // search by product name
    if (search) {
        filterProducts = filterProducts.where({ name: { $regex: search, $options: 'i' } });
    }
    // pagination
    const count = yield productSchema_1.default.countDocuments();
    const totalPages = Math.ceil(count / limit);
    if (page > totalPages) {
        page = totalPages;
    }
    const skip = (page - 1) * limit;
    //sort
    let sortDirection = {};
    if (sortOrder === 'asc') {
        sortDirection = { price: 'asc' };
    }
    else {
        sortDirection = { price: 'desc' };
    }
    const products = yield productSchema_1.default.find(filterProducts)
        .populate('category')
        .skip(skip)
        .limit(limit)
        .sort(sortDirection);
    return {
        products,
        count,
        totalPages,
        currentPage: page,
    };
});
exports.getProducts = getProducts;
const findProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productSchema_1.default.findById({ _id: id });
        if (!product) {
            const error = new ApiError_1.default(404, 'Product not found with this slug');
            throw error;
        }
        return product;
    }
    catch (error) {
        throw error;
    }
});
exports.findProductById = findProductById;
const removeProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const product = await Product.findByIdAndDelete({ _id: id })
    // if (!product) {
    //   const error = new ApiError(404, 'Product not found with this slug')
    //   throw error
    // }
    // return product
    try {
        const productToDelete = yield productSchema_1.default.findById(id);
        if (!productToDelete) {
            const error = new ApiError_1.default(404, `User not found with this id ${id}`);
            throw error;
        }
        if (productToDelete && productToDelete.image) {
            const publicId = yield (0, cloudinaryHelper_1.valueWithoutExtension)(productToDelete.image);
            yield (0, cloudinaryHelper_1.deleteFromCloudinary)(`Full-Stack-Project/Products/${publicId}`);
            // await deleteImage(productToDelete.image)
        }
        const deletedProduct = yield productSchema_1.default.findByIdAndDelete(id);
        return deletedProduct;
    }
    catch (error) {
        throw error;
    }
});
exports.removeProductById = removeProductById;
