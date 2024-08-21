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
exports.deleteProductById = exports.updateProductById = exports.getProductById = exports.createProduct = exports.getAllProducts = void 0;
const slugify_1 = __importDefault(require("slugify"));
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const productSchema_1 = __importDefault(require("../models/productSchema"));
const productService_1 = require("../services/productService");
const jsonwebtoken_1 = require("jsonwebtoken");
const cloudinaryHelper_1 = require("../helper/cloudinaryHelper");
// Get All Products
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const sortOrder = req.query.sortOrder || 'desc';
        const categorySlug = req.query.categorySlug;
        const search = req.query.search;
        const { products, totalPages, currentPage, count } = yield (0, productService_1.getProducts)(page, limit, sortOrder, categorySlug, search);
        res.status(200).json({
            message: 'Get all the products',
            payload: {
                products,
                pagination: {
                    totalProducts: count,
                    totalPages,
                    currentPage: page,
                },
            },
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getAllProducts = getAllProducts;
// Create Product
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, category, description, quantity, sold, shipping } = req.body;
        let image = req.file && req.file.path;
        console.log('Hi thereeeee: ' + image);
        if (!name || typeof name !== 'string') {
            throw new Error('Product name is missing or invalid');
        }
        const productExist = yield productSchema_1.default.exists({ name: name });
        if (productExist) {
            throw new ApiError_1.default(409, 'product already exist with this name');
        }
        if (image) {
            const cloudinaryUrl = yield (0, cloudinaryHelper_1.uploadToCloudinary)(image, 'Full-Stack-Project/Products');
            image = cloudinaryUrl;
        }
        const newProduct = new productSchema_1.default({
            name: name,
            price: price,
            slug: (0, slugify_1.default)(name),
            image: image,
            category: category,
            description: description,
            quantity: quantity,
            sold: sold,
            shipping: shipping,
        });
        yield newProduct.save();
        res.status(201).json({ message: 'Product is created', payload: newProduct });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.createProduct = createProduct;
// Get a single product by slug
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const product = yield (0, productService_1.findProductById)(id);
        res.status(200).json({ message: 'Get product by id', payload: product });
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
exports.getProductById = getProductById;
// Update Product
const updateProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        let image = req.file && req.file.path;
        const updatedProduct = req.body;
        const productToDelete = yield (0, productService_1.findProductById)(id);
        const updateData = yield productSchema_1.default.findByIdAndUpdate(id, updatedProduct, {
            new: true,
        });
        if (image) {
            if (productToDelete && productToDelete.image) {
                const publicId = yield (0, cloudinaryHelper_1.valueWithoutExtension)(productToDelete.image);
                yield (0, cloudinaryHelper_1.deleteFromCloudinary)(`Full-Stack-Project/Products/${productToDelete.image}`);
            }
            const cloudinaryUrl = yield (0, cloudinaryHelper_1.uploadToCloudinary)(image, 'Full-Stack-Project/Products');
            image = cloudinaryUrl;
        }
        if (!updateData) {
            next(ApiError_1.default.notFound('Product not found with this id'));
            return;
        }
        res.status(200).json({ message: 'You updated a product', payload: updateData });
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
exports.updateProductById = updateProductById;
// Delete Product
const deleteProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const deletedProduct = yield (0, productService_1.removeProductById)(id);
        res.status(200).json({
            message: `You deleted a product`,
        });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            const error = new ApiError_1.default(400, `Not vaild id`);
            next(error);
        }
        else {
            next(error);
            console.log(error);
        }
    }
});
exports.deleteProductById = deleteProductById;
