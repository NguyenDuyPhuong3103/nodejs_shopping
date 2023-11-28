const User = require('../models/Users.model')
const Shop = require('../models/Shops.model')
const responseFormat = require('../../utils/responseFormat')
const { StatusCodes } = require('http-status-codes')
const cloudinary = require('../../config/cloudinary/cloudinary')
const getFileName = require('../middleware/getFileName')

class ShopsController {

    //[GET] /
    async getShops(req, res, next) {
        try {
            const shops = await Shop.find({})
                .populate("products")
                .populate("categories")
                .populate("user")
            if (!shops || shops.length === 0) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Khong tim thay shops`,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Tim thay shops`
            }, shops))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server getAllShops`,
                error: error,
            }))
        }
    }

    //[GET] /:id
    async getShopById(req, res, next) {
        try {

            const shop = await Shop.findByIdAndUpdate(req.params.id, { $inc: { numberViews: 1 } }, { new: true })
                .populate('products categories user likes dislikes', 'email name')

            if (!shop) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Khong tim thay shop`,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Tim thay shop`
            }, shop))
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server getShopById`,
                error: error,
            }))
        }
    }

    // [POST] /
    async createShop(req, res, next) {
        try {

            req.body.avatar = req.file?.path

            const shop = await Shop.create(req.body)
            if (!shop) {
                cloudinary.uploader.destroy(req.file.filename)
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Khong tao duoc shop`,
                    error: error,
                }))
            }

            // const updateUser = await User.findByIdAndUpdate(shop.user, {
            //     $addToSet:{
            //         shops: shop._id
            //     }
            // })

            // if (!updateUser) {
            //     return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
            //         message: `Khong cap nhat duoc user`,
            //     }))
            // }

            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Tao thanh cong shop`
            }, shop))
        } catch (error) {
            if (req.file) {
                cloudinary.uploader.destroy(req.file.filename)
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                    message: `Co loi o server createShop`,
                    error: error,
                }))
            }
        }
    }

    // [PUT] /
    async updateShopById(req, res, next) {
        try {

            if (req.file) req.body.avatar = req.file?.path

            const shop = await Shop.findById(req.params.id)
            if (shop) {
                const oldAvatar = getFileName(shop.avatar)
                cloudinary.uploader.destroy(oldAvatar)
            }

            const updatedShop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true })
            if (!updatedShop) {
                cloudinary.uploader.destroy(req.file.filename)
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Khong cap nhat duoc shop`,
                }))
            }

            // const updateUser = await User.findByIdAndUpdate(shop.user, {
            //     $addToSet: {
            //         shops: shop._id
            //     }
            // })

            // if (!updateUser) {
            //     return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
            //         message: `Khong cap nhat duoc user`,
            //     }))
            // }

            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Cap nhat thanh cong shop`
            }, updatedShop))
        } catch (error) {
            if (req.file) {
                cloudinary.uploader.destroy(req.file.filename)
                console.log(error)
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                    message: `Co loi o server updateShop`,
                    error: error,
                }))
            }
        }
    }

    // [DELETE] /:id
    async deleteShop(req, res, next) {
        try {
            const shop = await Shop.findById(req.params.id)
            if (shop) {
                const cloudinaryAvatar = getFileName(shop.avatar)
                cloudinary.uploader.destroy(cloudinaryAvatar)
            }

            const deletedShop = await Shop.findByIdAndDelete(req.params.id)
            if (!deletedShop) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Khong xoa duoc shop`,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Xoa thanh cong shop`
            }, deletedShop))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server deleteShop`,
                error: error,
            }))
        }
    }

    //[PUT] /likes
    async likesShop(req, res, next) {
        try {
            const { _id } = req.user
            const { shopId } = req.params
            if (!shopId) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Thiếu dữ liệu tải lên !!!`,
                }))
            }

            const shop = await Shop.findById(shopId)
            const alreadyDisliked = shop?.dislikes?.find(el => el.toString() === _id)
            if (alreadyDisliked) {
                const response = await Shop.findByIdAndUpdate(shopId, { $pull: { dislikes: _id } }, { new: true })
                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: 'Thành công'
                }, response))
            }
            const isLiked = shop?.likes.find(el => el.toString() === _id)
            if (isLiked) {
                const response = await Shop.findByIdAndUpdate(shopId, { $pull: { likes: _id } }, { new: true })
                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: 'Thành công'
                }, response))
            } else {
                const response = await Shop.findByIdAndUpdate(shopId, { $push: { likes: _id } }, { new: true })
                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: 'Thành công'
                }, response))
            }
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server likesShop`,
                error: error,
            }))
        }
    }

    //[PUT] /dislikes
    async dislikesShop(req, res, next) {
        try {
            const { _id } = req.user
            const { shopId } = req.params
            if (!shopId) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Thiếu dữ liệu tải lên !!!`,
                }))
            }

            const shop = await Shop.findById(shopId)
            const alreadyLiked = shop?.likes?.find(el => el.toString() === _id)
            if (alreadyLiked) {
                const response = await Shop.findByIdAndUpdate(shopId, { $pull: { likes: _id } }, { new: true })
                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: 'Thành công'
                }, response))
            }
            const isDisliked = shop?.dislikes.find(el => el.toString() === _id)
            if (isDisliked) {
                const response = await Shop.findByIdAndUpdate(shopId, { $pull: { dislikes: _id } }, { new: true })
                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: 'Thành công'
                }, response))
            } else {
                const response = await Shop.findByIdAndUpdate(shopId, { $push: { dislikes: _id } }, { new: true })
                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: 'Thành công'
                }, response))
            }
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server dislikesShop`,
                error: error,
            }))
        }
    }
}

module.exports = new ShopsController
