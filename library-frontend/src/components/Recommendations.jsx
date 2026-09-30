import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS, ME } from "../queries";

const Recommendations = ({ show }) => {
  const meResult = useQuery(ME);
  const allBooksResult = useQuery(ALL_BOOKS);

  if (meResult.loading || allBooksResult.loading) return <div>Loading...</div>;

  if (meResult.error || allBooksResult.error)
    return <div>Something went wrong. Try refreshing the page</div>;

  if (!show) return null;

  const favoriteGenre = meResult.data.me.favoriteGenre;

  const booksInFavoriteGenre = allBooksResult.data.allBooks.filter((book) =>
    book.genres.includes(favoriteGenre),
  );

  return (
    <>
      <h1>Recommendations</h1>
      <p>
        books in your favorite genre: <b>{favoriteGenre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksInFavoriteGenre.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Recommendations;
