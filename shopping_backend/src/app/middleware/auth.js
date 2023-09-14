const jwt = require('jsonwebtoken');

module.exports = function jwtAuth(req, res, next) {
    try {
        var token = req.params.token;
        console.log('req.cookies.token:',req.cookies.token);
        var total = jwt.verify(token, 'mk');
        if (total) {
            next();
        }
    } catch (error) {
        return res.json('co loi o phan auth.js');
    }
}
