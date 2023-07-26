const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create model
const Course = new Schema({
    name: {type: String, required: true},
    description: {type: String, maxLength: 600},
    image: {type: String, maxLength: 255},
    videoId: {type: String, required: true},
    level: {type: String, maxLength: 255},
    slug: { type: String, slug: 'name', unique: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Course', Course);
