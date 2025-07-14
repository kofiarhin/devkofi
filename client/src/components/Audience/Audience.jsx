import React from "react";
import "./audience.styles.scss";

const Audience = () => {
  return (
    <section id="audience">
      <h2 className="heading">Who this is for</h2>
      <div className="cards">
        <div className="card">
          <h2 className="card-title">
            People who don't know how to build an app
          </h2>
          <p className="card-text">
            Doesn't matter if you don't know how to code at all or are a
            seasoned developer, I will help you learn how to build an app.
          </p>
        </div>
        <div className="card">
          <h2 className="card-title">
            People who don't know how to market their apps
          </h2>
          <p className="card-text">
            I'll help you make social media content to grow your app on social
            media. I'll be your social media marketing assistant.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Audience;
