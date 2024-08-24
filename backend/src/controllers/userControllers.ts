import mongoose from 'mongoose'
import { NextFunction, Request, Response } from 'express'
import jwt, { TokenExpiredError, JwtPayload } from 'jsonwebtoken'
// import * as jwt from 'jsonwebtoken'

import bcrypt from 'bcrypt'
import { dev } from '../config/index.js'

import User from '../models/userSchema.js'
import ApiError from '../errors/ApiError.js'
import { emailSender } from '../helper/sendEmail.js'
import {
  findUserAndDelete,
  findUserById,
  getUsers,
  isExist,
  updateBanStatusById,
  updateRoleStatusById,
} from '../services/userServices.js'
import generateToken from '../util/gernerateToken.js'
import { forgetPasswordEmail, registeringEmail } from '../helper/emails.js'
import {
  deleteFromCloudinary,
  uploadToCloudinary,
  valueWithoutExtension,
} from '../helper/cloudinaryHelper.js'

const DEFAULT_IMAGES_PATH = 'public/images/usersImages/default/usrImage.png'

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 5
    let search = req.query.search as string

    const { users, totalPages, currentPage, countUsers } = await getUsers(page, limit, search)
    if (users?.length === 0) {
      next(ApiError.notFound('Users not found'))
      return
    }
    res.status(200).json({
      message: 'all users are here',
      payload: {
        users,
        pagination: {
          totalUsers: countUsers,
          totalPages,
          currentPage: page,
        },
      },
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = new ApiError(400, `Not vaild id`)
      next(error)
    } else {
      next(error)
    }
  }
}

export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.userId
    const user = await findUserById(id)
    res.status(200).json({ message: 'Get user by id', payload: user })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = new ApiError(400, `Not vaild id`)
      next(error)
    } else {
      next(error)
    }
  }
}
export const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.userId
    const deletedUser = await findUserAndDelete(id)

    res.status(200).json({
      message: `You deleted a user`,
    })
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const error = new ApiError(400, `Not vaild id`)
      next(error)
    } else {
      next(error)
    }
  }
}

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { first_name, last_name, email, password, address, phone, age, gender, order } = req.body
    const imagePath = req.file?.path

    const userExist = await isExist(email)
    const hashPassword = bcrypt.hashSync(password, 10)

    const tokenPayload = new User({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashPassword,
      gender: gender,
      age: age,
      address: address,
      phone: phone,
      image: DEFAULT_IMAGES_PATH,
      order: order,
    })
    if (imagePath) {
      tokenPayload.image = imagePath
    }
    const tokenPayloadObject = tokenPayload.toObject()
    const token = generateToken(tokenPayloadObject, dev.jwt.reset_k, '60m')
    const emailToSend = registeringEmail(email, first_name, last_name, token)
    await emailSender(emailToSend)

    res.status(200).json({
      message: 'Please check your email to activate your account',
      token: token,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.userId
    let image = req.file && req.file.path
    const updatedUser = req.body
    const newPassword = req.body.password
    if (newPassword) {
      updatedUser.password = bcrypt.hashSync(newPassword, 10)
    }
    const userImageToDelete = await findUserById(id)
    const updateData = await User.findByIdAndUpdate(id, updatedUser, {
      new: true,
    })
    if (image) {
      if (userImageToDelete && userImageToDelete.image) {
        const publicId = await valueWithoutExtension(userImageToDelete.image)
        await deleteFromCloudinary(`Full-Stack-Project/Users/${publicId}`)
      }
      const cloudinaryUrl = await uploadToCloudinary(image, 'Full-Stack-Project/Products')
      image = cloudinaryUrl
    }
    if (!updateData) {
      next(ApiError.notFound('User not found'))
      return
    }
    res.status(200).json({
      message: `You updated a user`,
      payload: updateData,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = new ApiError(400, `Not vaild id`)
      next(error)
    } else {
      next(error)
    }
  }
}
export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const {token}  = req.body
    const token = req.params.token
    console.log(token)
      if (!token) {
      next(ApiError.notFound('Please provide a valid token'))
      return
    }
    console.log('p 1')
    const decodedUserData = jwt.verify(token, dev.jwt.activate_k) as JwtPayload
    if (!decodedUserData) {
      next(ApiError.unauthorized('Invaild token'))
      return
    }
    const cloudinaryUrl = await uploadToCloudinary(
      decodedUserData.image,
      'Full-Stack-Project/Users'
    )

    console.log('p 4')
    decodedUserData.image = cloudinaryUrl
    await User.create(decodedUserData)
    console.log('p 5')

    res.status(200).json({
      message: 'User account activated successfully',
    })
  } catch (error) {
    console.log('Error in activateUser:', error)
    next(error)
  }
}
// export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const {token}  = req.body
//     if (!token) {
//       next(ApiError.notFound('Plesae provide a vaild token'))
//       return
//     }
//     const decodedUserData = jwt.verify(token, dev.jwt.activate_k) as jwt.JwtPayload
//     if (!decodedUserData) {
//       next(ApiError.unauthorized('Invaild token'))
//       return
//     }
//     const cloudinaryUrl = await uploadToCloudinary(
//       decodedUserData.image,
//       'Full-Stack-Project/Users'
//     )
//     decodedUserData.image = cloudinaryUrl
//     await User.create(decodedUserData)

//     res.status(201).json({
//       message: 'User is registered successfully',
//     })
//   } catch (error) {
//     if (error instanceof jwt.TokenExpiredError) {
//       next(ApiError.unauthorized('Token has expired'))
//     } else {
//       next(error)
//     }
//   }
// }

export const banUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.userId
    const user = await updateBanStatusById(id, true)
    res.status(200).json({
      message: `You banned a user with ID: ${id}`,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = new ApiError(400, `Not vaild id`)
      next(error)
    } else {
      next(error)
    }
  }
}
export const unbanUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.userId
    const user = await updateBanStatusById(id, false)
    res.status(200).json({
      message: `You unbanned a user with ID: ${id}`,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = new ApiError(400, `Not vaild id`)
      next(error)
    } else {
      next(error)
    }
  }
}

export const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body.email
    const user = await User.findOne({ email: email })
    if (!user) {
      next(ApiError.notFound(`${email} not exisits`))
      return
    }
    const token = generateToken({ email }, dev.jwt.reset_k, '60m')
    const emailToSend = forgetPasswordEmail(email, user.first_name, user.last_name, token)
    await emailSender(emailToSend)

    res.status(200).json({
      message: `The email sent successfully, check your email `,
      payload: token,
    })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password, confirmPassword, email } = req.body
    if (!token) {
      next(ApiError.notFound('Plesae provide a vaild token'))
      return
    }
    if (password !== confirmPassword) {
      throw ApiError.unauthorized('Passwords does not match')
    }
    const decoded = jwt.verify(token, dev.jwt.reset_k) as jwt.JwtPayload
    if (!decoded) {
      next(ApiError.unauthorized('Invaild token'))
      return
    }
    const updatedPassword = await User.findOneAndUpdate(
      { email: decoded.email },
      { $set: { password: bcrypt.hashSync(password, 10) } }
    )
    if (!updatedPassword) {
      throw ApiError.badRequest('Unsuccesssful password reset')
    }

    res.status(201).json({
      status: 200,
      message: 'Password is resteted successfully',
    })
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(ApiError.unauthorized('Token has expired'))
    } else {
      next(error)
    }
  }
}

export const adminUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.userId
    const user = await updateRoleStatusById(id, true)
    res.status(200).json({
      message: `You make the role of user with ID: ${id} is Admin`,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = new ApiError(400, `Not vaild id`)
      next(error)
    } else {
      next(error)
    }
  }
}
export const unadminUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.userId
    const user = await updateRoleStatusById(id, false)
    res.status(200).json({
      message: `You make the role of user with ID: ${id} is not Admin`,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = new ApiError(400, `Not vaild id`)
      next(error)
    } else {
      next(error)
    }
  }
}
