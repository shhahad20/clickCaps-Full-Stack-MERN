"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProduct = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const userImageStorage = multer_1.default.diskStorage({
    // destination: function (req, file, cb) {
    //   cb(null, 'public/images/usersImages')
    // },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
// const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
//   if (!allowedTypes.includes(file.mimetype)) {
//     return cb(new Error('Only images with type (jpeg, png, jpg) are allowed'))
//   }
// }
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only images with type (jpeg, png, jpg) are allowed'));
    }
    else {
        cb(null, true);
    }
};
exports.upload = (0, multer_1.default)({ storage: userImageStorage, fileFilter });
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/productsImages');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
exports.uploadProduct = (0, multer_1.default)({ storage: storage, fileFilter });
