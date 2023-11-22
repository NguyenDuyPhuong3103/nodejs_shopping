const express = require('express')
const router = express.Router()

const { validate, schemas } = require('../app/middleware/validation')

const { verifyAccessToken } = require('../app/middleware/jwtService')

const isAdmin = require('../app/middleware/authorization')

const { notFound, errHandler } = require('../app/middleware/errorHandler')

const categoriesController = require('../app/controllers/CategoriesController')

router.get('/', categoriesController.getCategories)
router.get('/:id', categoriesController.getCategoryById)
router.post('/', verifyAccessToken, isAdmin, validate(schemas.categorySchema), categoriesController.createCategory)
router.put('/:id', verifyAccessToken, isAdmin, validate(schemas.categorySchema), categoriesController.updateCategoryById)
router.delete('/:id', verifyAccessToken, isAdmin, categoriesController.deleteCategory)
router.use(notFound)
router.use(errHandler)

module.exports = router
