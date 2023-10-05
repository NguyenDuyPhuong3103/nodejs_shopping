const User = require('../models/Users.model')
const RefreshTokenModel = require('../models/RefreshTokens.model')
const responseFormat = require('../../util/responseFormat.js')
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../middleware/jwtService')
const {StatusCodes} = require('http-status-codes')

class UserController {

    //[POST] /register
    async register(req, res, next) {
        try {
            const { email, password } = req.body

            const isExits = await User.findOne({
                email
            })

            if (isExits) {
                return res.status(StatusCodes.OK).json(responseFormat(false, { 
                    message: `${email} da ton tai, vui long nhap email khac!!!` 
                }))
            }

            const user = new User(req.body)

            const saveUser = await user.save()

            if (!saveUser) {
                return res.status(StatusCodes.OK).json(responseFormat(false, { 
                    message: 'Lỗi khi tạo người dùng!!!' 
                }))
            }

            return res.status(StatusCodes.CREATED).json(responseFormat(true, {
                message: 'Ban da dang ky thanh cong!!!'
            }, saveUser))
        } catch (error) {
            return res.status(StatusCodes.OK).json(responseFormat(false, { 
                message: `Co loi o server register`,
                error: error, 
            }))
        }
    }

    //[POST] /login
    async login(req, res, next) {
        try {
            const { email, password } = req.body
            
            const user = await User.findOne({email})
                                    .populate("products")
                                    .populate("shops")

            if (!user) {
                return res.status(StatusCodes.OK).json(responseFormat(false, { 
                    message: `email hoac password sai, vui long nhap lai!!!` 
                }))
            }

            const isValid = await user.isCheckPassword(password)

            if (!isValid) {
                return res.status(StatusCodes.OK).json(responseFormat(false, { 
                    message: `email hoac password sai, vui long nhap lai!!!` 
                }))
            }

            const accessToken = await signAccessToken(user._id)
            const refreshToken = await signRefreshToken(user._id)
            
            const tokenInSchema = await RefreshTokenModel.findOne({user: user._id})
            if(!tokenInSchema) {
                const refreshTokenModel = new RefreshTokenModel({
                    token: refreshToken,
                    user: user._id,
                })
                await refreshTokenModel.save()
            } else {
                let newRefreshToken = await RefreshTokenModel.findOneAndUpdate(
                    {user: user._id},
                    {token: refreshToken},
                    {new: true}
                )
            }

            await res.cookie("refreshToken", refreshToken, { maxAge: 1000 * 60 * 10, httpOnly: false })

            user.password = undefined

            return res.status(StatusCodes.ACCEPTED).json(responseFormat(true, {
                message: 'Ban da dang nhap thanh cong!!!'
            }, {
                user,
                accessToken
            }))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server login`,
                error: error, 
            }))
        }
    }

    //[POST] /refresh-token
        /*
        1./ Take refresh token from user
        2./ Create new access token and new refresh token
        */
    async refreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken){
                return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, { 
                    message: `Khong tim thay refreshToken trong cookie o server!!` 
                }))
            }

            const {userId} = await verifyRefreshToken(refreshToken)
            
            const findToken = await RefreshTokenModel.findOne({token: refreshToken})
            if (!findToken){
                return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, { 
                    message: `refreshToken khong hop le!!` 
                }))
            } else {
                const accessToken = await signAccessToken(userId)
                const newRef = await signRefreshToken(userId)
                let newRefreshToken = await RefreshTokenModel.findOneAndUpdate(
                    {token: refreshToken},
                    {token: newRef},
                    {new: true}
                )

                res.cookie("refreshToken", newRef, { maxAge: 1000 * 60 * 10, httpOnly: false })

                return res.status(StatusCodes.OK).json(responseFormat(true, { 
                    message: `Refresh Token thanh cong!!!`},{
                        accessToken
                    }))
            }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server refreshToken`,
                error: error, 
            }))
        }
    }

    //[DELETE] /logout
    async logout(req, res, next) {
        await res.clearCookie("refreshToken")
        
        try {
            const deletedUser = await RefreshTokenModel.findOneAndDelete({token: req.cookies.refreshToken})
            if (deletedUser) {
                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: 'Ban da dang xuat thanh cong!!!'
                }))
            } else {
                return res.status(StatusCodes.	NOT_FOUND).json(responseFormat(false, { 
                    message: `Co loi o server logout, khong tim thay refreshToken`,
                }))
            }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server Log out`,
                error: error, 
            }))
        }
    }

    // [DELETE] /:id
    async deleteUser(req, res, next) {
        try {
            const result = await User.deleteOne({ _id: req.params.id })
            if (result.deletedCount === 1) {
                return res.status(StatusCodes.ACCEPTED).json(responseFormat(true, {
                    message: 'Ban da xoa thanh cong!!!'
                }))
            } else {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: 'Nguoi dung khong ton tai'
                }))
            }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server deleteUser`,
                error: error, 
            }))
        }
    }

    //[GET] /
    // chưa dùng đến
    async getInfoUsers(req, res, next) {
        try {
            const user_id = await req.payload.userId
            const infoUser = await User.findOne({ _id: user_id})
            infoUser.password = undefined
            return res.status(StatusCodes.OK).json(responseFormat(true, 
                {message: `200 OK`},
                {infoUser}))
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server getInfoUsers`,
                error: error, 
            }))
        }
    }
}

module.exports = new UserController
