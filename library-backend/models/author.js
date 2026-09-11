const mongoose = require('mongoose')

const NAME_MIN_LENGTH = 4

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: NAME_MIN_LENGTH,
  },
  born: {
    type: Number,
  },
})

const Author = mongoose.model('Author', schema)
module.exports = { Author, NAME_MIN_LENGTH }