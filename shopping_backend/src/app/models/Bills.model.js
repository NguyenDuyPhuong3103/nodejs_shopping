const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Categories model
const bills = new Schema({
    products:
        [{
            product: { type: Schema.Types.ObjectId, ref: 'products' },
            productName: { type: String },
            productPrice: { type: Number },
            count: { type: Number },
            color: { type: String },
            total: { type: Number }
        }],
    status: { type: String, default: 'Processing', enum: ['Cancelled', 'Processing', 'Succeed'] },
    total: { type: Number },
    orderBy: { type: Schema.Types.ObjectId, ref: 'users' },
})

module.exports = mongoose.model('bills', bills)
