const express = require('express');
const router = express.Router();

const {validate, schemas} = require('../app/middleware/validation');

const productsController = require('../app/controllers/ProductsController');

router.post('/',validate(schemas.productSchema), productsController.createProduct);
router.put('/:id',validate(schemas.productSchema), productsController.updateProductById);
router.delete('/:id', productsController.deleteProduct);
router.get('/:id', productsController.getProductById);
router.get('/', productsController.getProducts);

module.exports = router;
