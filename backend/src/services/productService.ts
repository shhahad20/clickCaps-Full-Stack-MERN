import ApiError from '../errors/ApiError'
import { deleteFromCloudinary, valueWithoutExtension } from '../helper/cloudinaryHelper'
import { deleteImage } from '../helper/deletingImageHelper'
import { Category } from '../models/categorySchema'
import Product from '../models/productSchema'
import { ProductInterface } from '../types/productTypes'

export const getProducts = async (
  page = 1,
  limit = 2,
  sortOrder: 'asc' | 'desc' = 'desc',
  categorySlug?: string,
  search?: string
) => {
  // filtering
  let filterProducts = Product.find()
  if (categorySlug) {
    const category = await Category.findOne({ slug: categorySlug })
    if (category) {
      filterProducts = filterProducts.where({ category: category._id })
    } else {
      return { 
        products: [],
        totalPages: 0,
        currentPage: 1,
      }
    }
  }

  // search by product name
  if (search) {
    filterProducts = filterProducts.where({ name: { $regex: search, $options: 'i' } })
  }

  // pagination
  const count = await Product.countDocuments()
  const totalPages = Math.ceil(count / limit)

  if (page > totalPages) {
    page = totalPages
  }
  const skip = (page - 1) * limit
  //sort
  let sortDirection: { [key: string]: 'asc' | 'desc' } = {}
  if (sortOrder === 'asc') {
    sortDirection = { price: 'asc' }
  } else {
    sortDirection = { price: 'desc' }
  }
  const products: ProductInterface[] = await Product.find(filterProducts)
    .populate('category')
    .skip(skip)
    .limit(limit)
    .sort(sortDirection)
  return {
    products,
    count,
    totalPages,
    currentPage: page,
  }
}

export const findProductById = async (id: string): Promise<ProductInterface> => {
  try {
    const product = await Product.findById({ _id: id })
    if (!product) {
      const error = new ApiError(404, 'Product not found with this slug')
      throw error
    }
    return product
  } catch (error) {
    throw error
  }
}
export const removeProductById = async (id: string) => {
  // const product = await Product.findByIdAndDelete({ _id: id })
  // if (!product) {
  //   const error = new ApiError(404, 'Product not found with this slug')
  //   throw error
  // }
  // return product
  try {
    const productToDelete = await Product.findById(id)
    if (!productToDelete) {
      const error = new ApiError(404, `User not found with this id ${id}`)
      throw error
    }
    if (productToDelete && productToDelete.image) {
      const publicId = await valueWithoutExtension(productToDelete.image)
      await deleteFromCloudinary(`Full-Stack-Project/Products/${publicId}`)
      // await deleteImage(productToDelete.image)
    }
    const deletedProduct = await Product.findByIdAndDelete(id)
    return deletedProduct
  } catch (error) {
    throw error
  }
}
