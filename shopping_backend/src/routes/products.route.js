const express = require('express');
const router = express.Router();

const {validate, schemas} = require('../app/middleware/validation');

const productsController = require('../app/controllers/ProductsController');

router.post('/',validate(schemas.productSchema), productsController.createProduct);
router.put('/:id',validate(schemas.productSchema), productsController.editProductById);
router.delete('/:id', productsController.deleteProduct);
router.get('/:id', productsController.getProductById);
router.get('/', productsController.getAllProducts);

module.exports = router;
