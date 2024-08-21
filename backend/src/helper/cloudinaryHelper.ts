import { v2 as cloudinary } from 'cloudinary'
import 'dotenv/config'
import ApiError from '../errors/ApiError'



export const uploadToCloudinary = async (image: string, folderName: string): Promise<string> => {
  const response = await cloudinary.uploader.upload(image, {
    folder: folderName,
  })
  return response.secure_url
}
export const valueWithoutExtension = async (imageUrl: string): Promise<string> => {
  // Split the URL by slashes to get an array of path segments
  const pathSegments = imageUrl.split('/')

  // Get the last segment
  const lastSegment = pathSegments[pathSegments.length - 1]
  // Remove the file extension (.jpg) from the last segment
  // const valueWithoutExtension = lastSegment.replace('.jpg', '')
  const filenameParts = lastSegment.split('.')
  filenameParts.pop()
  const valueWithoutExtension = filenameParts.join('.')
  return valueWithoutExtension
}

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const response = await cloudinary.uploader.destroy(publicId)
    if (response.result !== 'ok') {
      throw ApiError.badRequest('image was not deleted from cloudinary')
    }
    console.log('image was deleted from cloudinary')
  } catch (error) {
    throw error
  }
}
