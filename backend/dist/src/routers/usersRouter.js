import express from 'express';
import { activateUser, deleteUserById, getAllUsers, getSingleUser, registerUser, updateUser, banUser, unbanUser, forgetPassword, resetPassword, adminUser, unadminUser, } from '../controllers/userControllers.js';
import { creatUserValidator, } from '../validation/userVaildation.js';
import { runValidationUser } from '../validation/index.js';
import { upload } from '../middlewares/uploadFile.js';
const router = express.Router();
// router.get('/', isLoggenIn, isAdmin, getAllUsers)
router.get('/', getAllUsers);
// router.get('/:userId', isLoggenIn,isAdmin, getSingleUser)
router.get('/:userId', getSingleUser);
// router.delete('/:userId', isLoggenIn, isAdmin, deleteUserById)
router.delete('/:userId', deleteUserById);
// router.post(
//   '/registering',
//   isLoggedOut,
//   creatUserValidator,
//   runValidationUser,
//   upload.single('image'),
//   registerUser
// )
router.post('/registering', creatUserValidator, runValidationUser, upload.single('image'), registerUser);
router.post('/activate', activateUser);
// router.put('/ban/:userId', isLoggenIn, isAdmin, banUser)
router.put('/ban/:userId', banUser);
// router.put('/unban/:userId', isLoggenIn, isAdmin, unbanUser)
router.put('/unban/:userId', unbanUser);
router.put('/adminrole/:userId', adminUser);
router.put('/unadminrole/:userId', unadminUser);
// router.put(
//   '/:userId',
//   isLoggenIn,
//   isAdmin,
//   updateUserValidator,
//   runValidationUser,
//   upload.single('image'),
//   updateUser
// )
router.put('/:userId', upload.single('image'), updateUser);
// router.post('/forget-password', isLoggedOut, forgetPasswordValidator, runValidation, forgetPassword)
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);
export default router;
