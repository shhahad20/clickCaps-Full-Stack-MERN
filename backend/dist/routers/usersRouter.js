"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const userVaildation_1 = require("../validation/userVaildation");
const index_1 = require("../validation/index");
const uploadFile_1 = require("../middlewares/uploadFile");
const router = express_1.default.Router();
// router.get('/', isLoggenIn, isAdmin, getAllUsers)
router.get('/', userControllers_1.getAllUsers);
// router.get('/:userId', isLoggenIn,isAdmin, getSingleUser)
router.get('/:userId', userControllers_1.getSingleUser);
// router.delete('/:userId', isLoggenIn, isAdmin, deleteUserById)
router.delete('/:userId', userControllers_1.deleteUserById);
// router.post(
//   '/registering',
//   isLoggedOut,
//   creatUserValidator,
//   runValidationUser,
//   upload.single('image'),
//   registerUser
// )
router.post('/registering', userVaildation_1.creatUserValidator, index_1.runValidationUser, uploadFile_1.upload.single('image'), userControllers_1.registerUser);
router.post('/activate', userControllers_1.activateUser);
// router.put('/ban/:userId', isLoggenIn, isAdmin, banUser)
router.put('/ban/:userId', userControllers_1.banUser);
// router.put('/unban/:userId', isLoggenIn, isAdmin, unbanUser)
router.put('/unban/:userId', userControllers_1.unbanUser);
router.put('/adminrole/:userId', userControllers_1.adminUser);
router.put('/unadminrole/:userId', userControllers_1.unadminUser);
// router.put(
//   '/:userId',
//   isLoggenIn,
//   isAdmin,
//   updateUserValidator,
//   runValidationUser,
//   upload.single('image'),
//   updateUser
// )
router.put('/:userId', uploadFile_1.upload.single('image'), userControllers_1.updateUser);
// router.post('/forget-password', isLoggedOut, forgetPasswordValidator, runValidation, forgetPassword)
router.post('/forget-password', userControllers_1.forgetPassword);
router.post('/reset-password', userControllers_1.resetPassword);
exports.default = router;
