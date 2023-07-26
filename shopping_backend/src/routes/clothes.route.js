const express = require('express');
const router = express.Router();

const clothesController = require('../app/controllers/ClothesController');

router.get('/:slug', clothesController.show);
router.get('/', clothesController.index);

module.exports = router;
