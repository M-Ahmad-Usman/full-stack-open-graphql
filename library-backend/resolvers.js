const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const { Author, NAME_MIN_LENGTH } = require('./models/author')
const { Book, TITLE_MIN_LENGTH } = require('./models/book')
const { User, USERNAME_MIN_LENGTH } = require('./models/user')

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
    me: async (root, args, context) => context.loggedInUser
  },
  Mutation: {
    addBook: async (root, args, context) => {

      if (!context.loggedInUser)
        throw new GraphQLError('Unauthenticated. Please login first.')

      const normalizedTitle = args.title.replace(/\s+/g, ' ').trim()
      const normalizedAuthor = args.author.replace(/\s+/g, ' ').trim()

      if (normalizedTitle < TITLE_MIN_LENGTH)
        throw new GraphQLError(`Title too small. Minimum ${TITLE_MIN_LENGTH} characters are required`, {
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
      if (normalizedAuthor < NAME_MIN_LENGTH)
        throw new GraphQLError(`Author name is too small. Name at minimum must be of ${NAME_MIN_LENGTH} characters`, {
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
    editAuthor: (root, args, context) => {

      if (!context.loggedInUser)
        throw new GraphQLError('Unauthenticated. Please login first.')

      const author = Author.find({ name: args.name })

      if (!author)
        return null

      author.born = args.setBornTo
      return author
    },
    createUser: async (root, args) => {
      const normalizedUsername = args.username.replace(/\s+/g, ' ').trim()
      const normalizedFavoriteGenre = args.favoriteGenre.replace(/\s+/g, ' ').trim()

      if (normalizedUsername.length < USERNAME_MIN_LENGTH)
        throw new GraphQLError(`username too small. Minimum ${USERNAME_MIN_LENGTH} characters are required`, {
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

      if (!user || args.password !== 'secret123')
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })

      const tokenPayload = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(tokenPayload, process.env.JWT_SECRET) }
    }
  }
}

module.exports = resolvers