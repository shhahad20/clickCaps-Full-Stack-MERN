import express from 'express'

import { home } from '../controllers/homeController.js'

const router = express.Router()

router.get('/', home)
console.log("Hi router")

export default router
