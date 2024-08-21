"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadProductsFile_1 = require("../middlewares/uploadProductsFile");
const productControllers_1 = require("../controllers/productControllers");
const router = (0, express_1.Router)();
router.get('/', productControllers_1.getAllProducts);
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
router.post('/', uploadProductsFile_1.upload.single('image'), productControllers_1.createProduct);
// router.get('/:slug', getProductBySlug)
router.get('/:id', productControllers_1.getProductById);
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
router.put('/:id', uploadProductsFile_1.upload.single('image'), productControllers_1.updateProductById);
// router.delete('/:slug', isLoggenIn, isAdmin, deleteProductBySlug)
// router.delete('/:slug', deleteProductBySlug)
router.delete('/:id', productControllers_1.deleteProductById);
exports.default = router;
