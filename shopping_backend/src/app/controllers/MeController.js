const Course = require('../models/Course');
const {multiMongooseToObject} = require('../../util/mongoose');

class MeController {
    //[GET] /me/stored/courses
    storedCourses(req, res, next) {

        // Promise.all([Course.find({}), Course.countDocumentsDeleted()])
        //     .then(([courses, deletedCount]) => 
        //         res.render('me/stored-courses', { 
        //             deletedCount,
        //             courses:  multiMongooseToObject(courses)
        //     })
        //     .catch(next)
        // )

        // // Nếu tách phần trên ra ta có 2 phần dưới đây
        // // Course.countDocumentsDeleted()
        // //     .then((deletedCount) => {
        // //         console.log(deletedCount);
        // //     })
        // //     .catch(() => {});

        Course.find({})
            .then(courses => 
                res.render('me/stored-courses', { 
                    courses:  multiMongooseToObject(courses)
            }),
        )
            .catch(next);
        
    }

    //[GET] /me/trash/courses
    //Cách của anh Sơn nhưng không xóa được dữ liệu ở bên thùng rác
    // trashCourses(req, res, next) {
    //     Course.findDeleted({})
    //         .then(courses => {res.render('me/trash-courses', { 
    //             courses:  multiMongooseToObject(courses)
    //         })
    //     })
    //         .catch(next);
    // }

    //Cách tìm được ở phần bình luận
    trashCourses(req, res, next) { 
        Course.findDeleted({ deleted: true })
            .then((courses) => res.render('me/trash-courses', { 
                courses: multiMongooseToObject(
                    courses.filter(course => course.deleted)), 
            }), )
            .catch(next);
    }
}

module.exports = new MeController();

