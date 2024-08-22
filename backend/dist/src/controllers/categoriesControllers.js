import mongoose from 'mongoose';
import ApiError from '../errors/ApiError.js';
import { createCategory, deleteCategoryById, getCategories, getCategoryById, } from '../services/categoriesServices.js';
import { Category } from '../models/categorySchema.js';
export const getAllCategories = async (req, res, next) => {
    try {
        let page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const descOrAsc = Number(req.query.descOrAsc);
        const searchedText = req.query.searchedText || '';
        const { categories, totalPages, currentPage, count } = await getCategories(page, limit, descOrAsc, searchedText);
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
};
export const getSingleCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await getCategoryById(id);
        res.status(200).json({
            success: true,
            message: 'return a single category by ID',
            payload: category,
        });
    }
    catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            const error = new ApiError(400, `Id format is not valid`);
            next(error);
        }
        else {
            next(error);
        }
    }
};
export const addCategory = async (req, res, next) => {
    try {
        console.log("Stage 1");
        const { title } = req.body;
        await createCategory(title);
        res.status(201).json({
            success: true,
            message: 'A new category has been created',
        });
    }
    catch (error) {
        next(error);
        console.log(error);
    }
};
export const updateSingleCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedTitle = req.body;
        const updateData = await Category.findByIdAndUpdate(id, updatedTitle, {
            new: true,
        });
        if (!updateData) {
            next(ApiError.notFound('Category not found'));
            return;
        }
        res.status(200).json({
            message: `You updated a category`,
        });
    }
    catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            const error = new ApiError(400, `Not vaild id`);
            next(error);
        }
        else {
            next(error);
        }
    }
};
export const deleteCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await deleteCategoryById(id);
        res.status(200).json({
            success: true,
            message: 'delete a single category',
            payload: category,
        });
    }
    catch (error) {
        next(error);
    }
};