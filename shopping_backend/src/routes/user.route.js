const express = require('express')
const router = express.Router()

const { notFound, errHandler } = require('../app/middleware/errorHandler')

const { validate, schemas } = require('../app/middleware/validation')

const { verifyAccessToken } = require('../app/middleware/jwtService')

const isAdmin = require('../app/middleware/authorization')

const { uploadUserToCloud } = require('../app/middleware/uploadImages')

const userController = require('../app/controllers/UserController')

router.get('/', verifyAccessToken, isAdmin, userController.getInfoUsers)
router.put('/:id', verifyAccessToken, isAdmin, uploadUserToCloud.single('avatar'), userController.updateUserByAdmin)
router.post('/register', uploadUserToCloud.single('avatar'), validate(schemas.userSchema), userController.register)
router.post('/login', validate(schemas.userSchema), userController.login)
router.get('/getInfoUser', verifyAccessToken, userController.getInfoUser)
router.get('/refresh-token', userController.refreshToken)
router.get('/logout', verifyAccessToken, userController.logout)
router.get('/forgotPassword', userController.forgotPassword)
router.put('/resetPassword', userController.resetPassword)
router.put('/current', verifyAccessToken, uploadUserToCloud.single('avatar'), userController.updateUser)
router.delete('/:id', verifyAccessToken, isAdmin, userController.deleteUser)
router.use(notFound)
router.use(errHandler)

module.exports = router
