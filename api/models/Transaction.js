const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
        required: true
    },
})

module.exports = mongoose.model('Transaction', transactionSchema);
