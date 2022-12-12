const mongoose = require('mongoose');
const barkSchema = new mongoose.Schema({
    bid: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    text: {
        type: String,
    },
    recipient: {
        type: String,
    }
})

module.exports = mongoose.model('Bark', barkSchema);