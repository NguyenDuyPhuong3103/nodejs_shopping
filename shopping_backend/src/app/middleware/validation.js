const joi = require('joi')
const responseFormat = require('../../util/responseFormat.js')
const {StatusCodes} = require('http-status-codes')

const schemas = {
    userSchema : joi.object({
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
        avatar: joi.string()
            .lowercase(),
        sex: joi.string()
            .min(2)
            .max(3),
        phone: joi.string()
            .min(10)
            .max(13),
        birth_year : joi.date()
            .min(1940)
            .max(2008),
        address: joi.string()
            .min(4)
            .max(70),
        // shops: Joi.array()
        //     .items(Joi.string()),
        // products: Joi.array()
        //     .items(Joi.string()),
    }),

    productSchema : joi.object({
        name: joi.string()
            .required(),
        image: joi.string(),
        description: joi.string(),
        classification: joi.string(),
        price: joi.string()
            .required(),
        // user: Joi.string()
        //     .required(),
        // shop: Joi.string()
        //     .required(),
        // category: Joi.string(),
    }),

    categorySchema : joi.object({
        name: joi.string()
            .required(),
        image: joi.string()
            .required(),
        description: joi.string(),
        // shop: Joi.string()
        //     .required(),
        // products: Joi.array()
        //     .items(Joi.string()),
    }),

    shopSchema : joi.object({
        name: joi.string()
            .required(),
        image: joi.string(),
        description: joi.string(),
        classification: joi.string(),
        // user: Joi.string()
        //     .required(),
        // categories: Joi.array()
        //     .items(Joi.string()),
        // products: Joi.array()
        //     .items(Joi.string()),
    }),
}

function validate(schema) {
    return async (req, res, next) => {
      try {
        await schema.validateAsync(req.body, { allowUnknown: true })
        next()
      } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, { message: error.message, data: 'sai o day' }))
      }
    }
}
  
module.exports = { validate, schemas }
