import express from 'express'

import { handelLogin, handelLogout } from '../controllers/authController'
import { isLoggedOut, isLoggenIn } from '../middlewares/auth'

const router = express.Router()

// router.post('/login', isLoggedOut, handelLogin)
// router.post('/login',isLoggedOut,  handelLogin)
router.post('/login',  handelLogin)
// router.post('/logout', isLoggenIn, handelLogout)
router.post('/logout', handelLogout)


export default router
