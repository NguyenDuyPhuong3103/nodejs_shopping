const Product = require('../models/Products.model')
const Category = require('../models/Categories.model')
const Shop = require('../models/Shops.model')
const User = require('../models/Users.model')
const responseFormat = require('../../util/responseFormat.js')
const {StatusCodes} = require('http-status-codes')
const pageSize = 2

class ProductsController {

    //[GET] /products
    // async getAllProducts(req, res, next){
    //     try {
    //         let page = req.query.page

    //         if (page) {
    //             //get page
    //             page = parseInt(page)
    //             if (page < 1) {
    //                 page = 1 
    //             }
                
    //             const startPage = Math.max((page - 1) * pageSize, 0)

    //             const products = await Product.find({})
    //                 .populate('category')
    //                 .populate('shop')
    //                 .populate('user')
    //                 .skip(startPage)
    //                 .limit(pageSize)

    //             if (!products) {
    //                 return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
    //                     message: `Khong tim thay products`,
    //                 }))
    //             }

    //             const total = await Product.countDocuments({})
    //             if (!total) {
    //                 return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
    //                     message: `Khong tim thay total`,
    //                 }))
    //             }

    //             const totalPage = await Math.ceil(total / pageSize)
    //             if (!totalPage) {
    //                 return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
    //                     message: `Khong tim thay totalPage`,
    //                 }))
    //             }

    //             const resData = {
    //                 pageSize: pageSize,
    //                 total: total,
    //                 totalPage: totalPage,
    //                 data: products,
    //             }

    //             return res.status(StatusCodes.OK).json(responseFormat(true, { 
    //                 message: `Tim thay tất cả product`
    //             },resData))

    //         } else {
    //             const products = await Product.find({})
    //                 .populate('category')
    //                 .populate('shop')
    //                 .populate('user')
    //             if (!products || products.length === 0 ) {
    //                 return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
    //                     message: `Khong tim thay products`,
    //                 }))
    //             }
    //             return res.status(StatusCodes.OK).json(responseFormat(true, { 
    //                 message: `Tim thay products`
    //             },products))
    //         }
    //     } catch (error) {
    //         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
    //             message: `Co loi o server getAllProducts`,
    //             error: error, 
    //         }))
    //     }
    // }

    async getAllProducts(req, res, next){
        try {
            const {
                page = 1, 
                limit = 10, 
                sort = "createdAt", 
                order = "asc"
            } = req.query

            const options = {
                page,
                limit,
                sort: {
                    [sort] : order === "asc" ? 1 : -1
                },
                populate: ['category', 'shop', 'user']
            }

            const data = await Product.paginate({}, options)
            console.log(data)
            if (!data.docs || data.docs.length === 0 ) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong tim thay data`,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Tim thay data`
            },data))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server getAllProducts`,
                error: error, 
            }))
        }
    }

    //[GET] /products/:id
    async getProductById(req, res, next){
        try {
            const product = await Product.findById(req.params.id)
                .populate('category')
                .populate('shop')
                .populate('user')
            if (!product) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong tim thay product`,
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
    async createProduct(req, res, next){
        try {
            const product = await Product.create(req.body)
            if (!product) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong tao duoc product`,
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
    async editProductById(req, res, next){
        try {
            const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true})
            if (!product) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong cap nhat duoc product`,
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
    async deleteProduct(req, res, next){
        try {
            const product = await Product.findByIdAndDelete(req.params.id)
            if (!product) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Khong xoa duoc product`,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Xoa thanh cong product`
            },product))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server deleteProduct`,
            }))
        }
    }
}

module.exports = new ProductsController
