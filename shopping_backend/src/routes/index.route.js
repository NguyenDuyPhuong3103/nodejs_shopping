const express = require('express');
const baseRouter = express.Router();
const newsRouter = require('./news.route');
const productsRouter = require('./products.route');
const userRouter = require('./user.route');
const siteRouter = require('./site.route');

baseRouter.use('/news', newsRouter);
baseRouter.use('/products', productsRouter);
baseRouter.use('/user', userRouter);
baseRouter.use('/', siteRouter);

module.exports = baseRouter;
