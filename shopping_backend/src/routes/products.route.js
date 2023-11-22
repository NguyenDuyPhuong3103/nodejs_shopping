const express = require('express')
const router = express.Router()

const { validate, schemas } = require('../app/middleware/validation')

const { notFound, errHandler } = require('../app/middleware/errorHandler')

const { verifyAccessToken } = require('../app/middleware/jwtService')

const isAdmin = require('../app/middleware/authorization')

const productsController = require('../app/controllers/ProductsController')

router.get('/', productsController.getProducts)
router.post('/', verifyAccessToken, validate(schemas.productSchema), productsController.createProduct)
router.get('/:id', productsController.getProductById)
router.put('/ratings', verifyAccessToken, productsController.ratingsProduct)
router.put('/:id', verifyAccessToken, isAdmin, productsController.updateProductById)
router.delete('/:id', verifyAccessToken, isAdmin, productsController.deleteProduct)
router.use(notFound)
router.use(errHandler)

module.exports = router
