//import collection (Clothes) in mongoDB compass => Clothes export model (Schema)
const Clothes = require('../models/Clothes');

class ClothesController {

    //[GET] /clothes/create
    create(req, res, next){
        console.log(res.json());
    }

    // [POST] /clothes/store
    store(req, res, next) {
        res.send('HALA MADRID');
    //    res.json(req.body);
    //    req.body.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
    //     const course = new Course(req.body);
    //     course.save()
    //         .then(() => res.redirect(`/me/stored/courses`))
    //         .catch(error => {

    //         });
    }

    //[GET] /clothes/:_id
    details(req, res, next) {
        Clothes.findOne({ _id: req.params._id})
            .then(cloth => res.json(cloth))
            .catch(next);   
    }

    //[GET] /clothes/
    index(req, res, next) {
        Clothes.find({})
            .then(clothes => res.json(clothes))
            .catch(next);
    }
}

module.exports = new ClothesController;