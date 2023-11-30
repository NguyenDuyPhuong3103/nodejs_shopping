const express = require('express')
const router = express.Router()

const { validate, schemas } = require('../app/middleware/validation')

const { verifyAccessToken } = require('../app/middleware/jwtService')

const isAdmin = require('../app/middleware/authorization')

const { notFound, errHandler } = require('../app/middleware/errorHandler')

const billsController = require('../app/controllers/BillsController')

router.put('/status/:id', verifyAccessToken, isAdmin, billsController.updateStatusBill)
router.post('/', verifyAccessToken, billsController.createBill)
router.get('/admin', verifyAccessToken, isAdmin, billsController.getBills)
router.get('/', verifyAccessToken, billsController.getUserBill)
router.use(notFound)
router.use(errHandler)

module.exports = router