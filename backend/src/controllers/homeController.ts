import { NextFunction, Request, Response } from 'express'
import ApiError from '../errors/ApiError.js'

export const home = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Hi ctrl")
  try {
    console.log("Hi")
    res.status(200).json({
      message: `Hello there`,
    })
  } catch (error) {
    console.log("I'm error from ctrl")
    next(ApiError.internal('Something went bad.'))
  }
}
