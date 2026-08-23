import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      title
      published
      author
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
    ) {
      id, title, published, author
    }
  }
`

export const UPDATE_AUTHOR = gql`
  mutation updateAuthor(
    $name: String!
    $setBornTo: Int!
  ) {
    editAuthor(name: $name, setBornTo: $setBornTo) { id }
  }
`