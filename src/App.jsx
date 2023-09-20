import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetch("https://jsonplaceholder.typicode.com/users", {
      signal: controller.signal,
    })
      .then((res) => {
        console.log("resolved");
        console.log(res);
        console.log("returning .json()");
        return res.json();
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
          setLoading(false);
          setError(true);
        }
      });

    console.log("outaside the fetch");

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <h1>Users</h1>
      {error && <h1>Error</h1>}
      {loading && <h2>Loading ....</h2>}
      {!loading &&
        users.map((user) => {
          return <li key={user.id}>{user.name}</li>;
        })}
    </>
  );
}

export default App;
