const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');
const responseFormat = require('../../util/responseFormat.js');

const signAccessToken = async (userId) => {            /* user */ 
    return new Promise ((resolve, reject) => {
        const payload ={
            userId,
        }
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: '30s' //10m 10s
        }

        jwt.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        });
    });
}

const signRefreshToken = async (userId) => {
    return new Promise ((resolve, reject) => {
        const payload ={
            userId
        }
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn: '6m' //10m 10s
        }

        jwt.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        });
    });
}

const verifyAccessToken = async (req, res, next) => {
    if (!req.headers['authorization']) {
        return next( res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, { 
            message: `Khong co authorization o phan header duoc gui len tu client!!!` 
        })).end());
    }
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    //verify access token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            return res.status(StatusCodes.UNAUTHORIZED).json(responseFormat(false, { 
                message: `co loi o phan verifyAccessToken, token khong hop le!!!`,
                err: err,
            })).end();
        }
        req.payload = payload;
        next();
    }) 
}

const verifyAccessTokenWithAdmin = async (req, res, next) => {
    verifyAccessToken(req, res, next, ()=>{
        if (userId == req.params.id || req.user.admin){
            next();
        }else{
            return res.status(StatusCodes.FORBIDDEN).json(responseFormat(false, { 
                message: `Ban khong duoc phep xoa nguoi dung nay!!!` 
            })).end();
        }
    });
}

const verifyRefreshToken = async (refreshToken) => {
    return new Promise( (resolve, reject) => {
        //verify refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return next( res.status(StatusCodes.UNAUTHORIZED).json(responseFormat(false, { 
                message: `co loi o phan verifyToken!!!` 
            })).end());
            }
            resolve(payload);
        });
    });
}


module.exports = {
    signAccessToken, 
    verifyAccessToken, 
    signRefreshToken,
    verifyRefreshToken,
    verifyAccessTokenWithAdmin
}
