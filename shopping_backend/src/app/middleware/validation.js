const joi = require('joi');
const responseFormat = require('../../util/responseFormat.js');
const {StatusCodes} = require('http-status-codes');

const schemas = {
    userSchema : joi.object({
        email: joi.string()
            .email()
            .lowercase()
            .required(),
        password: joi.string()
            .min(4)
            .max(32)
            .required()
    }),

    productSchema : joi.object({
        name: joi.string()
            .required(),
        image: joi.string()
            .required(),
        description: joi.string(),
        classification: joi.string(),
        price: joi.string()
            .required(),
    }),
};

function validate(schema) {
    return async (req, res, next) => {
      try {
        await schema.validateAsync(req.body, { allowUnknown: true });
        next();
      } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, { message: error.message }));
      }
    }
};
  
module.exports = { validate, schemas };
