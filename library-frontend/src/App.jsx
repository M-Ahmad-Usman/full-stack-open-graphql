import { useState } from "react";

import { useApolloClient } from "@apollo/client/react";

// Components
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";

// default shape for logged in and logged out users
const loggedOutUser = {
  id: undefined,
  username: "",
  favoriteGenre: "",
  token: "",
};

const App = () => {
  const [page, setPage] = useState("authors");
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser")) ?? loggedOutUser,
  );
  const client = useApolloClient();

  const logout = () => {
    setLoggedInUser(loggedOutUser);
    localStorage.clear();
    client.resetStore();
  };

  const isUserLoggedIn = loggedInUser.token !== "";

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>

        {isUserLoggedIn && (
          <button onClick={() => setPage("add")}>add book</button>
        )}
        {isUserLoggedIn && <button onClick={logout}>logout</button>}
        {isUserLoggedIn || (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} isUserLoggedIn={isUserLoggedIn} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <LoginForm
        setLoggedInUser={setLoggedInUser}
        setPage={setPage}
        show={page === "login"}
      />
    </div>
  );
};

export default App;
