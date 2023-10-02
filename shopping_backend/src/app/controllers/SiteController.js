//import collection (Course) in mongoDB compass => Course export model (Schema)
const Clothes = require('../models/Products.model')

class SiteController {

    //[GET] /
    index(req, res, next) {
        Clothes.find({})
            .then(clothes => res.json(clothes))
            .catch(next)
    }

    //[GET] /search
    search(req, res, next) {
        res.send('search')
    }

}

module.exports = new SiteController