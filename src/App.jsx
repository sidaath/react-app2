import { useEffect, useState } from "react";

function App() {
  const [{ users, loading, error }, setUsers] = useFetchUsers();

  useEffect(() => {
    const controller = new AbortController();
    setUsers(controller);

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <h1>Users</h1>
      {error && <h2>Error fetching users</h2>}
      {loading && <h2>Loading . . . </h2>}
      {users.length > 0 &&
        loading !== true &&
        users.map((user) => {
          return <li key={user.id}>{user.name}</li>;
        })}
    </>
  );
}

function useFetchUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function fetchUsers(x) {
    setLoading(true);
    setError(false);

    fetch("https://jsonplaceholder.typicode.com/users", {
      signal: x.signal,
    })
      .then((res) => {
        if (res.ok) {
          console.log("resolved");
          console.log(res);
          console.log("returning .json()");
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((data) => {
        console.log("data resolved, setting users");
        setUsers(data);
        setLoading(false);
        return data;
      })
      .catch((e) => {
        if (e.name === "AbortError") {
          console.log("abort on second render");
          return;
        } else {
          console.error(e);
          console.log("bad error");
          setError(true);
          setLoading(false);
        }
      });
  }

  return [{ users, loading, error }, fetchUsers];
}

export default App;
