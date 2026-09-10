const { GraphQLError } = require("graphql")
const { randomUUID: uuid } = require("node:crypto")

const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      return args.genre
        ? Book.find({ genres: args.genre }).populate('author')
        : Book.find({}).populate('author')
    },
    allAuthors: async () => Author.find({})
  },
  Mutation: {
    addBook: async (root, args) => {
      const titleExists = await Book.exists({ title: args.title })

      if (titleExists) {
        throw new GraphQLError(`'${args.title}' already exists. Book title must be unique`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      const author = (await Author.findOne({ name: args.author }))
        || (await (new Author({ name: args.author })).save())

      const newBook = new Book({ ...args, author: author._id })
      await newBook.save()
      newBook.author = author
      return newBook
    },
    editAuthor: (root, args) => {
      const author = Author.find({ name: args.name })

      if (!author)
        return null

      author.born = args.setBornTo
      return author
    }
  }
}

module.exports = resolvers