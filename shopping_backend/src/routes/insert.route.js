const express = require('express')
const router = express.Router()

const insertController = require('../app/controllers/InsertController')

router.get('/products', insertController.getProducts)
router.get('/categories', insertController.getCategories)

module.exports = router
