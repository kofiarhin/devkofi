import React from "react";
import "./audience.styles.scss";
import { audienceData } from "./audienceData";

const Audience = () => {
  return (
    <section id="audience">
      <h1 className="heading center">Who This Is For</h1>
      <h2 className="center">Build. Launch. Grow.</h2>
      <div className="cards">
        {audienceData.map((item, index) => (
          <div className="card" key={index}>
            <h2 className="card-title">{item.title}</h2>
            <p className="card-text">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Audience;
