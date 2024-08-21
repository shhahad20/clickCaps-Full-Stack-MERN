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
exports.deleteCategoryById = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const slugify_1 = __importDefault(require("slugify"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const categorySchema_1 = require("../models/categorySchema");
const getCategories = (page, limit, descOrAsc, searchedText) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield categorySchema_1.Category.countDocuments();
    const totalPages = Math.ceil(count / limit);
    let order = descOrAsc === 1 ? 1 : -1;
    if (page > totalPages) {
        page = totalPages;
    }
    const skip = (page - 1) * limit;
    const categories = yield categorySchema_1.Category.find({ title: { $regex: searchedText, $options: 'i' } })
        .skip(skip)
        .limit(limit)
        .sort({ title: order });
    if ((categories === null || categories === void 0 ? void 0 : categories.length) === 0) {
        throw new ApiError_1.default(404, `Category not found`);
    }
    return { categories, totalPages, currentPage: page, count };
});
exports.getCategories = getCategories;
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield categorySchema_1.Category.findById({ _id: id });
    if (!category) {
        throw new ApiError_1.default(404, `Category not found with this id : ${id}`);
    }
    return category;
});
exports.getCategoryById = getCategoryById;
const createCategory = (title) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryExists = yield categorySchema_1.Category.exists({ title });
    if (categoryExists) {
        throw new ApiError_1.default(409, 'The category already exists with this title');
    }
    const newCategory = new categorySchema_1.Category({
        title,
        slug: (0, slugify_1.default)(title),
    });
    yield newCategory.save();
});
exports.createCategory = createCategory;
const updateCategory = (id, title, data) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryExists = yield categorySchema_1.Category.exists({ title });
    if (categoryExists) {
        throw new ApiError_1.default(409, 'The category already exists with this title');
    }
    // const category = await Category.findOneAndUpdate({ _id: id }, data, {
    //   new: true,
    // })
    const category = yield categorySchema_1.Category.findByIdAndUpdate(id, data, {
        new: true,
    });
    if (!category) {
        throw new ApiError_1.default(404, `Category not found with this id: ${id}`);
    }
    return category;
});
exports.updateCategory = updateCategory;
const deleteCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield categorySchema_1.Category.findOneAndDelete({ _id: id });
    if (!category) {
        throw new ApiError_1.default(404, `Category not found with this id : ${id}`);
    }
    return category;
});
exports.deleteCategoryById = deleteCategoryById;
