const express = require('express')
const router = express.Router()

const { validate, schemas } = require('../app/middleware/validation')

const { verifyAccessToken } = require('../app/middleware/jwtService')

const { uploadShopToCloud } = require('../app/middleware/uploadImages')

const shopsController = require('../app/controllers/ShopsController')

router.post('/', uploadShopToCloud.single('avatar'), validate(schemas.shopSchema), shopsController.createShop)
//put, delete cần có user mà user đã tạo ra product đó cấp quyền
// router.put('/:id', verifyAccessToken, uploadShopToCloud.single('avatar'), validate(schemas.shopSchema), shopsController.updateShopById)
router.put('/:id', uploadShopToCloud.single('avatar'), validate(schemas.shopSchema), shopsController.updateShopById)
router.delete('/:id', shopsController.deleteShop)
router.get('/:id', shopsController.getShopById)
router.get('/', shopsController.getAllShops)

module.exports = router
