const express = require('express')
const router = express.Router()
const uploadCloud = require('../app/middleware/uploadImages')

const imagesController = require('../app/controllers/ImagesController')

// router.post('/upload', uploadCloud.fields([{ name: "image", maxCount: 1 }]), imagesController.uploadImages)
router.delete('/remove/:publicId', imagesController.removeImages)

module.exports = router
