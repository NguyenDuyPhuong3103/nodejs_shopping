const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Create Users model
const users = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    sex: String,
    phone: String,
    birth: Date,
    address: String,
    avatar: String,
    shops:[{
        shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
    }],
    products:[{
        product: {type: Schema.Types.ObjectId, ref: 'Product'}
    }],
}, {
    timestamps: true,
});

users.pre('save', async function(next) {
    try {
        console.log(`Called before save :::: `, this.username, this.password);
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password, salt);
        this.password = hashPassword;
        next();
    } catch (error) {
        next(error);
    }
});

users.methods.isCheckPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.log(error);
    }
};

module.exports = mongoose.model('users', users);
