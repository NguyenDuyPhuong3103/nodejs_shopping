const express = require('express');
const router = express.Router();

const productsController = require('../app/controllers/ProductsController');

router.get('/AllPostedProducts', productsController.getAllProducts);
router.put('/:id', productsController.editProductById);
router.delete('/:id', productsController.deleteProduct);
router.get('/:id', productsController.getProductById);
router.post('/', productsController.createProduct);
router.get('/', productsController.getAllsProducts);

module.exports = router;
