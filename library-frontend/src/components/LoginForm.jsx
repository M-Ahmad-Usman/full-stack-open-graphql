import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { LOGIN, ME } from "../queries";

const LoginForm = ({ setLoggedInUser, setPage, show }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value;
      setLoggedInUser((user) => {
        return {
          ...user, // to preserve loggedInUser object shape
          token,
        };
      });
      // Although loggedInUser has also id, username and favoriteGenre
      // properties but on login only token will be set in localStorage
      // Rest of the properties will be populated by recommendations component
      localStorage.setItem("loggedInUser", JSON.stringify({ token }));

      setUsername("");
      setPassword("");

      setPage("authors");
    },
  });

  if (!show) return null;

  const submit = (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
