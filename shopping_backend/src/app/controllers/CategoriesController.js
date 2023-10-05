const Category = require('../models/Categories.model')
const Shop = require('../models/Shops.model')
const responseFormat = require('../../util/responseFormat.js')
const {StatusCodes} = require('http-status-codes')

class CategoriesController {

    //[GET] /categories
    // getAllCategories(req, res, next){
    //     Category.find({})
    //         .then(categories => res.json(categories))
    //         .catch(next)
    // }

    async getAllCategories(req, res, next){
        try {
            const categories = await Category.find({})
                .populate("products")
                .populate('shop')
            if (!categories || categories.length === 0 ) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong tim thay categories`,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Tim thay categories`
            },categories))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server getAllCategories`,
                error: error, 
            }))
        }
    }

    //[GET] /categories/:id
    // getCategoryById(req, res, next) {
    //     Category.findOne({ _id: req.params.id})
    //         .then(category => res.json(category))
    //         .catch(next)   
    // }

    async getCategoryById(req, res, next){
        try {
            const category = await Category.findById(req.params.id)
                .populate("products")
                .populate('shop')
            if (!category) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong tim thay category`,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Tim thay category`
            },category))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server getCategoryById`,
                error: error, 
            }))
        }
    }

    // [POST] /categories
    // createCategory(req, res, next) {
    //     Category.create(req.body)
    //         .then(category => res.json(category))
    //         .catch(next)
    // }

    async createCategory(req, res, next){
        try {
            const category = await Category.create(req.body)
            if (!category) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong tao duoc category`,
                }))
            }

            const updateShop = await Shop.findByIdAndUpdate(category.shop, {
                $addToSet:{
                    categories: category._id
                }
            })

            if (!updateShop) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong cap nhat duoc shop`,
                }))
            }

            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Tao thanh cong category`
            },category))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server createCategory`,
                error: error, 
            }))
        }
    }

    // [PUT] /categories
    // editCategoryById(req, res, next) {
    //     Category.updateOne({ _id: req.params.id}, req.body)
    //         .then(category => res.json(category))
    //         .catch(next)
    // }

    async editCategoryById(req, res, next){
        try {
            const category = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true})
            if (!category) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong cap nhat duoc category`,
                }))
            }

            const updateShop = await Shop.findByIdAndUpdate(category.shop, {
                $addToSet:{
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
            },category))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server editCategoryById`,
                error: error, 
            }))
        }
    }

    // [DELETE] /categories/:id
    // deleteCategory(req, res, next) {
    //     Category.deleteOne({ _id: req.params.id})
    //         .then(category => res.json(category))
    //         .catch(next)
    // }

    async deleteCategory(req, res, next){
        try {
            const category = await Category.findByIdAndDelete(req.params.id)
            if (!category) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong xoa duoc category`,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Xoa thanh cong category`
            },category))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server deleteCategory`,
                error: error, 
            }))
        }
    }
}

module.exports = new CategoriesController
