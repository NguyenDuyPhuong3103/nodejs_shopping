const express = require('express')
const router = express.Router()

const { validate, schemas } = require('../app/middleware/validation')

const { notFound, errHandler } = require('../app/middleware/errorHandler')

const categoriesController = require('../app/controllers/CategoriesController')

router.post('/', validate(schemas.categorySchema), categoriesController.createCategory)
router.put('/:id', validate(schemas.categorySchema), categoriesController.editCategoryById)
router.delete('/:id', categoriesController.deleteCategory)
router.get('/:id', categoriesController.getCategoryById)
router.get('/', categoriesController.getAllCategories)
router.use(notFound)
router.use(errHandler)

module.exports = router
