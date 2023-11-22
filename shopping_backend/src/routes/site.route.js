const express = require('express')
const router = express.Router()
const { notFound, errHandler } = require('../app/middleware/errorHandler')

const siteController = require('../app/controllers/SiteController')

router.get('/', siteController.index)
router.get('/search', siteController.search)
router.use(notFound)
router.use(errHandler)

module.exports = router
