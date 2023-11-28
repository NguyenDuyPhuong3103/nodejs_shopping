const express = require('express')
const router = express.Router()

const { validate, schemas } = require('../app/middleware/validation')

const { verifyAccessToken } = require('../app/middleware/jwtService')

const isAdmin = require('../app/middleware/authorization')

const { notFound, errHandler } = require('../app/middleware/errorHandler')

const { uploadShopToCloud } = require('../app/middleware/uploadImages')

const shopsController = require('../app/controllers/ShopsController')

router.put('/likes/:shopId', verifyAccessToken, shopsController.likesShop)
router.put('/dislikes/:shopId', verifyAccessToken, shopsController.dislikesShop)
router.put('/:id', verifyAccessToken, isAdmin, uploadShopToCloud.single('avatar'), validate(schemas.shopSchema), shopsController.updateShopById)
router.post('/', verifyAccessToken, uploadShopToCloud.single('avatar'), validate(schemas.shopSchema), shopsController.createShop)
router.delete('/:id', verifyAccessToken, isAdmin, shopsController.deleteShop)
router.get('/:id', shopsController.getShopById)
router.get('/', shopsController.getShops)

router.use(notFound)
router.use(errHandler)

module.exports = router
