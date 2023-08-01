//import collection (Products) in mongoDB compass => Products export model (Schema)
const Product = require('../models/Products');

class UserController {

    //[GET] /posted/postedproducts
    postedproducts(req, res, next){
        Product.find({})
            .then(products => res.json(products))
            .catch(next);
    }
}

module.exports = new UserController;