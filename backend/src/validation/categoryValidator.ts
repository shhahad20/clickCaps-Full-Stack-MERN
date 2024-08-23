import { check } from 'express-validator'

export const categoryValidation = [
  check('title')
    .trim()
    .notEmpty()
    .withMessage('Category title is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category title should be at least 2-50 characters long'),
]
 