import { useState } from "react";

import { useApolloClient } from "@apollo/client/react";

// Components
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";

const App = () => {
  const [page, setPage] = useState("authors");
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken"),
  );
  const client = useApolloClient();

  const logout = () => {
    setAccessToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const isUserLoggedIn = accessToken !== null;

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>

        {isUserLoggedIn && (
          <button onClick={() => setPage("add")}>add book</button>
        )}
        {isUserLoggedIn && (
          <button onClick={() => setPage("recommendations")}>recommend</button>
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
        setAccessToken={setAccessToken}
        setPage={setPage}
        show={page === "login"}
      />

      <Recommendations show={page === "recommendations"} />
    </div>
  );
};

export default App;
