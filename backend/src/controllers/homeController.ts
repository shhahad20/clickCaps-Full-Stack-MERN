import { NextFunction, Request, Response } from 'express'
import ApiError from '../errors/ApiError.js'

export const home = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      message: `Hello there`,
    })
  } catch (error) {
    next(ApiError.internal('Something went bad.'))
  }
}
