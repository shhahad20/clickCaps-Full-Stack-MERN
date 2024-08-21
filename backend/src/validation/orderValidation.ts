import { check } from 'express-validator'

export const orderValidation = [
  check('user')
    .trim()
    .notEmpty()
    .withMessage('User ID is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('User ID should be at least 3-50 characters long'),
  check('orderItems').notEmpty().withMessage('Order Items are required'),
  check('totalAmount').notEmpty().withMessage('total Amount is required'),
  check('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Status should be at least 3-50 characters long'),
  
]
