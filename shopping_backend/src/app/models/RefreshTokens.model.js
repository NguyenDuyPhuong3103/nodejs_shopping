const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create RefreshTokens model
const refreshTokens = new Schema({
    token: {
        type: String,
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: "users",
    }
})

module.exports = mongoose.model('refreshTokens', refreshTokens)
