import { useState } from "react";

import { useApolloClient } from "@apollo/client/react";

// Components
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(
    localStorage.getItem("loggedInUser") ?? undefined,
  );
  const client = useApolloClient();

  const logout = () => {
    setToken(undefined);
    localStorage.clear();
    client.resetStore();
  };

  const isUserLoggedIn = token !== undefined;

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
        setToken={setToken}
        setPage={setPage}
        show={page === "login"}
      />
    </div>
  );
};

export default App;
