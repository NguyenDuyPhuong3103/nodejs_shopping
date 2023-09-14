const express = require('express');
const router = express.Router();

const {validate, schemas} = require('../app/middleware/validation');

const {verifyAccessToken, verifyAccessTokenWithAdmin} = require('../app/middleware/jwtService');


const userController = require('../app/controllers/UserController');

router.post('/register', validate(schemas.userSchema), userController.register);
router.post('/login', validate(schemas.userSchema), userController.login);
router.get('/refresh-token', userController.refreshToken);
router.post('/logout',verifyAccessToken, userController.logout);
router.delete('/:id',verifyAccessTokenWithAdmin, userController.deleteUser);
router.get('/set-cookie', userController.setCookie);
router.get('/get-cookie', userController.getCookie);
router.get('/',verifyAccessToken, userController.getAllUsers);

module.exports = router;
