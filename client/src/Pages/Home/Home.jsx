import "./home.styles.scss";
import Landing from "../../components/Landing/Landing";
import Pricing from "../../components/Pricing/Pricing";
import FeatureSection from "../../components/FeatureSection/FeatureSection";
import {
  workStation,
  personCoding,
  aiImage,
  codeImage,
} from "../../constants/constants";

const Home = () => {
  const handleJoinClick = () => {};

  return (
    <div id="home">
      <div className="container">
        <Landing />

        <FeatureSection
          title="1-to-1 Mentorship"
          highlightText="that actually ships"
          description="You work directly with a senior MERN engineer, not a teaching assistant or community moderator. Sessions focus on real blockers — architecture, backend logic, frontend state, or deployment. Every session is designed to move your codebase forward."
          buttonText="Join Now"
          url="/#pricing"
          onButtonClick={handleJoinClick}
          imageSrc={workStation}
          reversed={false}
        />

        <FeatureSection
          title="Real Projects"
          highlightText="not toy apps"
          description="Build production-grade applications that reflect real-world systems. You’ll implement authentication, protected routes, APIs, database schemas, error handling, and clean architecture — the exact things hiring managers look for."
          buttonText="View Projects"
          url="/projects"
          onButtonClick={handleJoinClick}
          imageSrc={personCoding}
          reversed
        />

        <FeatureSection
          title="AI-Powered Workflow"
          highlightText="done the right way"
          description="Learn how to use AI as a productivity multiplier, not a shortcut. You’ll see how to prompt effectively, review and refactor AI-generated code, and integrate AI tools into real MERN workflows without sacrificing quality or understanding."
          buttonText="See How"
          onButtonClick={handleJoinClick}
          imageSrc={aiImage}
        />

        <FeatureSection
          title="Career-Focused"
          highlightText="from day one"
          description="Everything is built with hiring and progression in mind. That means clean GitHub repositories, meaningful commit history, deployed projects, and the ability to confidently explain your technical decisions in interviews."
          buttonText="Get Started"
          onButtonClick={handleJoinClick}
          imageSrc={codeImage}
          reversed
        />

        <FeatureSection
          title="Built for Teams"
          highlightText="that need to move fast"
          description="This isn’t a course — it’s hands-on technical upskilling for teams. Your developers get direct access to a senior engineer, tailored sessions around your actual codebase, and real-world projects aligned with your business goals. Ideal for startups and small teams that need better code quality, faster delivery, and stronger technical decision-making."
          buttonText="Request Team Access"
          url="/enterprise"
          onButtonClick={handleJoinClick}
          imageSrc={workStation}
        />

        <Pricing />
      </div>
    </div>
  );
};

export default Home;
