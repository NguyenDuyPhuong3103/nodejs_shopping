const express = require('express')
const router = express.Router()

const { validate, schemas } = require('../app/middleware/validation')

const { verifyAccessToken } = require('../app/middleware/jwtService')

const isAdmin = require('../app/middleware/authorization')

const { notFound, errHandler } = require('../app/middleware/errorHandler')

const billsController = require('../app/controllers/BillsController')

// router.put('/:id', verifyAccessToken, isAdmin, validate(schemas.billSchema), billsController.updateBillById)
// router.delete('/:id', verifyAccessToken, isAdmin, billsController.deleteBill)
// router.post('/', verifyAccessToken, validate(schemas.billSchema), billsController.createBill)
router.post('/', verifyAccessToken, billsController.createBill)
// router.get('/:id', billsController.getBillById)
// router.get('/', billsController.getBills)
router.use(notFound)
router.use(errHandler)

module.exports = router