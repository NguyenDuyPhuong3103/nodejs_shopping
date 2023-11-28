const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Categories model
const bills = new Schema({
    products: [{ product: { type: mongoose.Types.ObjectId, ref: 'products' }, count: Number, color: String }],
    status: { type: String, default: 'Processing', enum: ['Cancelled', 'Processing', 'Successed'] },
    paymentIntent: {},
    orderBy: { type: Schema.Types.ObjectId, ref: 'users' },
})

module.exports = mongoose.model('bills', bills)
