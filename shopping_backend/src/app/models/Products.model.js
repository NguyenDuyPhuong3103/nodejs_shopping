const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema

// Create Products model
const products = new Schema({
    name: {type: String, required: true},
    image: String,
    images: [String], 
    description: String,
    classification: String,
    price: {type: String, required: true},
    user :  {type: Schema.Types.ObjectId, ref: 'users'},
    shop:  {type: Schema.Types.ObjectId, ref: 'shops'},
    category:  {type: Schema.Types.ObjectId, ref: 'categories'},
}, {
    timestamps: true,
})

products.plugin(mongoosePaginate)

module.exports = mongoose.model('products', products)
