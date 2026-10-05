const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    phone: String
});

module.exports = mongoose.model("Item", itemSchema);