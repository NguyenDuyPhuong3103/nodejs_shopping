const Category = require('../models/Categories.model')
const Shop = require('../models/Shops.model')
const responseFormat = require('../../utils/responseFormat.js')
const { StatusCodes } = require('http-status-codes')

class CategoriesController {

    //[GET] /
    async getCategories(req, res, next) {
        try {
            const categories = await Category.find({})
                .select('name _id')
                .populate("products")
                .populate('shop')
            if (!categories || categories.length === 0) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Khong tim thay categories`,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Tim thay categories`
            }, categories))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server getAllCategories`,
                error: error,
            }))
        }
    }

    //[GET] /:id
    async getCategoryById(req, res, next) {
        try {
            const category = await Category.findById(req.params.id)
                .select('name _id')
                .populate("products")
                .populate('shop')
            if (!category) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Khong tim thay category`,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Tim thay category`
            }, category))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server getCategoryById`,
                error: error,
            }))
        }
    }

    // [POST] /
    async createCategory(req, res, next) {
        try {
            const category = await Category.create(req.body)
            if (!category) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Khong tao duoc category`,
                }))
            }

            // const updateShop = await Shop.findByIdAndUpdate(category.shop, {
            //     $addToSet: {
            //         categories: category._id
            //     }
            // })

            // if (!updateShop) {
            //     return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
            //         message: `Khong cap nhat duoc shop`,
            //     }))
            // }

            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Tao thanh cong category`
            }, category))
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server createCategory`,
                error: error,
            }))
        }
    }

    // [PUT] /
    async updateCategoryById(req, res, next) {
        try {
            const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
            if (!category) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Khong cap nhat duoc category`,
                }))
            }

            const updateShop = await Shop.findByIdAndUpdate(category.shop, {
                $addToSet: {
                    categories: category._id
                }
            })

            if (!updateShop) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Khong cap nhat duoc shop`,
                }))
            }

            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Cap nhat thanh cong category`
            }, category))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server editCategoryById`,
                error: error,
            }))
        }
    }

    // [DELETE] /:id
    async deleteCategory(req, res, next) {
        try {
            const category = await Category.findByIdAndDelete(req.params.id)
            if (!category) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Khong xoa duoc category`,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Xoa thanh cong category`
            }, category))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server deleteCategory`,
                error: error,
            }))
        }
    }
}

module.exports = new CategoriesController
