import "./home.styles.scss";
import Landing from "../../components/Landing/Landing";
import AIWorkflowSection from "../../components/AIWorkflowSection/AIWorkflowSection";
import Pricing from "../../components/Pricing/Pricing";

const Home = () => {
  return (
    <div id="home">
      <Landing />

      <AIWorkflowSection />

      <Pricing />
    </div>
  );
};

export default Home;
