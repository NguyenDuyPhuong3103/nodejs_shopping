const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Products model
const products = new Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    description: String,
    classification: String,
    price: {type: String, required: true},
    user :  {type: Schema.Types.ObjectId, ref: 'users'},
    shop:  {type: Schema.Types.ObjectId, ref: 'shops'},
    category:  {type: Schema.Types.ObjectId, ref: 'categories'},
}, {
    timestamps: true,
})

module.exports = mongoose.model('products', products)
