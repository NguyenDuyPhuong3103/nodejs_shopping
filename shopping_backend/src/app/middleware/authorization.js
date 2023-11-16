const { StatusCodes } = require('http-status-codes')
const responseFormat = require('../../utils/responseFormat.js')

const isAdmin = async (req, res, next) => {
    const { role } = req.user
    if (role !== 'admin') {
        return next(res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {
            message: `Yêu cầu phải là Admin!!!`
        })))
    }
    next()
}

module.exports = isAdmin