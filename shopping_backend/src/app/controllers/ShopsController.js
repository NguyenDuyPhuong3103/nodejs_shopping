const User = require('../models/Users.model')
const Shop = require('../models/Shops.model')
const responseFormat = require('../../util/responseFormat.js')
const {StatusCodes} = require('http-status-codes')

class ShopsController {

    //[GET] /shops
    // getAllShops(req, res, next){
    //     Shop.find({})
    //         .then(shops => res.json(shops))
    //         .catch(next)
    // }

    async getAllShops(req, res, next){
        try {
            const shops = await Shop.find({})
                .populate("products")
                .populate("categories")
                .populate("user")
            if (!shops || shops.length === 0 ) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong tim thay shops`,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Tim thay shops`
            },shops))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server getAllShops`,
                error: error, 
            }))
        }
    }

    //[GET] /shops/:id
    // getShopById(req, res, next) {
    //     Shop.findOne({ _id: req.params.id})
    //         .then(shop => res.json(shop))
    //         .catch(next)   
    // }

    async getShopById(req, res, next){
        try {
            const shop = await Shop.findById(req.params.id)
                .populate("products")
                .populate("categories")
                .populate("user")
            if (!shop) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong tim thay shop`,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Tim thay shop`
            },shop))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server getShopById`,
                error: error, 
            }))
        }
    }

    // [POST] /shops
    // createShop(req, res, next) {
    //     Shop.create(req.body)
    //         .then(shop => res.json(shop))
    //         .catch(next)
    // }

    async createShop(req, res, next){
        try {
            const shop = await Shop.create(req.body)
            if (!shop) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong tao duoc shop`,
                    error: error,
                }))
            }

            const updateUser = await User.findByIdAndUpdate(shop.user, {
                $addToSet:{
                    shops: shop._id
                }
            })

            if (!updateUser) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong cap nhat duoc user`,
                }))
            }

            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Tao thanh cong shop`
            },shop))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server createShop`,
                error: error, 
            }))
        }
    }

    // [PUT] /shops
    // editShopById(req, res, next) {
    //     Shop.updateOne({ _id: req.params.id}, req.body)
    //         .then(shop => res.json(shop))
    //         .catch(next)
    // }

    async editShopById(req, res, next){
        try {
            const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {new: true})
            if (!shop) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong cap nhat duoc shop`,
                }))
            }

            const updateUser = await User.findByIdAndUpdate(shop.user, {
                $addToSet:{
                    shops: shop._id
                }
            })

            if (!updateUser) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong cap nhat duoc user`,
                }))
            }

            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Cap nhat thanh cong shop`
            },shop))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server editShopById`,
                error: error, 
            }))
        }
    }

    // [DELETE] /shops/:id
    // deleteShop(req, res, next) {
    //     Shop.deleteOne({ _id: req.params.id})
    //         .then(shop => res.json(shop))
    //         .catch(next)
    // }

    async deleteShop(req, res, next){
        try {
            const shop = await Shop.findByIdAndDelete(req.params.id)
            if (!shop) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong xoa duoc shop`,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Xoa thanh cong shop`
            },shop))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server deleteShop`,
                error: error, 
            }))
        }
    }
}

module.exports = new ShopsController
