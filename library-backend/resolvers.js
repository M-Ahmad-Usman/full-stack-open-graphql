const { GraphQLError } = require("graphql")
const { randomUUID: uuid } = require("node:crypto")

const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // const { author, genre } = args
      return Book.find({})
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

      const author = (await Author.exists({ name: args.author }))
        || (await (new Author({ name: args.author })).save())

      const newBook = new Book({ ...args, author: author._id })
      return newBook.save()
    },
    editAuthor: (root, args) => {
      const author = authors.find(author => author.name === args.name)

      if (!author)
        return null

      author.born = args.setBornTo
      return author
    }
  },
  Author: {
    bookCount: (root) => getBookCountOfAuthor(root.name)
  }
}

// Utils
const getBookCountOfAuthor = (name) => books.reduce((bookCount, book) => book.author === name ? bookCount + 1 : bookCount, 0)

module.exports = resolvers