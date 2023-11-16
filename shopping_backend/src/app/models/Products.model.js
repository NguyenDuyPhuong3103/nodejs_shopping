const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema

// Create Products model
const products = new Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, unique: true },
    description: { type: String, require: true },
    brand: { type: String },
    price: { type: Number, require: true, default: 0 },
    quantity: { type: Number, require: true, default: 0 },
    sold: { type: Number, require: true, default: 0 },
    images: [{ type: String, default: [] }],
    color: { type: String, enum: ['Black', 'Grown', 'Yellow', 'Red'], default: 'undefined' },
    ratings: [{ star: { type: String }, postedBy: { type: Schema.Types.ObjectId, ref: 'users' }, comment: { type: String } }],
    totalNumber: { type: Number, default: 0 },
    sizes: [{ type: String, default: [] }],
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    shop: { type: Schema.Types.ObjectId, ref: 'shops' },
    category: { type: Schema.Types.ObjectId, ref: 'categories' },
}, {
    timestamps: true,
})

products.plugin(mongoosePaginate)

module.exports = mongoose.model('products', products)
