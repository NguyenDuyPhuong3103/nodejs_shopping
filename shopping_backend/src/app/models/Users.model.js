const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const crypto = require('crypto')

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
    cart: [{
        product: { type: Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number },
        color: { type: String }
    }], //giỏ hàng
    role: { type: String, default: 'user' }, // phân quyền
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'products' }], //lưu những sản phẩm yêu thích
    isBlocked: { type: Boolean, default: false }, // tài khoản bị khóa hay không
    refreshToken: { type: String },
    passwordChangeAt: { type: String }, // truong hop quen password
    passwordResetToken: { type: String }, // trường hợp quên password, trước đó ta tạo một token rồi lưu vào trong db (nhiệm vụ của token này là phòng trường hợp muốn reset lại mk). Khi ta gửi mail về cho user thì họ click vào link đó thì họ sẽ gửi api kèm token chứa password qua email đó de xac nhan
    passwordResetExpires: { type: String }, // thời gian hết hạn của token chứa password reset
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

users.methods.createPasswordChangedToken = async function () {
    try {
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires = Date.now() + 15 * 60 * 60 * 1000 //giờ hiện tại cộng thêm 15p
        return resetToken
    } catch (error) {
        console.log(error)
    }
}

module.exports = mongoose.model('users', users);
