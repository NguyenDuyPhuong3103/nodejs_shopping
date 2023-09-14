//import collection (Products) in mongoDB compass => Products export model (Schema)
const Product = require('../models/Products.model');
//import collection (Users) in mongoDB compass => Users export model (Schema)
const User = require('../models/Users.model');
//import collection (RefreshTokens) in mongoDB compass => RefreshTokens export model (Schema)
const RefreshTokenModel = require('../models/RefreshTokens.model');

const responseFormat = require('../../util/responseFormat.js');

const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../middleware/jwtService');

const {StatusCodes} = require('http-status-codes');

class UserController {

    //[POST] /register
    async register(req, res, next) {
        try {
            const { email, password } = req.body;

            const isExits = await User.findOne({
                username: email
            });

            if (isExits) {
                return res.status(StatusCodes.CONFLICT).json(responseFormat(false, { 
                    message: `${email} da ton tai, vui long nhap email khac!!!` 
                })).end();
            };

            const user = new User({
                username: email,
                password,
            });

            const saveUser = await user.save()

            if (!saveUser) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                    message: 'Lỗi khi tạo người dùng!!!' 
                })).end();
            }

            return res.status(StatusCodes.CREATED).json(responseFormat(true, {
                message: 'Ban da dang ky thanh cong!!!'
            }, saveUser)).end();
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server register`,
                error: error, 
            })).end();
        }
    }

    //[POST] /login
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            
            const user = await User.findOne({
                username: email
            });

            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `email hoac password sai, vui long nhap lai!!!` 
                })).end();
            };

            const isValid = await user.isCheckPassword(password);

            if (!isValid) {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
                    message: `email hoac password sai, vui long nhap lai!!!` 
                })).end();
            }

            const accessToken = await signAccessToken(user._id);
            const refreshToken = await signRefreshToken(user._id);

            // const accessToken = await signAccessToken({_id: user._id, admin:  user.admin});
            // const refreshToken = await signRefreshToken({_id: user._id, admin:  user.admin});

            const tokenInSchema = await RefreshTokenModel.findOne({user: user._id});
            if(!tokenInSchema) {
                const refreshTokenModel = new RefreshTokenModel({
                    token: refreshToken,
                    user: user._id,
                });
                await refreshTokenModel.save();
            } else {
                let newRefreshToken = await RefreshTokenModel.findOneAndUpdate(
                    {user: user._id},
                    {token: refreshToken},
                    {new: true}
                );
            }

            await res.cookie("refreshToken", refreshToken, {
                httpOnly:true,
                secure:false,
                path:"/",
                sameSite: "None",
            })
            console.log('dong 105, refreshToken:::', refreshToken);

            return res.status(StatusCodes.ACCEPTED).json(responseFormat(true, {
                message: 'Ban da dang nhap thanh cong!!!'
            }, {
                accessToken,
                timeExpired: Date.now() + (30 * 1000)
                // refreshToken,
            })).end();
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server login`,
                error: error, 
            })).end();
        }
    }

    //[POST] /refresh-token
        /*
        1./ Take refresh token from user
        2./ Create new access token and new refresh token
        */
    async refreshToken(req, res, next) {
        // try {
        //     const refreshToken = req.cookies.refreshToken;
        //     console.log(req.cookies);
        //     if (!refreshToken){
        //         return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, { 
        //             message: `Khong tim thay refreshToken trong cookie o server!!` 
        //         })).end();
        //     }

        //     const {userId} = await verifyRefreshToken(refreshToken);
            
        //     const findToken = await RefreshTokenModel.findOne({token: refreshToken});
        //     if (!findToken){
        //         return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, { 
        //             message: `refreshToken khong hop le!!` 
        //         })).end();
        //     } else {
        //         const accessToken = await signAccessToken(userId);
        //         const newRef = await signRefreshToken(userId);
        //         let newRefreshToken = await RefreshTokenModel.findOneAndUpdate(
        //             {token: refreshToken},
        //             {token: newRef},
        //             {new: true}
        //         );

        //         res.cookie("refreshToken", newRef, {
        //             httpOnly:true,
        //             secure:false,
        //             path:"/",
        //             sameSite: "none",
        //         })

        //         return res.status(StatusCodes.OK).json(responseFormat(true, { 
        //             message: `Refresh Token thanh cong!!!`},{
        //                 accessToken,
        //                 timeExpired: Date.now() + (60 * 1000)
        //             })).end();
        //     }
        // } catch (error) {
        //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
        //         message: `Co loi o server refreshToken`,
        //         error: error, 
        //     })).end();
        // }
        return res.send(req.cookies.refreshToken);
    }

    //[DELETE] /logout
    async logout(req, res, next) {
        await res.clearCookie("refreshToken");
        
        try {
            const deletedUser = await RefreshTokenModel.findOneAndDelete({token: req.cookies.refreshToken});
            if (deletedUser) {
                return res.status(StatusCodes.OK).json(responseFormat(true, {
                    message: 'Ban da dang xuat thanh cong!!!'
                }));
            } else {
                return res.status(StatusCodes.	NOT_FOUND).json(responseFormat(false, { 
                    message: `Co loi o server logout, khong tim thay refreshToken`,
                })).end();
            }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server Log out`,
                error: error, 
            })).end();
        }
    }

    // [DELETE] /:id
    async deleteUser(req, res, next) {
        try {
            const result = await User.deleteOne({ _id: req.params.id });
            if (result.deletedCount === 1) {
                return res.status(StatusCodes.ACCEPTED).json(responseFormat(true, {
                    message: 'Ban da xoa thanh cong!!!'
                }));
            } else {
                return res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
                    message: 'Nguoi dung khong ton tai'
                }));
            }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server deleteUser`,
                error: error, 
            }));
        }
    }

    //[GET] /set-cookie 
    async setCookie(req, res, next) {
        res.cookie("phuongpro", 'phuongphungphinh');
        res.send('cookie is set phuongpro = phuongphungphinh')
    }

    //[GET] /get-cookie 
    async getCookie(req, res, next) {
        const refreshToken_v = await req.cookies.refreshToken;
        console.log('dong 226:::',refreshToken_v);
        console.log('dong 227:::',req.cookies);
        return res.status(StatusCodes.ACCEPTED).json(responseFormat(true, {
            message: 'lay duoc refresh token !!!'
        }, {
            refreshToken_v,
        })).end();
    }

    //[GET] /
    async getAllUsers(req, res, next) {
        try {
            const users = await User.find();
            return res.status(StatusCodes.OK).json(responseFormat(true, 
                {message: `200 OK`},
                {users})).end();
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, { 
                message: `Co loi o server getAllUsers`,
                error: error, 
            })).end();
        }
    }
}

module.exports = new UserController;
