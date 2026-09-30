import { useState } from "react";

import { useQuery } from "@apollo/client/react";

import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState("select genre");
  const result = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>Loading...</div>;
  }

  const books = result.data.allBooks;
  const genres = books.flatMap((book) => {
    return book.genres.map((genre) => {
      return {
        id: crypto.randomUUID(),
        genre,
      };
    });
  });

  const filteredBooks =
    genreFilter === "select genre"
      ? books
      : books.filter((book) => book.genres.includes(genreFilter));

  return (
    <div>
      <h2>books</h2>

      <div>
        <label htmlFor="genre-filter">Filter by Genre: </label>
        <select
          name="genre-filter"
          id="genre-filter"
          onChange={(e) => setGenreFilter(e.target.value)}
          value={genreFilter}
        >
          <option value="select genre" disabled>
            select genre
          </option>
          {genres.map((g) => (
            <option key={g.id}>{g.genre}</option>
          ))}
        </select>
        <button onClick={() => setGenreFilter("select genre")}>
          clear filter
        </button>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
