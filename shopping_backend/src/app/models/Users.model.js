const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const { boolean } = require('joi');

// Create Users model
const users = new Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    // admin: {
    //     type: Boolean,
    //     default: false
    // }
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
