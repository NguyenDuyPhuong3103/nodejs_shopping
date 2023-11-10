const express = require('express')
const router = express.Router()
const { notFound, errHandler } = require('../app/middleware/errorHandler')

const insertController = require('../app/controllers/InsertController')

router.get('/products', insertController.getProducts)
router.get('/categories', insertController.getCategories)
router.use(notFound)
router.use(errHandler)

module.exports = router
