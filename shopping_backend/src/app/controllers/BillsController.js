const Bill = require('../models/Bills.model')
const Shop = require('../models/Shops.model')
const User = require('../models/Users.model')
const Product = require('../models/Products.model')
const responseFormat = require('../../utils/responseFormat.js')
const { StatusCodes } = require('http-status-codes')

class BillsController {

    // [POST] /
    async createBill(req, res, next) {
        try {
            const { _id } = req.user
            const userCart = await User.findById(_id).select('cart')
            if (!userCart) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Co loi xay ra!!!!`,
                }))
            }

            // const bill = await Bill.create(req.body)
            // if (!bill) {
            //     return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
            //         message: `Khong tao duoc bill`,
            //     }))
            // }

            // const updateShop = await Shop.findByIdAndUpdate(bill.shop, {
            //     $addToSet: {
            //         categories: bill._id
            //     }
            // })

            // if (!updateShop) {
            //     return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
            //         message: `Khong cap nhat duoc shop`,
            //     }))
            // }

            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Tao thanh cong bill`
            }, userCart))
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server createBill`,
                error: error,
            }))
        }
    }

}

module.exports = new BillsController