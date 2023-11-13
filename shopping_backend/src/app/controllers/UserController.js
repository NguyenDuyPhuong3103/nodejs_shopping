const User = require('../models/Users.model')
const RefreshTokenModel = require('../models/RefreshTokens.model')
const responseFormat = require('../../util/responseFormat.js')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../middleware/jwtService')
const { StatusCodes } = require('http-status-codes')
const cloudinary = require('cloudinary').v2
const getFileName = require('../middleware/getFileName')

class UserController {

    //[POST] /register
    async register(req, res, next) {
        try {
            const { email, password } = req.body

            const isExits = await User.findOne({ email })
            if (isExits) {
                return res.status(StatusCodes.OK).json(responseFormat(false, {
                    message: `${email} da ton tai, vui long nhap email khac!!!`
                }))
            }
            req.body.avatar = req.file?.path

            const user = new User(req.body)

            const saveUser = await user.save()

            if (!saveUser) {
                cloudinary.uploader.destroy(req.file.filename)
                return res.status(StatusCodes.OK).json(responseFormat(false, {
                    message: 'Lỗi khi tạo người dùng!!!'
                }))
            }

            return res.status(StatusCodes.CREATED).json(responseFormat(true, {
                message: 'Ban da dang ky thanh cong. Vui long dang nhap tai khoan !!!'
            }, saveUser))
        } catch (error) {
            if (req.file) {
                cloudinary.uploader.destroy(req.file.filename)
                console.log(error)
                return res.status(StatusCodes.OK).json(responseFormat(false, {
                    message: `Co loi o server register`,
                    error: error,
                }))
            }
        }
    }

    // [PUT] /user
    async updateUser(req, res, next) {
        try {

            if (req.file) req.body.avatar = req.file?.path

            const user = await User.findById(req.params.id)
            if (user) {
                const oldAvatar = getFileName(user.avatar)
                cloudinary.uploader.destroy(oldAvatar)
            }

            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
            if (!updatedUser) {
                cloudinary.uploader.destroy(req.file.filename)
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: `Khong cap nhat duoc user`,
                }))
            }

            return res.status(StatusCodes.OK).json(responseFormat(true, {
                message: `Cap nhat thanh cong user`
            }, updatedUser))
        } catch (error) {
            if (req.file) {
                cloudinary.uploader.destroy(req.file.filename)
                console.log(error)
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                    message: `Co loi o server updateShop`,
                    error: error,
                }))
            }
        }
    }

    //[POST] /login
    // Đăng nhập vào tài khoản đã đăng ký
    // Tạo AccessToken và RefreshToken
    // AccessToken: 
    async login(req, res, next) {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ email })
                .populate("shops")
                .populate("products")

            if (!user) {
                return res.status(StatusCodes.OK).json(responseFormat(false, {
                    message: `Email khong ton tai, vui long nhap lai!!!`
                }))
            }

            const isValid = await user.isCheckPassword(password)

            if (!isValid) {
                return res.status(StatusCodes.OK).json(responseFormat(false, {
                    message: `Password sai, vui long nhap lai!!!`
                }))
            }

            const accessToken = await signAccessToken(user._id, user.role)
            const refreshToken = await signRefreshToken(user._id)

            //Lưu refreshToken vào database
            await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true })

            //Lưu refreshToken vào cookie ( thời gian hết hạn : 7 ngày)
            await res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 6 * 30 * 24 * 60 * 60 * 1000 })

            user.password = undefined
            user.role = undefined

            return res.status(StatusCodes.ACCEPTED).json(responseFormat(true, {
                message: 'Ban da dang nhap thanh cong!!!'
            }, {
                user,
                accessToken
            }))
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server login`,
                error: error,
            }))
        }
    }

    //[GET] /
    // chưa dùng đến
    async getInfoUser(req, res, next) {
        try {
            const { _id } = await req.user
            const infoUser = await User.findById(_id).select('-refreshToken -password -role')
            return res.status(StatusCodes.OK).json(responseFormat(true,
                { message: `200 OK` },
                { infoUser }))
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server getInfoUser`,
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
            //Lấy token từ cookie
            const cookie = req.cookies
            if (!cookie && !cookie.refreshToken) {
                return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
                    message: `Khong tim thay refreshToken trong cookie o server!!`
                }))
            }

            //Check token có hợp lệ hay ko? Nếu có thì lấy dữ liệu đã được verify ra
            //dataVerify chính là _id
            const dataVerify = await verifyRefreshToken(cookie.refreshToken)

            //Check xem token có khớp với token đã lưu trong db
            const user = await User.findOne({ _id: dataVerify._id, refreshToken: cookie.refreshToken })

            if (!user) {
                return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
                    message: `Không tìm thấy user hợp lệ !!!`
                }))
            } else {
                const newAccessToken = await signAccessToken(user._id, user.role)
                const newRefreshToken = await signRefreshToken(user._id)
                await User.findOneAndUpdate({ token: req.cookies }, { token: newRefreshToken }, { new: true })

                await res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 6 * 30 * 24 * 60 * 60 * 1000 })

                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: `Refresh Token thanh cong!!!`
                }, { newAccessToken }))
            }
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server refreshToken`,
                error: error,
            }))
        }
    }

    //[DELETE] /logout
    async logout(req, res, next) {

        try {
            //Tìm và xóa refresh token ở db
            const deletedUser = await User.findOneAndUpdate({ refreshToken: req.cookies.refreshToken }, { refreshToken: '' }, { new: true })
            if (deletedUser) {
                //Xóa refresh token ở cookie trình duyệt
                await res.clearCookie('refreshToken', {
                    httpOnly: true,
                    secure: true
                })

                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: 'Ban da dang xuat thanh cong!!!'
                }))
            } else {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
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

    //[DELETE] /reset
    // 1./ Client gửi mail
    // 2./ Server check xem mail có hợp lệ hay không => gửi mail + kèm theo link (password change token)
    // 3./ Client check mail => click link
    // 4./ Client gửi api kèm token
    // 5./ Check token có giống với token mà server gửi mail hay không
    // 6./ Change password

    async resetPassword(req, res, next) {
        const { email } = req.query


        try {
            //Tìm và xóa refresh token ở db
            const deletedUser = await User.findOneAndUpdate({ refreshToken: req.cookies.refreshToken }, { refreshToken: '' }, { new: true })
            if (deletedUser) {
                //Xóa refresh token ở cookie trình duyệt
                await res.clearCookie('refreshToken', {
                    httpOnly: true,
                    secure: true
                })

                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: 'Ban da dang xuat thanh cong!!!'
                }))
            } else {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
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

            const user = await User.findById(req.params.id)
            if (user) {
                const cloudinaryAvatar = getFileName(user.avatar)
                cloudinary.uploader.destroy(cloudinaryAvatar)
            }

            const result = await User.deleteOne({ _id: req.params.id })
            if (result.deletedCount === 1) {
                return res.status(StatusCodes.ACCEPTED).json(responseFormat(true, {
                    message: 'Ban da xoa thanh cong!!!'
                }))
            } else {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: 'Nguoi dung khong ton tai'
                }, result))
            }
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
                message: `Co loi o server deleteUser`,
                error: error,
            }))
        }
    }
}

module.exports = new UserController
