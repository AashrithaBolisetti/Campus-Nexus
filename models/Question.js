const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    text: String,
    answered: Boolean,
    answer: String
});

module.exports = mongoose.model("Question", questionSchema);