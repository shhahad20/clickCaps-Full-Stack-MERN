import express from 'express';
import { handelLogin, handelLogout } from '../controllers/authController.js';
const router = express.Router();
// router.post('/login', isLoggedOut, handelLogin)
// router.post('/login',isLoggedOut,  handelLogin)
router.post('/login', handelLogin);
// router.post('/logout', isLoggenIn, handelLogout)
router.post('/logout', handelLogout);
export default router;