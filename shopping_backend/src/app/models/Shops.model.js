const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Shops model
const shops = new Schema({
    name: {type: String, required: true},
    classification: String,
    image: [String],
    address: {type: String, required: true},
    description: String,
    user :  {type: Schema.Types.ObjectId, ref: 'users'},
    categories:  [{type: Schema.Types.ObjectId, ref: 'categories'}],
    products:[{type: Schema.Types.ObjectId, ref: 'products'}],
}, {
    timestamps: true,
})

module.exports = mongoose.model('shops', shops)
