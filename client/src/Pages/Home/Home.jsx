import "./home.styles.scss";
import Landing from "../../components/Landing/Landing";
import Pricing from "../../components/Pricing/Pricing";
import FeatureBento from "../../components/FeatureSection/FeatureSection";
import Highlights from "../../components/Highlights/Highlights";

const Home = () => {
  return (
    <div id="home">
      <div className="container">
        <Landing />
      </div>

      <FeatureBento />

      <Highlights />

      <div className="container">
        <Pricing />
      </div>
    </div>
  );
};

export default Home;
