const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Products model
const products = new Schema({
    name: {
        type: String
    },
    image: {
        type: String   
    },
    description: {
        type: String 
    },
    classification: {
        type: String 
    },
    price: {
        type: String 
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('products', products);
