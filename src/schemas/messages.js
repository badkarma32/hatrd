const { Schema, model } = require('mongoose');

const Schema = new Schema({
    Guild: String,
    User: String,
    Messages: Number,
});

module.exports = model("messages", Schema);