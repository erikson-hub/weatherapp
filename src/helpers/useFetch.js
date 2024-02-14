import { useState, useEffect } from 'react';
const fetchData = (URL) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    fetch(URL)
      .then((resp) => resp.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      });
  }, []);
};
