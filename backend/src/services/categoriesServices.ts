import slugify from 'slugify'
import { SortOrder } from 'mongoose'

import ApiError from '../errors/ApiError'
import { Category } from '../models/categorySchema'
import { CategoryInterface } from '../types/categoriesInterface'

export const getCategories = async (
  page: number,
  limit: number,
  descOrAsc: number,
  searchedText: string
) => {
  const count = await Category.countDocuments()
  const totalPages = Math.ceil(count / limit)
  let order: SortOrder = descOrAsc === 1 ? 1 : -1

  if (page > totalPages) {
    page = totalPages
  }

  const skip = (page - 1) * limit
  const categories = await Category.find({ title: { $regex: searchedText, $options: 'i' } })
    .skip(skip)
    .limit(limit)
    .sort({ title: order })

  if (categories?.length === 0) {
    throw new ApiError(404, `Category not found`)
  }

  return { categories, totalPages, currentPage: page, count }
}

export const getCategoryById = async (id: string): Promise<CategoryInterface> => {
  const category = await Category.findById({ _id: id })

  if (!category) {
    throw new ApiError(404, `Category not found with this id : ${id}`)
  }

  return category
}

export const createCategory = async (title: string) => {
  const categoryExists = await Category.exists({ title })

  if (categoryExists) {
    throw new ApiError(409, 'The category already exists with this title')
  }

  const newCategory = new Category({
    title,
    slug: slugify(title),
  })

  await newCategory.save()
}

export const updateCategory = async (id: string, title: string, data: any) => {
  const categoryExists = await Category.exists({ title })

  if (categoryExists) {
    throw new ApiError(409, 'The category already exists with this title')
  }

  // const category = await Category.findOneAndUpdate({ _id: id }, data, {
  //   new: true,
  // })
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
  })
  if (!category) {
    throw new ApiError(404, `Category not found with this id: ${id}`)
  }

  return category
}

export const deleteCategoryById = async (id: string) => {
  const category = await Category.findOneAndDelete({ _id: id })

  if (!category) {
    throw new ApiError(404, `Category not found with this id : ${id}`)
  }

  return category
}
