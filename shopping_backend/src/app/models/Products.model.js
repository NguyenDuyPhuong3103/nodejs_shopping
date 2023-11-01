const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema

// Create Products model
const products = new Schema({
    title: {type: String, required: true, unique: true},
    price: {type: String, default: '0'},
    color: {type: String, default: 'undefined'},
    sizes: [{type: String, default: [] }],
    images: [{type: String, default: [] }],
    description: [{type: String, default: [] }],
    user:  {type: Schema.Types.ObjectId, ref: 'users'},
    shop:  {type: Schema.Types.ObjectId, ref: 'shops'},
    category:  {type: Schema.Types.ObjectId, ref: 'categories'},
}, {
    timestamps: true,
})

products.plugin(mongoosePaginate)

module.exports = mongoose.model('products', products)
