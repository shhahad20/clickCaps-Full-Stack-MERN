import slugify from 'slugify';
import ApiError from '../errors/ApiError.js';
import { Category } from '../models/categorySchema.js';
export const getCategories = async (page, limit, descOrAsc, searchedText) => {
    const count = await Category.countDocuments();
    const totalPages = Math.ceil(count / limit);
    let order = descOrAsc === 1 ? 1 : -1;
    if (page > totalPages) {
        page = totalPages;
    }
    const skip = (page - 1) * limit;
    const categories = await Category.find({ title: { $regex: searchedText, $options: 'i' } })
        .skip(skip)
        .limit(limit)
        .sort({ title: order });
    if (categories?.length === 0) {
        throw new ApiError(404, `Category not found`);
    }
    return { categories, totalPages, currentPage: page, count };
};
export const getCategoryById = async (id) => {
    const category = await Category.findById({ _id: id });
    if (!category) {
        throw new ApiError(404, `Category not found with this id : ${id}`);
    }
    return category;
};
export const createCategory = async (title) => {
    const categoryExists = await Category.exists({ title });
    if (categoryExists) {
        throw new ApiError(409, 'The category already exists with this title');
    }
    const newCategory = new Category({
        title,
        slug: slugify(title),
    });
    await newCategory.save();
};
export const updateCategory = async (id, title, data) => {
    const categoryExists = await Category.exists({ title });
    if (categoryExists) {
        throw new ApiError(409, 'The category already exists with this title');
    }
    // const category = await Category.findOneAndUpdate({ _id: id }, data, {
    //   new: true,
    // })
    const category = await Category.findByIdAndUpdate(id, data, {
        new: true,
    });
    if (!category) {
        throw new ApiError(404, `Category not found with this id: ${id}`);
    }
    return category;
};
export const deleteCategoryById = async (id) => {
    const category = await Category.findOneAndDelete({ _id: id });
    if (!category) {
        throw new ApiError(404, `Category not found with this id : ${id}`);
    }
    return category;
};
