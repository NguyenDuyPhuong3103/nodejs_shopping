const Category = require('../models/Categories.model');
const pageSize = 2;

class CategoriesController {

    //[GET] /categories
    getAllCategories(req, res, next){
        Category.find({})
            .then(categories => res.json(categories))
            .catch(next);
    }

    //[GET] /categories/:id
    getCategoryById(req, res, next) {
        Category.findOne({ _id: req.params.id})
            .then(category => res.json(category))
            .catch(next);   
    }

    // [POST] /categories
    createCategory(req, res, next) {
        Category.create(req.body)
            .then(category => res.json(category))
            .catch(next);
    }

    // [PUT] /categories
    editCategoryById(req, res, next) {
        Category.updateOne({ _id: req.params.id}, req.body)
            .then(category => res.json(category))
            .catch(next);
    }

    // [DELETE] /categories/:id
    deleteCategory(req, res, next) {
        Category.deleteOne({ _id: req.params.id})
            .then(category => res.json(category))
            .catch(next);
    }
}

module.exports = new CategoriesController;