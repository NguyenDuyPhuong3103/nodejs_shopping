const express = require('express')
const router = express.Router()

const { notFound, errHandler } = require('../app/middleware/errorHandler')

const { validate, schemas } = require('../app/middleware/validation')

const { verifyAccessToken } = require('../app/middleware/jwtService')

const { uploadUserToCloud } = require('../app/middleware/uploadImages')

const userController = require('../app/controllers/UserController')

router.post('/register', uploadUserToCloud.single('avatar'), validate(schemas.userSchema), userController.register)
// router.put('/:id', verifyAccessToken, uploadUserToCloud.single('avatar'), validate(schemas.userSchema), userController.updateUser)
//test khi chua co ham verifyAccessToken
router.put('/:id', uploadUserToCloud.single('avatar'), validate(schemas.userSchema), userController.updateUser)
router.post('/login', validate(schemas.userSchema), userController.login)
router.get('/refresh-token', userController.refreshToken)
router.post('/logout', verifyAccessToken, userController.logout)
router.delete('/:id', userController.deleteUser)
router.get('/', verifyAccessToken, userController.getInfoUsers)
router.use(notFound)
router.use(errHandler)

module.exports = router
