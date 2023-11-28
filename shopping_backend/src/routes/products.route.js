const express = require('express')
const router = express.Router()

const { validate, schemas } = require('../app/middleware/validation')

const { verifyAccessToken } = require('../app/middleware/jwtService')

const { uploadProductToCloud } = require('../app/middleware/uploadImages')

const isAdmin = require('../app/middleware/authorization')

const { notFound, errHandler } = require('../app/middleware/errorHandler')

const productsController = require('../app/controllers/ProductsController')

router.put('/ratings', verifyAccessToken, productsController.ratingsProduct)
router.put('/:id', verifyAccessToken, isAdmin, productsController.updateProductById)
router.delete('/:id', verifyAccessToken, isAdmin, productsController.deleteProduct)

router.put('/uploadImage/:id', verifyAccessToken, isAdmin, uploadProductToCloud.array('images', 10), productsController.uploadImageProduct)

router.post('/', verifyAccessToken, isAdmin, validate(schemas.productSchema), productsController.createProduct)

router.post('/', verifyAccessToken, isAdmin, validate(schemas.productSchema), uploadProductToCloud.array('images', 10), productsController.createProductHaveCloudinary)

router.get('/:id', productsController.getProductById)
router.get('/', productsController.getProducts)
router.use(notFound)
router.use(errHandler)

module.exports = router
