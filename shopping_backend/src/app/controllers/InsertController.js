const Product = require('../models/Products.model')
const Category = require('../models/Categories.model')
const responseFormat = require('../../util/responseFormat.js')
const {StatusCodes} = require('http-status-codes')
const aoData = require('../../../../data/ao.json')
const quanData = require('../../../../data/quan.json')
const phukienData = require('../../../../data/phukien.json')

class InsertController {

    //[GET] /products
    async getProducts(req, res, next) {
        try {
            const dataAoProducts = Object.entries(aoData)
            dataAoProducts[1][1].forEach(async (item) => {
                await Product.create({
                    title: item.anotherData.title,
                    price: +item.anotherData.price,
                    color: item.anotherData.color,
                    sizes: item.anotherData.sizes,
                    images: item.images,
                    description: item.anotherData.description,
                    category: '652bc433ea8e6277ef40aef8',
                })
            })

            const dataQuanProducts = Object.entries(quanData)
            dataQuanProducts[1][1].forEach(async (item) => {
                await Product.create({
                    title: item.anotherData.title,
                    price: +item.anotherData.price,
                    color: item.anotherData.color,
                    sizes: item.anotherData.sizes,
                    images: item.images,
                    description: item.anotherData.description,
                    category: '652bc433ea8e6277ef40aefa',
                })
            })

            const dataPhukienProducts = Object.entries(phukienData)
            dataPhukienProducts[1][1].forEach(async (item) => {
                await Product.create({
                    title: item.anotherData.title,
                    price: +item.anotherData.price,
                    color: item.anotherData.color,
                    sizes: item.anotherData.sizes,
                    images: item.images,
                    description: item.anotherData.description,
                    category: '652bc433ea8e6277ef40aefc',
                })
            })

            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Tao thanh cong dataProducts`
            }))
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server getProducts`,
                error: error,
            }))
        }
    }

    //[GET] /categories
    async getCategories(req, res, next){
        try {
            const aoCategories = aoData.header.title
            const quanCategories = quanData.header.title
            const phukienCategories = phukienData.header.title

            const dataAoCategories = await Category.create({
                name: aoCategories
            })

            const dataQuanCategories = await Category.create({
                name: quanCategories
            })

            const dataPhukienCategories = await Category.create({
                name: phukienCategories
            })

            function checkAndSendResponse(data, categoryName, res) {
                if (!data) {
                  return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `Không tạo được ${categoryName}`,
                  }));
                }
            }
              
            checkAndSendResponse(dataAoCategories, "dataAoCategories", res);
            checkAndSendResponse(dataQuanCategories, "dataQuanCategories", res);
            checkAndSendResponse(dataPhukienCategories, "dataPhukienCategories", res);

            return res.status(StatusCodes.OK).json(responseFormat(true, { 
                message: `Tao thanh cong dataCategories`
            }))
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server getCategories`,
                error: error,
            }))
        }
    }
}

module.exports = new InsertController
