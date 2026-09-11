const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

// From library-backend/models
const AUTHOR_NAME_MIN_LENGTH = 4
const BOOK_TITLE_MIN_LENGTH = 5
const USER_USERNAME_MIN_LENGTH = 3

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      return args.genre
        ? Book.find({ genres: args.genre }).populate('author')
        : Book.find({}).populate('author')
    },
    allAuthors: async () => Author.find({}),
    me: async (root, args, context) => context.currentUser
  },
  Mutation: {
    addBook: async (root, args, context) => {

      if (!context.currentUser)
        throw new GraphQLError('not authenticated. Please login first.')

      const normalizedTitle = args.title.replace(/\s+/g, ' ').trim()
      const normalizedAuthor = args.author.replace(/\s+/g, ' ').trim()

      if (normalizedTitle < BOOK_TITLE_MIN_LENGTH)
        throw new GraphQLError(`Title too small. Minimum ${BOOK_TITLE_MIN_LENGTH} characters are required`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: normalizedTitle
          }
        })

      const titleExists = await Book.exists({ title: normalizedTitle })
      if (titleExists) {
        throw new GraphQLError(`'${normalizedTitle}' already exists. Book title must be unique`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: normalizedTitle
          }
        })
      }

      // An author with name less than 4 characters cannot be created
      // and wouldn't exist
      if (normalizedAuthor < AUTHOR_NAME_MIN_LENGTH)
        throw new GraphQLError(`Author name is too small. Name at minimum must be of ${AUTHOR_NAME_MIN_LENGTH} characters`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: normalizedAuthor
          }
        })

      const author = (await Author.findOne({ name: args.author }))
        || (await (new Author({ name: args.author })).save())

      const newBook = new Book({ ...args, author: author._id })
      await newBook.save()
      newBook.author = author
      return newBook
    },
    editAuthor: async (root, args, context) => {

      if (!context.currentUser)
        throw new GraphQLError('not authenticated. Please login first.')

      const author = await Author.findOne({ name: args.name })

      if (!author)
        return null

      author.born = args.setBornTo
      return author.save()
    },
    createUser: async (root, args) => {
      const normalizedUsername = args.username.replace(/\s+/g, ' ').trim()
      const normalizedFavoriteGenre = args.favoriteGenre.replace(/\s+/g, ' ').trim()

      if (normalizedUsername.length < USER_USERNAME_MIN_LENGTH)
        throw new GraphQLError(`username too small. Minimum ${USER_USERNAME_MIN_LENGTH} characters are required`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: normalizedUsername
          }
        })

      const userExists = await User.exists({ username: normalizedUsername })
      if (userExists)
        throw new GraphQLError('User already exists. username must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: normalizedUsername
          }
        })

      const user = new User({
        username: normalizedUsername,
        favoriteGenre: normalizedFavoriteGenre
      })

      return user.save()
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret')
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })

      const tokenPayload = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(tokenPayload, process.env.JWT_SECRET) }
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test')
        throw new GraphQLError('_resetDatabse is only available in test mode')

      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})

      return true
    },
  }
}

module.exports = resolvers