const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

// Create Users model
const users = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    sex: String,
    phone: String,
    birth: Date,
    address: { type: String, default: 'undefined' },
    avatar: String,
    shops: [{ type: Schema.Types.ObjectId, ref: 'shops' }],
    products: [{ type: Schema.Types.ObjectId, ref: 'products' }],
}, {
    timestamps: true,
})

users.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(this.password, salt)
        this.password = hashPassword
        next()
    } catch (error) {
        next(error)
    }
})

users.methods.isCheckPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        console.log(error)
    }
};

module.exports = mongoose.model('users', users);
