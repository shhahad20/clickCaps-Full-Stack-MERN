import slugify from 'slugify'
import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import * as jwt from 'jsonwebtoken';

import ApiError from '../errors/ApiError.js'
import Product from '../models/productSchema.js'
import { ProductInterface } from '../types/productTypes.js'
import { findProductById, getProducts, removeProductById } from '../services/productService.js'
// import { TokenExpiredError } from 'jsonwebtoken'
import {
  deleteFromCloudinary,
  uploadToCloudinary,
  valueWithoutExtension,
} from '../helper/cloudinaryHelper.js'

// Get All Products
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    const categorySlug = req.query.categorySlug as string
    const search = req.query.search as string

    const { products, totalPages, currentPage, count } = await getProducts(
      page,
      limit,
      sortOrder,
      categorySlug,
      search
    )
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
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// Create Product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, price, category, description, quantity, sold, shipping } = req.body
    let image = req.file && req.file.path
    console.log('Hi thereeeee: ' + image)
    if (!name || typeof name !== 'string') {
      throw new Error('Product name is missing or invalid')
    }

    const productExist = await Product.exists({ name: name })
    if (productExist) {
      throw new ApiError(409, 'product already exist with this name')
    }
    if (image) {
      const cloudinaryUrl = await uploadToCloudinary(image, 'Full-Stack-Project/Products')
      image = cloudinaryUrl
    }
    const newProduct: ProductInterface = new Product({
      name: name,
      price: price,
      slug: slugify(name),
      image: image,
      category: category,
      description: description,
      quantity: quantity,
      sold: sold,
      shipping: shipping,
    })

    await newProduct.save()
    res.status(201).json({ message: 'Product is created', payload: newProduct })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// Get a single product by slug
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const product = await findProductById(id)
    res.status(200).json({ message: 'Get product by id', payload: product })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = new ApiError(400, `Not vaild id`)
      next(error)
    } else {
      next(error)
    }
  }
}

// Update Product
export const updateProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    let image = req.file && req.file.path
    const updatedProduct = req.body
    const productToDelete = await findProductById(id)
    const updateData = await Product.findByIdAndUpdate(id, updatedProduct, {
      new: true,
    })

    if (image) {
      if (productToDelete && productToDelete.image) {
        const publicId = await valueWithoutExtension(productToDelete.image)
        await deleteFromCloudinary(`Full-Stack-Project/Products/${productToDelete.image}`)
      }
      const cloudinaryUrl = await uploadToCloudinary(image, 'Full-Stack-Project/Products')
      image = cloudinaryUrl
    }
    if (!updateData) {
      next(ApiError.notFound('Product not found with this id'))
      return
    }
    res.status(200).json({ message: 'You updated a product', payload: updateData })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = new ApiError(400, `Not vaild id`)
      next(error)
    } else {
      next(error)
    }
  }
}

// Delete Product
export const deleteProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const deletedProduct = await removeProductById(id)

    res.status(200).json({
      message: `You deleted a product`,
    })
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const error = new ApiError(400, `Not vaild id`)
      next(error)
    } else {
      next(error)
      console.log(error)
    }
  }
}
