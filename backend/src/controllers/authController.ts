import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt, { TokenExpiredError } from 'jsonwebtoken'

import User from '../models/userSchema'
import ApiError from '../errors/ApiError'
import generateToken from '../util/gernerateToken'


export const handelLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const ignoreOptions = {
      password: 0,
      __v: 0,
      updatedAt: 0,
      // isAdmin: 0,
    }
    const user = await User.findOne({ email: email })
    if (!user) {
      throw ApiError.notFound(`User not found with this email ${email}`)
    }
    const isPasswordMatch = bcrypt.compareSync(password, user.password)
    if (!isPasswordMatch) {
      throw ApiError.unauthorized('Wrong password')
    }
    if (user.isBanned) {
      const error = new ApiError(403, `User is banned. For more info contact us.`)
      throw error
    }
    const userId = user._id
    const accessToken = jwt.sign({ _id: user._id }, ACCESS_KEY, { expiresIn: '1h' })
    // const accessToken = generateToken(userId)
    res.cookie('access_token', accessToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
      // secure: true
      secure: process.env.NODE_ENV === 'production',
    })
    const userDataToDisplay = await User.findById(userId, ignoreOptions)
    res.status(200).json({
      status: 200,
      message: `User is logged in`,
      payload: userDataToDisplay,
      // accessToken: accessToken,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const handelLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('access_token', { sameSite: 'none' })
    res.status(200).json({
      message: `User is logged out`,
    })
  } catch (error) {
    next(error)
  }
}
