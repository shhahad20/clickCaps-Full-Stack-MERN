import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import apiErrorHandler from '../src/middlewares/errorHandler.js';
import myLogger from '../src/middlewares/logger.js';
import usersRouter from '../src/routers/usersRouter.js';
import productsRouter from '../src/routers/productsRouter.js';
import ordersRouter from '../src/routers/ordersRouter.js';
import categoriesRouter from '../src/routers/categoriesRouter.js';
import authRouter from '../src/routers/authRouter.js';
import homeRouter from '../src/routers/homeRouter.js';
import { connectDB } from '../src/config/db.js';
config();
const app = express();
const PORT = 5050;
connectDB();
app.use('/public', express.static('public'));
app.use(cookieParser());
app.use(myLogger);
app.use(morgan('dev'));
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', homeRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/orders', ordersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use(apiErrorHandler);
app.listen(PORT, async () => {
    console.log('Server running http://localhost:' + PORT);
});
