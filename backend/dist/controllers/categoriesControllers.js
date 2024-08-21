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
exports.deleteCategory = exports.updateSingleCategory = exports.addCategory = exports.getSingleCategory = exports.getAllCategories = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const categoriesServices_1 = require("../services/categoriesServices");
const categorySchema_1 = require("../models/categorySchema");
const getAllCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const descOrAsc = Number(req.query.descOrAsc);
        const searchedText = req.query.searchedText || '';
        const { categories, totalPages, currentPage, count } = yield (0, categoriesServices_1.getCategories)(page, limit, descOrAsc, searchedText);
        res.status(200).json({
            message: 'return all categories',
            payload: {
                categories,
                pagination: {
                    totalCtaegories: count,
                    totalPages,
                    currentPage: page,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllCategories = getAllCategories;
const getSingleCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const category = yield (0, categoriesServices_1.getCategoryById)(id);
        res.status(200).json({
            success: true,
            message: 'return a single category by ID',
            payload: category,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            const error = new ApiError_1.default(400, `Id format is not valid`);
            next(error);
        }
        else {
            next(error);
        }
    }
});
exports.getSingleCategory = getSingleCategory;
const addCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        yield (0, categoriesServices_1.createCategory)(title);
        res.status(201).json({
            success: true,
            message: 'A new category has been created',
        });
    }
    catch (error) {
        next(error);
        console.log(error);
    }
});
exports.addCategory = addCategory;
const updateSingleCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const updatedTitle = req.body;
        const updateData = yield categorySchema_1.Category.findByIdAndUpdate(id, updatedTitle, {
            new: true,
        });
        if (!updateData) {
            next(ApiError_1.default.notFound('Category not found'));
            return;
        }
        res.status(200).json({
            message: `You updated a category`,
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
exports.updateSingleCategory = updateSingleCategory;
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const category = yield (0, categoriesServices_1.deleteCategoryById)(id);
        res.status(200).json({
            success: true,
            message: 'delete a single category',
            payload: category,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCategory = deleteCategory;
