import { useEffect, useState } from "react";

const URLS = {
  USERS: "https://jsonplaceholder.typicode.com/users",
  POSTS: "https://jsonplaceholder.typicode.com/posts",
  COMMENTS: "https://jsonplaceholder.typicode.com/comments",
};

function App() {
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/users");
  const [{ users, loading, error }] = useFetchUsers(url);

  return (
    <>
      <div>
        <label>
          <input
            type="radio"
            checked={url === URLS.USERS}
            onChange={() => setUrl(URLS.USERS)}
          />
          Users
        </label>
        <label>
          <input
            type="radio"
            checked={url === URLS.POSTS}
            onChange={() => setUrl(URLS.POSTS)}
          />
          Posts
        </label>
        <label>
          <input
            type="radio"
            checked={url === URLS.COMMENTS}
            onChange={() => setUrl(URLS.COMMENTS)}
          />
          Comments
        </label>
      </div>
      {loading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <h1>Error</h1>
      ) : (
        users.map((user) => <li key={user.id}>{user.name}</li>)
      )}
    </>
  );
}

function useFetchUsers(url) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    const x = new AbortController();

    fetch(url, {
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
        setError(false);
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

    return () => {
      x.abort();
    };
  }, []);

  return [{ users, loading, error }];
}

export default App;
