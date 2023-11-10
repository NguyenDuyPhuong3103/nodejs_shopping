const express = require('express')
const router = express.Router()
const uploadCloud = require('../app/middleware/uploadImages')
const { notFound, errHandler } = require('../app/middleware/errorHandler')

const imagesController = require('../app/controllers/ImagesController')

// router.post('/upload', uploadCloud.fields([{ name: "image", maxCount: 1 }]), imagesController.uploadImages)
router.delete('/', imagesController.removeImages)
router.use(notFound)
router.use(errHandler)

module.exports = router
