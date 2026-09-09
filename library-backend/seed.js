const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')

const MONGODB_URI = process.env.MONGODB_URI

const authors = [
  { name: "Robert Martin", born: 1952 },
  { name: "Martin Fowler", born: 1963 },
  { name: "Fyodor Dostoevsky", born: 1821 },
  { name: "Joshua Kerievsky" },
  { name: "Sandi Metz" }
]

const books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "revolution"],
  },
]

async function main() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    await Promise.all([Author.deleteMany(), Book.deleteMany()])

    const savedAuthors = await Author.insertMany(authors)
    console.log(`Seeded ${savedAuthors.length}`)

    const authorNameIdMap = new Map(savedAuthors.map(author => [author.name, author._id]))

    const booksWithAuthorIds = books.map((book) => {
      const authorId = authorNameIdMap.get(book.author)
      if (!authorId) {
        throw new Error(`Author not found for book: "${book.title}"`)
      }
      return {
        ...book,
        author: authorId,
      }
    })

    const savedBooks = await Book.insertMany(booksWithAuthorIds)
    console.log(`Seeded ${savedBooks.length}`)

    console.log('Seeding completed')
  } catch (error) {
    console.error('Seeding failed:', error)
  } finally {
    await mongoose.connection.close()
    console.log('Database connection closed')
  }
}

main()