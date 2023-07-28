const express = require('express');
const router = express.Router();

const clothesController = require('../app/controllers/ClothesController');

router.get('/create', clothesController.create);
router.post('/store', clothesController.store);
router.get('/:_id', clothesController.details);
router.get('/', clothesController.index);

module.exports = router;
