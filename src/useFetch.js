import { useEffect, useState } from "react";

export function useFetch(url) {
  const [data, setData] = useState([]);
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
        setData(data);
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
  }, [url]);

  return [{ data, loading, error }];
}
