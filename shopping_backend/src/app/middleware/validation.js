const joi = require('joi')
const responseFormat = require('../../utils/responseFormat.js')
const { StatusCodes } = require('http-status-codes')
const cloudinary = require('cloudinary').v2

const schemas = {
    userSchema: joi.object({
        email: joi.string()
            .email()
            .lowercase()
            .required(),
        password: joi.string()
            .min(4)
            .max(32)
            .required(),
        name: joi.string()
            .min(2)
            .max(40)
            .lowercase(),
        sex: joi.string(),
        phone: joi.string(),
        birth_year: joi.date(),
        address: joi.string(),
        avatar: joi.string(),
    }),

    productSchema: joi.object({
        title: joi.string()
            .required(),
        description: joi.string()
            .required(),
        price: joi.number()
            .required(),
        color: joi.string(),
        brand: joi.string(),
        price: joi.number()
            .required(),
        quantity: joi.number()
            .required(),
        sold: joi.number()
            .required(),
        images: joi.array()
            .items(joi.string()),
        color: joi.string(),
        sizes: joi.array()
            .items(joi.string()),
    }),

    categorySchema: joi.object({
        name: joi.string()
            .required(),
    }),

    shopSchema: joi.object({
        name: joi.string()
            .required(),
        avatar: joi.string(),
        description: joi.string(),
        classification: joi.string(),
    }),

    billSchema: joi.object({
        products: joi.array()
            .required(),
        status: joi.string(),
        paymentIntent: joi.object()
            .required(),
        orderBy: joi.string()
            .required(),
    }),
}

function validate(schema) {
    return async (req, res, next) => {
        try {
            await schema.validateAsync({ ...req.body, avatar: req.file?.path }, { allowUnknown: true })
            next()
        } catch (error) {
            console.log(error)
            if (req.file) {
                cloudinary.uploader.destroy(req.file.filename)
            }
            return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, { message: 'Nội dung không hợp lệ !!!' }, error))
        }
    }
}

module.exports = { validate, schemas }
