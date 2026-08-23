import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { UPDATE_AUTHOR, ALL_AUTHORS } from '../queries'

export const UpdateAuthor = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, { refetchQueries: [{ query: ALL_AUTHORS }] })

  const handleAuthorBirthyearEdit = (event) => {
    event.preventDefault()

    updateAuthor({ variables: { name, setBornTo: parseInt(born) } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>

      <form onSubmit={handleAuthorBirthyearEdit}>
        <div>
          <label htmlFor="name">Name: </label>
          <input
            id="name"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          <label htmlFor="born">Born: </label>
          <input
            id="born"
            type='number'
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>

        <button type="submit">update author</button>
      </form>
    </div>
  );
};
