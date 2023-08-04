const express = require('express');
const router = express.Router();

const productsController = require('../app/controllers/ProductsController');

router.get('/AllPostedProducts', productsController.getAllProducts);
router.put('/:id', productsController.editProductById);
router.get('/:id', productsController.getProductById);
router.post('/', productsController.createProduct);
// router.delete('/', productsController.createCloth);
router.get('/', productsController.getAllProducts);

module.exports = router;
