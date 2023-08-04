//import collection (Products) in mongoDB compass => Products export model (Schema)
const Product = require('../models/Products');

class ProductsController {

    //[GET] /products
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
            .then(result => res.json(result))
            .catch(next);
    }

    // [PUT] /products
    editProductById(req, res, next) {
        Product.updateOne({ _id: req.params.id}, {
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            classification: req.body.classification,
            price: req.body.price,
        })
            .then(product => res.json(product))
            .catch(next); 
    }

    // [DELETE] /products
    deleteProduct(req, res, next) {
        Product.deleteOne
    }
}

module.exports = new ProductsController;