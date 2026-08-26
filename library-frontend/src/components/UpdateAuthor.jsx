import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { UPDATE_AUTHOR, ALL_AUTHORS } from "../queries";

export const UpdateAuthor = () => {
  const [name, setName] = useState("Select Author Name");
  const [born, setBorn] = useState("");

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });
  const result = useQuery(ALL_AUTHORS);

  const handleAuthorBirthyearEdit = (event) => {
    event.preventDefault();

    updateAuthor({ variables: { name, setBornTo: parseInt(born) } });

    setName("Select Author Name");
    setBorn("");
  };

  return (
    <div>
      <h2>Set birthyear</h2>

      <form onSubmit={handleAuthorBirthyearEdit}>
        <div>
          <label htmlFor="name">Name: </label>
          <select
            name="name"
            id="name"
            required
            value={name}
            onChange={({ target }) => setName(target.value)}
          >
            <option>Select Author Name</option>
            {!result.loading &&
              result.data?.allAuthors.map((author) => (
                <option key={author.id}>{author.name}</option>
              ))
            }
          </select>
        </div>
        <div>
          <label htmlFor="born">Born: </label>
          <input
            id="born"
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>

        <button type="submit">update author</button>
      </form>
    </div>
  );
};
