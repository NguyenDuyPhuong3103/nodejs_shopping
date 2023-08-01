const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');

router.get('/posted/products', userController.postedproducts);

module.exports = router;
