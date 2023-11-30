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
            const userCart = await User.findById(_id).select('cart address').populate('cart.product', 'title price')
            if (!userCart) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Bạn chưa bỏ gì trong giỏ hàng!!!!`,
                }))
            } else {
                const products = userCart.cart?.map(el => ({
                    product: el.product._id,
                    productName: el.product.title,
                    productPrice: el.product.price,
                    count: el.quantity,
                    color: el.color,
                    total: el.product.price * el.quantity
                }))
                const total = userCart.cart.reduce((sum, el) => el.product.price * el.quantity + sum, 0)
                const rs = await Bill.create({ products, total, orderBy: _id })

                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: `Tao thanh cong bill`
                }, rs))
            }
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server createBill`,
                error: error,
            }))
        }
    }

    // [PUT] /status/:id
    async updateStatusBill(req, res, next) {
        try {
            const billId = req.params.id
            const { status } = req.body
            if (!status) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Thiếu dữ liệu để xử lý!!!`,
                }))
            }
            const response = await Bill.findByIdAndUpdate(billId, { status }, { new: true })
            if (!response) {
                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: `Không cập nhật được bill!!!`
                }, response))
            }

            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Cập nhật thành công bill!!!`
            }, response))
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server updateStatusBill`,
                error: error,
            }))
        }
    }

    // [GET] /
    async getUserBill(req, res, next) {
        try {
            const { _id } = req.user
            const response = await Bill.find({ orderBy: _id })
            if (!response) {
                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: `Không tìm thấy bill!!!`
                }, response))
            }

            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Đã tìm được bill!!!`
            }, response))
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server getUserBill`,
                error: error,
            }))
        }
    }

    // [GET] /
    async getBills(req, res, next) {
        try {
            const { _id } = req.user
            const response = await Bill.find()
            if (!response) {
                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: `Không tìm thấy bill!!!`
                }, response))
            }

            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Đã tìm được bill!!!`
            }, response))
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server getUserBill`,
                error: error,
            }))
        }
    }

}

module.exports = new BillsController