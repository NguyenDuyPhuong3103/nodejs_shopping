const Shop = require('../models/Shops.model');

class ShopsController {

    //[GET] /shops
    getAllShops(req, res, next){
        Shop.find({})
            .then(shops => res.json(shops))
            .catch(next);
    }

    //[GET] /shops/:id
    getShopById(req, res, next) {
        Shop.findOne({ _id: req.params.id})
            .then(shop => res.json(shop))
            .catch(next);   
    }

    // [POST] /shops
    createShop(req, res, next) {
        Shop.create(req.body)
            .then(shop => res.json(shop))
            .catch(next);
    }

    // [PUT] /shops
    editShopById(req, res, next) {
        Shop.updateOne({ _id: req.params.id}, req.body)
            .then(shop => res.json(shop))
            .catch(next);
    }

    // [DELETE] /shops/:id
    deleteShop(req, res, next) {
        Shop.deleteOne({ _id: req.params.id})
            .then(shop => res.json(shop))
            .catch(next);
    }
}

module.exports = new ShopsController;