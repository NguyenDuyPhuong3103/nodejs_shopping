//import collection (Clothes) in mongoDB compass => Clothes export model (Schema)
const Clothes = require('../models/Clothes');

class ClothesController {

    //[GET] /clothes/:slug
    show(req, res, next) {
        Clothes.findOne({ slug: req.params.slug})
            .then(clothes => res.json(clothes))
            .catch(next);    
    }

    //[GET] /clothes/
    index(req, res, next) {
        Clothes.find({})
            .then(clothess => res.json(clothess))
            .catch(next);
    }
}

module.exports = new ClothesController;