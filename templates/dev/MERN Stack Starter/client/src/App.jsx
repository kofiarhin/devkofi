import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    const test = async () => {
      const res = await fetch("/api/users");
      console.log(res.ok);
    };

    test();
  }, []);
  return (
    <div id="app">
      <h1 className="heading">Mern Starck Starter</h1>
    </div>
  );
};

export default App;
