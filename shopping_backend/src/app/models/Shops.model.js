const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Shops model
const shops = new Schema({
    name: { type: String, required: true, unique: true },
    classification: { type: String, default: 'unclassified' },
    avatar: String,
    address: { type: String, required: true },
    description: { type: String, default: 'undefined' },
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    categories: [{ type: Schema.Types.ObjectId, ref: 'categories' }],
    products: [{ type: Schema.Types.ObjectId, ref: 'products' }],
}, {
    timestamps: true,
})

module.exports = mongoose.model('shops', shops)
