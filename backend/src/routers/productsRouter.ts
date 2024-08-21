import { Router } from 'express'

import { upload } from '../middlewares/uploadProductsFile'

import {
  createProduct,
  deleteProductById,
  // deleteProductBySlug,
  getAllProducts,
  getProductById,
  // getProductBySlug,
  updateProductById,
} from '../controllers/productControllers'
import { runValidation } from '../validation/index'
import { createProductValidator, updateProductValidator } from '../validation/productsValidation'
import { isAdmin, isLoggenIn } from '../middlewares/auth'

const router = Router()

router.get('/', getAllProducts)
// router.post(
//   '/',
//   isLoggenIn,
//   isAdmin,
//   upload.single('image'),
//   createProductValidator,
//   runValidation,
//   createProduct
// )
// router.post(
//   '/',
//   upload.single('image'),
//   createProductValidator,
//   runValidation,
//   createProduct
// )
router.post(
  '/',
  upload.single('image'),
  createProduct
)
// router.get('/:slug', getProductBySlug)
router.get('/:id', getProductById)
// router.put(
//   '/:slug',
//   isLoggenIn,
//   isAdmin,
//   updateProductValidator,
//   runValidation,
//   updateProductBySlug
// )
// router.put(
//   '/:slug',
//   updateProductBySlug
// )
router.put(
  '/:id',
  upload.single('image'),
  updateProductById
)
// router.delete('/:slug', isLoggenIn, isAdmin, deleteProductBySlug)
// router.delete('/:slug', deleteProductBySlug)
router.delete('/:id', deleteProductById)

export default router
