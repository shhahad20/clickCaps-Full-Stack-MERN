import { check } from 'express-validator'

export const categoryValidation = [
  check('title')
    .trim()
    .notEmpty()
    .withMessage('Category title is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Category title should be at least 3-50 characters long'),
]
