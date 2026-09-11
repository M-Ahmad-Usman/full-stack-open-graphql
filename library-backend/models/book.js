const mongoose = require('mongoose')

const TITLE_MIN_LENGTH = 5

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: TITLE_MIN_LENGTH,
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },
  genres: [{ type: String }],
})

const Book = mongoose.model('Book', schema)
module.exports = { Book, TITLE_MIN_LENGTH }