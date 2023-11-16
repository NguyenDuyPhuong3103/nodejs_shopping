const express = require('express')
const router = express.Router()

const { validate, schemas } = require('../app/middleware/validation')

const { notFound, errHandler } = require('../app/middleware/errorHandler')

const productsController = require('../app/controllers/ProductsController')

// (1)trước khi createProduct thì nên kiểm tra xem đã có accessToken chưa (verifyAccessToken) nếu có mới được tạo.

router.post('/',/* (1) verifyAccessToken */ validate(schemas.productSchema), productsController.createProduct)
router.put('/:id', validate(schemas.productSchema), productsController.updateProductById)
router.delete('/:id', productsController.deleteProduct)
router.get('/:id', productsController.getProductById)
router.get('/', productsController.getProducts)
router.use(notFound)
router.use(errHandler)

module.exports = router
