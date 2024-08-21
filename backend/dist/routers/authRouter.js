"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// router.post('/login', isLoggedOut, handelLogin)
// router.post('/login',isLoggedOut,  handelLogin)
router.post('/login', authController_1.handelLogin);
// router.post('/logout', isLoggenIn, handelLogout)
router.post('/logout', authController_1.handelLogout);
exports.default = router;
