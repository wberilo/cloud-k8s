import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const App = () => {
  const [response, setResponse] = useState("");
  useEffect(() => {
    fetch("http://node-redis-service:3000/api/data/1")
      .then((res) => res.json())
      .then((data) => setResponse(JSON.stringify(data)))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <img src={reactLogo} className="App-logo" alt="react logo" />
      <img src={viteLogo} className="App-logo" alt="vite logo" />
      <p>
        Edit <code>App.jsx</code> and save to reload.
      </p>
      <p>Response from cache server: {response}</p>
    </>
  );
};

export default App;
