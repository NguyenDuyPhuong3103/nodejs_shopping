const Product = require('../models/Products.model')
const Category = require('../models/Categories.model')
const Shop = require('../models/Shops.model')
const User = require('../models/Users.model')
const responseFormat = require('../../util/responseFormat.js')
const {StatusCodes} = require('http-status-codes')
const pageSize = 2

class ProductsController {

    //[GET] /products
    async getAllProducts(req, res, next){
        try {
            var page = req.query.page

        if (page) {
            //get page
            page = parseInt(page)
            if (page < 1) {
                page = 1 
            }
            // var startPage = (page - 1) * pageSize

            // Product.find({}).populate('category')
            //     .skip(startPage)
            //     .limit(pageSize)
            //     .then(products => {
            //         Product.countDocuments({})
            //             .then((total) => {
            //                 var totalPage = Math.ceil(total / pageSize)
            //                 res.json({
            //                     pageSize: pageSize,
            //                     total: total,
            //                     totalPage: totalPage,
            //                     data: products,
            //                 })
            //             })
            //     })
            //     .catch(next)
            
            const startPage = Math.max((page - 1) * pageSize, 0)

            const products = await Product.find({})
                .populate('category')
                .populate('shop')
                .populate('user')
                .skip(startPage)
                .limit(pageSize)

            if (!products) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong tim thay products`,
                    error: error,
                }))
            }

            const total = await Product.countDocuments({})
            if (!total) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong tim thay total`,
                    error: error,
                }))
            }

            const totalPage = await Math.ceil(total / pageSize)
            if (!totalPage) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong tim thay totalPage`,
                    error: error,
                }))
            }

            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Tim thay tất cả product`
            },{
                pageSize: pageSize,
                total: total,
                totalPage: totalPage,
                data: products,
            }))

        } else {
            // Product.find({})
            //     .then(products => res.json(products))
            //     .catch(next)
            const products = await Product.find({})
                .populate('category')
                .populate('shop')
                .populate('user')
            if (!products || products.length === 0 ) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong tim thay products`,
                    error: error,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Tim thay products`
            },products))
        }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server getAllProducts`,
                error: error, 
            }))
        }
    }

    //[GET] /products/:id
    // getProductById(req, res, next) {
    //     Product.findOne({ _id: req.params.id}).populate('category')
    //         .then(product => res.json(product))
    //         .catch(next)   
    // }

    async getProductById(req, res, next){
        try {
            const product = await Product.findById(req.params.id)
                .populate('category')
                .populate('shop')
                .populate('user')
            if (!product) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong tim thay product`,
                    error: error,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Tim thay product`
            },product))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server getProductById`,
                error: error, 
            }))
        }
    }

    // [POST] /products
    // createProduct(req, res, next) {
    //     Product.create(req.body)
    //         .then(product => res.json(product))
    //         .catch(next)
    // }

    async createProduct(req, res, next){
        try {
            const product = await Product.create(req.body)
            if (!product) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong tao duoc product`,
                    error: error,
                }))
            }

            const updateCategory = await Category.findByIdAndUpdate(product.category, {
                $addToSet:{
                    products: product._id
                }
            })

            if (!updateCategory) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong cap nhat duoc category`,
                    error: error,
                }))
            }

            const updateShop = await Shop.findByIdAndUpdate(product.shop, {
                $addToSet:{
                    products: product._id
                }
            })

            if (!updateShop) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong cap nhat duoc shop`,
                    error: error,
                }))
            }

            const updateUser = await User.findByIdAndUpdate(product.user, {
                $addToSet:{
                    products: product._id
                }
            })

            if (!updateUser) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong cap nhat duoc user`,
                    error: error,
                }))
            }

            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Tao thanh cong product`
            },product))
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server createProduct`,
                error: error,
            }))
        }
    }

    // [PUT] /products
    // editProductById(req, res, next) {
    //     Product.updateOne({ _id: req.params.id}, req.body)
    //         .then(product => res.json(product))
    //         .catch(next)
    // }

    async editProductById(req, res, next){
        try {
            const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true})
            if (!product) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong cap nhat duoc product`,
                    error: error,
                }))
            }

            const updateCategory = await Category.findByIdAndUpdate(product.category, {
                $addToSet:{
                    products: product._id
                }
            })

            if (!updateCategory) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong cap nhat duoc category`,
                    error: error,
                }))
            }

            const updateShop = await Shop.findByIdAndUpdate(product.shop, {
                $addToSet:{
                    products: product._id
                }
            })

            if (!updateShop) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong cap nhat duoc shop`,
                    error: error,
                }))
            }

            const updateUser = await User.findByIdAndUpdate(product.user, {
                $addToSet:{
                    products: product._id
                }
            })

            if (!updateUser) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong cap nhat duoc user`,
                    error: error,
                }))
            }

            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Cap nhat thanh cong product`
            },product))

        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server editProductById`,
                error: error, 
            }))
        }
    }

    // [DELETE] /products/:id
    deleteProduct(req, res, next) {
        Product.deleteOne({ _id: req.params.id})
            .then(product => res.json(product))
            .catch(next)
    }

    // async deleteProduct(req, res, next){
    //     try {
    //         const product = await Product.findByIdAndDelete(req.params.id)
    //         if (!product) {
    //             return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
    //                 message: `Khong xoa duoc product`,
    //                 error: error,
    //             }))
    //         }
    //         return res.status(StatusCodes.OK).json(responseFormat(true, { 
    //             message: `Xoa thanh cong product`
    //         },product))
    //     } catch (error) {
    //         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
    //             message: `Co loi o server deleteProduct`,
    //             error: error, 
    //         }))
    //     }
    // }
}

module.exports = new ProductsController