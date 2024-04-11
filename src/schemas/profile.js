const { Schema, model } = require('mongoose');

const profileSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  favoriteSong: { type: String, required: true },
  about: { type: String, required: true },
  birthday: { type: Date, required: false },
  hobbies: { type: String, required: false },
  favoriteGame: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model("Profile", profileSchema);