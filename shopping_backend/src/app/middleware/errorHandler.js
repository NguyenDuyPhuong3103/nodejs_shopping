const responseFormat = require('../../util/responseFormat')

const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found!`)
    res.status(404)
    next(error)
}

const errHandler = (error, req, res, next) => {
    if (req.file) {
        cloudinary.uploader.destroy(req.file.filename)
    }
    const statusCodes = res.statusCodes === 200 ? 500 : res.statusCodes
    return res.status(statusCodes).json(responseFormat(false, {
        message: error?.message
    }))
}

module.exports = {
    notFound,
    errHandler
}