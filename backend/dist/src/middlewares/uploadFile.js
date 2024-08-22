import multer from 'multer';
const userImageStorage = multer.diskStorage({
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
export const upload = multer({ storage: userImageStorage, fileFilter });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/productsImages');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
export const uploadProduct = multer({ storage: storage, fileFilter });
