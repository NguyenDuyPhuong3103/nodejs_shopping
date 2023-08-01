//import collection (Products) in mongoDB compass => Products export model (Schema)
const Product = require('../models/Products');

class ProductsController {

    //[GET] /products
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
            .catch(error => res.json(error));
    }

    // [DELETE] /products
    deleteProduct(req, res, next) {
        Product.deleteOne
    }
}

module.exports = new ProductsController;