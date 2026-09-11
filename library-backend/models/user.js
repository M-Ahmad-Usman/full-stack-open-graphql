const mongoose = require('mongoose')

const USERNAME_MIN_LENGTH = 3

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: USERNAME_MIN_LENGTH
  },
  favoriteGenre: String
})

const User = mongoose.model('User', schema)

module.exports = { User, USERNAME_MIN_LENGTH }