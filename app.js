import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
// import xss from 'xss-clean'; // package not supported
import hpp from 'hpp';
// const cors = require('cors');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');

import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import paymentsRouter from './routes/paymentroutes.js';
// const AppError = require('./utils/appError');
// const globalErrorHandler = require('./controllers/errorController');
// const productRouter = require('./routes/productRoutes');
// const userRouter = require('./routes/userRoutes');
// const paymentsRouter = require('./routes/paymentroutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Cors middleware
app.use(cors());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '30kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['price', 'priceDiscount', 'size', 'category', 'stock', 'brand'],
  })
);

// Serving static files
// app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/pago', paymentsRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// module.exports = app;
export default app;
