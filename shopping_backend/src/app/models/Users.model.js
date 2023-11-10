const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

// Create Users model
const users = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    sex: { type: String },
    phone: { type: String },
    birth: { type: Date },
    address: { type: String, default: 'undefined' },
    avatar: { type: String },
    cart: { type: Array, default: [] }, //giỏ hàng
    role: { type: String, default: 'user' }, // phân quyền
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'products' }], //lưu những sản phẩm yêu thích
    isBlocked: { type: Boolean, default: false }, // tài khoản bị khóa hay không
    refreshToken: { type: String },
    passwordChangeAt: { type: String }, // truong hop quen password
    passwordResetToken: { type: String }, // gui password qua email de xac nhan
    passwordResetExpires: { type: String }, // thời gian hết hạn
    shops: [{ type: Schema.Types.ObjectId, ref: 'shops' }],
    products: [{ type: Schema.Types.ObjectId, ref: 'products' }],
}, {
    timestamps: true,
})

users.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            next()
        }
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
