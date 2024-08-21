import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { config } from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import 'dotenv/config'

import apiErrorHandler from '../src/middlewares/errorHandler'
import myLogger from '../src/middlewares/logger'
import usersRouter from '../src/routers/usersRouter'
import productsRouter from '../src/routers/productsRouter'
import ordersRouter from '../src/routers/ordersRouter'
import categoriesRouter from '../src/routers/categoriesRouter'
import authRouter from '../src/routers/authRouter'
import homeRouter from '../src/routers/homeRouter'
import { connectDB } from '../src/config/db'

config()
const app = express()
const PORT = 5050

connectDB();

app.use('/public',express.static('public'))

app.use(cookieParser())
app.use(myLogger)
app.use(morgan('dev'))
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', homeRouter)
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)

app.use(apiErrorHandler)

app.listen(PORT, async () => {
  console.log('Server running http://localhost:' + PORT)
})
