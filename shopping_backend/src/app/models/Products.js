const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create model
const products = new Schema({
    name: {type: String, required: true},
    image: {type: String, maxLength: 255},
    description: {type: String, maxLength: 600},
    classification: {type: String, maxLength: 600},
    price: {type: String, maxLength: 600},
}, {
    timestamps: true,
});

module.exports = mongoose.model('products', products);
