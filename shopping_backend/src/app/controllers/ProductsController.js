const Product = require('../models/Products.model')
const Category = require('../models/Categories.model')
const Shop = require('../models/Shops.model')
const User = require('../models/Users.model')
const responseFormat = require('../../utils/responseFormat.js')
const { StatusCodes } = require('http-status-codes')
const slugify = require('slugify')
// const pageSize = 2

class ProductsController {

    //[GET] /

    // Cách 1: Sử dụng panigation
    // async getProducts(req, res, next) {
    //     try {
    //         const {
    //             page = 1,
    //             limit = 7,
    //             sort = "createdAt",
    //             order = "asc"
    //         } = req.query

    //         const options = {
    //             page,
    //             limit,
    //             sort: {
    //                 [sort]: order === "asc" ? 1 : -1
    //             },
    //             populate: ['category', 'shop', 'user']
    //         }

    //         const data = await Product.paginate({}, options)
    //         if (!data.docs || data.docs.length === 0) {
    //             return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
    //                 message: `Khong tim thay data`,
    //             }))
    //         }
    //         return res.status(StatusCodes.OK).json(responseFormat(true, {
    //             message: `Tim thay data`
    //         }, data))
    //     } catch (error) {
    //         console.log(error)
    //         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
    //             message: `Co loi o server getAllProducts`,
    //         }))
    //     }
    // }

    //Cách 2: sử dụng javascript thuần
    async getProducts(req, res, next) {    // 17/11
        try {
            const queries = { ...req.query }
            //Tách các trường đặc biệt ra khỏi queries 
            const excludeFields = ['limit', 'sort', 'page', 'fields']
            excludeFields.forEach(el => delete queries[el])

            //Format lại các operators cho đúng cú pháp của mongoose
            let queryString = JSON.stringify(queries)
            queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
            const formatedQueries = JSON.parse(queryString)

            //Filtering 
            if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
            let queryCommand = Product.find(formatedQueries)

            // Sorting
            if (req.query.sort) {
                const sortBy = req.query.sort.split(',').join(' ')
                queryCommand = queryCommand.sort(sortBy)
            }

            //Fields limiting (hạn chế trường lấy về)
            if (req.query.fields) {
                const fields = req.query.fields.split(',').join(' ')
                queryCommand = queryCommand.select(fields)
            }

            //Panigation
            //Limit: số lượng object lấy về trong 1 lần gọi API
            //Skip: bỏ qua bao nhiêu object 
            const page = +req.query.page || 1
            const limit = +req.query.limit || process.env.LIMIT_PRODUCT
            const skip = (page - 1) * limit
            queryCommand.skip(skip).limit(limit)

            //Execute query
            // Số lượng sản phẩm thỏa mãn điều kiện (counts) !== Số lượng sản phẩm trả về 1 lần gọi API
            queryCommand.exec()
                .then(async (response) => {
                    const counts = await Product.find(formatedQueries).countDocuments()

                    if (counts) {
                        return res.status(StatusCodes.OK).json(responseFormat(true, {
                            message: `Tìm thấy dữ liệu phù hợp với điều kiện!!!`
                        }, {
                            counts,
                            product: response,
                        }))
                    }
                })
                .catch(error => {
                    console.log(error)
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                        message: `Có lỗi xảy ra, không thể thực hiện yêu cầu!!!`,
                    }, error))
                })

        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server getAllProducts`,
            }))
        }
    }

    //[GET] /:id
    async getProductById(req, res, next) {
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
            }, product))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server getProductById`,
                error: error,
            }))
        }
    }

    // [POST] /
    async createProduct(req, res, next) {
        try {
            if (Object.keys(req.body) === 0) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Không tìm thấy dữ liệu cần tạo!!!`,
                }))
            }

            if (req.body && req.body.title) {
                req.body.slug = slugify(req.body.title)

                const product = await Product.create(req.body)
                if (!product) {
                    return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                        message: `Khong tao duoc product`,
                    }))
                }

                // const updateCategory = await Category.findByIdAndUpdate(product.category, {
                //     $addToSet:{
                //         products: product._id
                //     }
                // })

                // if (!updateCategory) {
                //     return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                //         message: `Khong cap nhat duoc category`,
                //     }))
                // }

                // const updateShop = await Shop.findByIdAndUpdate(product.shop, {
                //     $addToSet:{
                //         products: product._id
                //     }
                // })

                // if (!updateShop) {
                //     return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                //         message: `Khong cap nhat duoc shop`,
                //     }))
                // }

                // const updateUser = await User.findByIdAndUpdate(product.user, {
                //     $addToSet:{
                //         products: product._id
                //     }
                // })

                // if (!updateUser) {
                //     return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                //         message: `Khong cap nhat duoc user`,
                //     }))
                // }

                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: `Tao thanh cong product`
                }, product))
            }
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server createProduct`,
                error: error,
            }))
        }
    }

    // [POST] /
    async createProductHaveCloudinary(req, res, next) {
        try {
            if (Object.keys(req.body) === 0) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Không tìm thấy dữ liệu cần tạo!!!`,
                }))
            }

            if (req.body && req.body.title) {
                req.body.slug = slugify(req.body.title)

                const product = await Product.create(req.body)
                if (!product) {
                    req.files.forEach(el => cloudinary.uploader.destroy(el.filename))
                    return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                        message: `Khong tao duoc product`,
                    }))
                } else {

                    // const updateCategory = await Category.findByIdAndUpdate(product.category, {
                    //     $addToSet:{
                    //         products: product._id
                    //     }
                    // })

                    // if (!updateCategory) {
                    //     return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    //         message: `Khong cap nhat duoc category`,
                    //     }))
                    // }

                    // const updateShop = await Shop.findByIdAndUpdate(product.shop, {
                    //     $addToSet:{
                    //         products: product._id
                    //     }
                    // })

                    // if (!updateShop) {
                    //     return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    //         message: `Khong cap nhat duoc shop`,
                    //     }))
                    // }

                    // const updateUser = await User.findByIdAndUpdate(product.user, {
                    //     $addToSet:{
                    //         products: product._id
                    //     }
                    // })

                    // if (!updateUser) {
                    //     return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    //         message: `Khong cap nhat duoc user`,
                    //     }))
                    // }

                    return res.status(StatusCodes.OK).json(responseFormat(true, {
                        message: `Tao thanh cong product`
                    }, product))
                }
            }
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server createProduct`,
                error: error,
            }))
        }
    }

    // [PUT] /
    async updateProductById(req, res, next) {
        try {
            if (req.body && req.body.title) req.body.slug = slugify(req.body.title)

            const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
            if (!product) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Khong cap nhat duoc product`,
                }))
            }

            // const updateCategory = await Category.findByIdAndUpdate(product.category, {
            //     $addToSet: {
            //         products: product._id
            //     }
            // })

            // if (!updateCategory) {
            //     return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
            //         message: `Khong cap nhat duoc category`,
            //     }))
            // }

            // const updateShop = await Shop.findByIdAndUpdate(product.shop, {
            //     $addToSet: {
            //         products: product._id
            //     }
            // })

            // if (!updateShop) {
            //     return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
            //         message: `Khong cap nhat duoc shop`,
            //     }))
            // }

            // const updateUser = await User.findByIdAndUpdate(product.user, {
            //     $addToSet: {
            //         products: product._id
            //     }
            // })

            // if (!updateUser) {
            //     return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
            //         message: `Khong cap nhat duoc user`,
            //     }))
            // }

            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Cap nhat thanh cong product`
            }, product))

        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server editProductById`,
                error: error,
            }))
        }
    }

    // [DELETE]/:id
    async deleteProduct(req, res, next) {
        try {
            const product = await Product.findByIdAndDelete(req.params.id)
            if (!product) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Khong xoa duoc product`,
                }))
            }
            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Xoa thanh cong product`
            }, product))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server deleteProduct`,
            }))
        }
    }

    // [PUT] /ratings
    async ratingsProduct(req, res, next) {
        try {
            const { _id } = req.user
            const { star, comment, productId } = req.body
            if (!star || !productId) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Thiếu dữ liệu để thực hiện yêu cầu!!!`,
                }))
            }

            const ratingsProduct = await Product.findById(productId)
            const alreadyRating = ratingsProduct?.ratings?.find(el => el.postedBy.toString() === _id)

            if (alreadyRating) {
                //Th1: product ĐÃ có người đánh giá
                // Update star và comment
                await Product.updateOne(
                    { "ratings.postedBy": _id },
                    { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
                    { new: true })
            } else {
                //Th2: product CHƯA có người đánh giá
                // Add star và comment
                await Product.findByIdAndUpdate(productId, {
                    $push: { ratings: { star, comment, postedBy: _id } }
                }, { new: true })
            }

            //totalRatings
            const updatedProduct = await Product.findById(productId)
            const ratingCount = updatedProduct.ratings.length
            const sumRatingProduct = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0)
            updatedProduct.totalRatings = Math.round(sumRatingProduct * 10 / ratingCount) / 10

            await updatedProduct.save()


            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `ratings thành công!!!`
            }, updatedProduct))
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server deleteProduct`,
            }))
        }
    }

    // [DELETE]/
    async uploadImageProduct(req, res, next) {
        try {
            const { id } = req.params
            if (!id) {
                // Xóa mảng nhiều ảnh trên cloudinary
                req.files.forEach(el => cloudinary.uploader.destroy(el.filename))
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Thiếu dữ liệu sản phẩm để thực hiện yêu cầu!!!`,
                }))
            }

            if (!req.files) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Thiếu dữ liệu để thực hiện yêu cầu!!!`,
                }))
            }

            const response = await Product.findByIdAndUpdate(id, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true })
            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Tải ảnh lên thành công`
            }, response))
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server uploadImageProduct`,
            }))
        }
    }
}

module.exports = new ProductsController
