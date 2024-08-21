import { check } from 'express-validator'

export const createProductValidator = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Product Name is missing')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product Name should be between 3 and 200 characters length'),

  check('price')
    .trim()
    .notEmpty()
    .withMessage('Product price is required')
    .isFloat({ min: 1 })
    .withMessage('Product price must be a positive number'),

  check('category')
    .notEmpty()
    .withMessage('Product category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),

  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 3, max: 500 })
    .withMessage('Product description should be between 3 and 500 characters length'),

  check('quantity')
    .notEmpty()
    .withMessage('Product qantity is required!')
    .isInt({ min: 0 })
    .withMessage('Product qantity must be a non-negative integer'),
]

export const updateProductValidator = [
  check('name')
    .optional({ nullable: true })
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name should be between 3 and 200 characters length'),

  check('price')
    .optional({ nullable: true })
    .isFloat({ min: 1 })
    .withMessage('Product price must be a positive number'),

  check('category').optional({ nullable: true }).isMongoId().withMessage('Invalid category ID'),

  check('description')
    .optional({ nullable: true })
    .isLength({ min: 3, max: 500 })
    .withMessage('Product description should be between 3 and 500 characters length'),

  check('quantity')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
]
