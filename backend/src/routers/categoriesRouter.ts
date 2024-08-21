import { Router } from 'express'

import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateSingleCategory,
} from '../controllers/categoriesControllers'
import { categoryValidation } from '../validation/categoryValidator'
import { runValidation } from '../validation/index'
import { isAdmin, isLoggenIn } from '../middlewares/auth'

const categoriesRouter = Router()

categoriesRouter.get('/', getAllCategories)

categoriesRouter.get('/:id', getSingleCategory)

// categoriesRouter.post('/', isLoggenIn, isAdmin, categoryValidation, runValidation, addCategory)
categoriesRouter.post('/', addCategory)

// categoriesRouter.put(
//   '/:id',
//   isLoggenIn,
//   isAdmin,
//   categoryValidation,
//   runValidation,
//   updateSingleCategory
// )
categoriesRouter.put(
  '/:id',
  updateSingleCategory
)
// categoriesRouter.delete('/:id', isLoggenIn, isAdmin, deleteCategory)
categoriesRouter.delete('/:id', deleteCategory)

export default categoriesRouter
