const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Shops model
const shops = new Schema({
    name: { type: String, required: true, unique: true },
    classification: { type: String, default: 'unclassified' },
    avatar: String,
    address: { type: String, required: true },
    description: { type: String, default: 'undefined' },
    numberViews: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    categories: [{ type: Schema.Types.ObjectId, ref: 'categories' }],
    products: [{ type: Schema.Types.ObjectId, ref: 'products' }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

module.exports = mongoose.model('shops', shops)
