//import collection (Course) in mongoDB compass => Course export model (Schema)
const Clothes = require('../models/Clothes');

class SiteController {

    //[GET] /
    index(req, res, next) {
        Clothes.find({})
            .then(clothess => res.json(clothess))
            .catch(next);
    }

    //[GET] /search
    search(req, res) {
        res.send('search');
    }

}

module.exports = new SiteController;