import React from "react";
import "./home.styles.scss";
import Landing from "../../components/Landing/Landing";
import Pricing from "../../components/Pricing/Pricing";
import FeatureSection from "../../components/FeatureSection/FeatureSection";
import { profileImage } from "../../constants/constants";

const Home = () => {
  const handleJoinClick = () => {};
  return (
    <div id="home">
      <div className="container">
        <Landing />
        <FeatureSection
          title="Your mentorship"
          highlightText="your way..."
          description="Skip the tutorial hell. Get direct access to a senior developer who guides you through building complex, production-ready applications. From 'Hello World' to Hired."
          buttonText="Join Now"
          onButtonClick={handleJoinClick}
          imageSrc={profileImage}
          reversed={false}
        />

        <FeatureSection
          title="Your mentorship"
          highlightText="your way..."
          description="Skip the tutorial hell. Get direct access to a senior developer who guides you through building complex, production-ready applications. From 'Hello World' to Hired."
          buttonText="Join Now"
          onButtonClick={handleJoinClick}
          imageSrc={profileImage}
          reversed={true}
        />

        <FeatureSection
          title="Your mentorship"
          highlightText="your way..."
          description="Skip the tutorial hell. Get direct access to a senior developer who guides you through building complex, production-ready applications. From 'Hello World' to Hired."
          buttonText="Join Now"
          onButtonClick={handleJoinClick}
          imageSrc={profileImage}
          reversed={false}
        />

        <FeatureSection
          title="Your mentorship"
          highlightText="your way..."
          description="Skip the tutorial hell. Get direct access to a senior developer who guides you through building complex, production-ready applications. From 'Hello World' to Hired."
          buttonText="Join Now"
          onButtonClick={handleJoinClick}
          imageSrc={profileImage}
          reversed={true}
        />

        <Pricing />
      </div>
    </div>
  );
};

export default Home;
