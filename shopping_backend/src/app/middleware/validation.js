const joi = require('joi')
const responseFormat = require('../../util/responseFormat.js')
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
        // shops: joi.array()
        //     .items(joi.string()),
        // products: joi.array()
        //     .items(joi.string()),
    }),

    productSchema: joi.object({
        title: joi.string()
            .required(),
        price: joi.number()
            .required(),
        color: joi.string(),
        sizes: joi.array()
            .items(joi.string()),
        images: joi.array()
            .items(joi.string()),
        description: joi.string(),
        // user: joi.string()
        //     .alphanum()
        //     .required(),
        // shop: joi.string()
        //     .alphanum()
        //     .required(),
        // category: joi.string()
        //     .alphanum()
        //     .required(),
    }),

    categorySchema: joi.object({
        name: joi.string()
            .required(),
        image: joi.string()
            .required(),
        description: joi.string(),
        // shop: joi.string()
        //     .required(),
        // products: joi.array()
        //     .items(joi.string()),
    }),

    shopSchema: joi.object({
        name: joi.string()
            .required(),
        avatar: joi.string(),
        description: joi.string(),
        classification: joi.string(),
        // user: joi.string()
        //     .required(),
        // categories: joi.array()
        //     .items(joi.string()),
        // products: joi.array()
        //     .items(joi.string()),
    }),
}

function validate(schema) {
    return async (req, res, next) => {
        try {
            await schema.validateAsync({ ...req.body, avatar: req.file?.path }, { allowUnknown: true })
            next()
        } catch (error) {
            if (req.file) {
                cloudinary.uploader.destroy(req.file.filename)
                return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, { message: 'Nội dung không hợp lệ !!!' }, error))
            }
        }
    }
}

module.exports = { validate, schemas }
