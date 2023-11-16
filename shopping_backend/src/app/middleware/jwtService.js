const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
const responseFormat = require('../../utils/responseFormat.js')

//signAccessToken === generateAccessToken
const signAccessToken = async (userId, role) => {
    return new Promise((resolve, reject) => {
        const payload = {
            _id: userId,
            role
        }
        const secret = process.env.ACCESS_TOKEN_SECRET
        const options = {
            expiresIn: '1h' //10m 10s
        }

        jwt.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

const signRefreshToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            _id: userId
        }
        const secret = process.env.REFRESH_TOKEN_SECRET
        const options = {
            expiresIn: '6m' //10m 10s
        }

        jwt.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

const verifyAccessToken = async (req, res, next) => {
    if (!req.headers['authorization']) {
        return next(res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
            message: `Khong co authorization o phan header duoc gui len tu client!!! (Bạn chưa đặng nhập. Vui lòng đăng nhập và thử lại!!!)`
        })))
    }
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
            return res.status(StatusCodes.UNAUTHORIZED).json(responseFormat(false, {
                message: `co loi o phan verifyAccessToken, token khong hop le!!!`,
                err: err,
            }))
        }
        req.user = decode
        next()
    })
}

const verifyRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        //verify refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if (err) reject(err)
            resolve(decode)
        })
    })
}


module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
}
