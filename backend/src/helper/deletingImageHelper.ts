import fs from 'fs/promises'
let imagePath = "public/images/usersImages/default/usrImage.png"
export const deleteImage = async (imagePath: string) => {
  try {
    if(!imagePath){
      await fs.unlink(imagePath)
    }
  } catch (error) {
    throw error
  }
}
