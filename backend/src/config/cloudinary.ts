import { v2 as cloudinary } from 'cloudinary'
import 'dotenv/config'

const cloudinaryProccess = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_NAME_API_SECERET_KEY,
})

export default cloudinaryProccess
