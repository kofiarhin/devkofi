import React from "react";
import "./home.styles.scss";
import Landing from "../../components/Landing/Landing";

const Home = () => {
  return (
    <div id="home">
      <div className="container">
        <Landing />
      </div>
    </div>
  );
};

export default Home;
