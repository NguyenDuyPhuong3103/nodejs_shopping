const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Categories model
const categories = new Schema({
    name: {type: String, required: true},
    description: String,
    image: String,
    shop:  {type: Schema.Types.ObjectId, ref: 'shops'} ,
    products:[{
        product: {type: Schema.Types.ObjectId, ref: 'Product'}
    }], 
}, {
    timestamps: true,
});

module.exports = mongoose.model('categories', categories);
