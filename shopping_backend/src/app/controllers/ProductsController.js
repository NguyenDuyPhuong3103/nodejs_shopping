//import collection (Products) in mongoDB compass => Products export model (Schema)
const Product = require('../models/Products.model');
const pageSize = 2;

class ProductsController {

    //[GET] /products
    getAllsProducts(req, res, next){
        var page = req.query.page;

        if (page) {
            //get page
            page = parseInt(page);
            if (page < 1) {
                page = 1; 
            }
            var startPage = (page - 1) * pageSize;

            Product.find({})
                .skip(startPage)
                .limit(pageSize)
                .then(products => {
                    Product.countDocuments({})
                        .then((total) => {
                            var totalPage = Math.ceil(total / pageSize);
                            res.json({
                                pageSize: pageSize,
                                total: total,
                                totalPage: totalPage,
                                data: products,
                            });
                        });
                })
                .catch(next);
        } else {
            Product.find({})
                .then(products => res.json(products))
                .catch(next);
        }
    }
    //[GET] /products/AllPostedProducts
    getAllProducts(req, res, next){
        Product.find({})
            .then(products => res.json(products))
            .catch(next);
    }

    //[GET] /products/:id
    getProductById(req, res, next) {
        Product.findOne({ _id: req.params.id})
            .then(product => res.json(product))
            .catch(next);   
    }

    // [POST] /products
    createProduct(req, res, next) {
        Product.create(req.body)
            .then(product => res.json(product))
            .catch(next);
    }

    // [PUT] /products
    editProductById(req, res, next) {
        Product.updateOne({ _id: req.params.id}, req.body)
            .then(product => res.json(product))
            .catch(next);
    }

    // [DELETE] /products/:id
    deleteProduct(req, res, next) {
        Product.deleteOne({ _id: req.params.id})
            .then(product => res.json(product))
            .catch(next);
    }
}

module.exports = new ProductsController;