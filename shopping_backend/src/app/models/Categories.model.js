const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Categories model
const categories = new Schema({
    name: {type: String, default: 'UnCategorized',},
    shop: {type: Schema.Types.ObjectId, ref: 'shops'} ,
    products: [{type: Schema.Types.ObjectId, ref: 'products'}],
}, {
    timestamps: true,
})

module.exports = mongoose.model('categories', categories)
