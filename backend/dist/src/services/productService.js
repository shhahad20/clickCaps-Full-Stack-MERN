import ApiError from '../errors/ApiError.js';
import { deleteFromCloudinary, valueWithoutExtension } from '../helper/cloudinaryHelper.js';
import { Category } from '../models/categorySchema.js';
import Product from '../models/productSchema.js';
export const getProducts = async (page = 1, limit = 2, sortOrder = 'desc', categorySlug, search) => {
    // filtering
    let filterProducts = Product.find();
    if (categorySlug) {
        const category = await Category.findOne({ slug: categorySlug });
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
    const count = await Product.countDocuments();
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
    const products = await Product.find(filterProducts)
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
};
export const findProductById = async (id) => {
    try {
        const product = await Product.findById({ _id: id });
        if (!product) {
            const error = new ApiError(404, 'Product not found with this slug');
            throw error;
        }
        return product;
    }
    catch (error) {
        throw error;
    }
};
export const removeProductById = async (id) => {
    // const product = await Product.findByIdAndDelete({ _id: id })
    // if (!product) {
    //   const error = new ApiError(404, 'Product not found with this slug')
    //   throw error
    // }
    // return product
    try {
        const productToDelete = await Product.findById(id);
        if (!productToDelete) {
            const error = new ApiError(404, `User not found with this id ${id}`);
            throw error;
        }
        if (productToDelete && productToDelete.image) {
            const publicId = await valueWithoutExtension(productToDelete.image);
            await deleteFromCloudinary(`Full-Stack-Project/Products/${publicId}`);
            // await deleteImage(productToDelete.image)
        }
        const deletedProduct = await Product.findByIdAndDelete(id);
        return deletedProduct;
    }
    catch (error) {
        throw error;
    }
};
