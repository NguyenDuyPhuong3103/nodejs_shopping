const express = require('express');
const baseRouter = express.Router();
const productsRouter = require('./products.route');
const categoriesRouter = require('./categories.route');
const shopsRouter = require('./shops.route');
const userRouter = require('./user.route');
const siteRouter = require('./site.route');
const imagesRouter = require('./images.route');


baseRouter.use('/products', productsRouter);
baseRouter.use('/categories', categoriesRouter);
baseRouter.use('/shops', shopsRouter);
baseRouter.use('/user', userRouter);
baseRouter.use('/images', imagesRouter);
baseRouter.use('/', siteRouter);

module.exports = baseRouter;
