const express = require('express');
const router = express.Router();

const {validate, schemas} = require('../app/middleware/validation');

const shopsController = require('../app/controllers/ShopsController');

router.post('/',validate(schemas.shopSchema), shopsController.createShop);
//put, delete cần có user mà user đã tạo ra product đó cấp quyền
router.put('/:id',validate(schemas.shopSchema), shopsController.editShopById);
router.delete('/:id', shopsController.deleteShop);
router.get('/:id', shopsController.getShopById);
router.get('/', shopsController.getAllShops);

module.exports = router;
