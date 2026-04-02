import "./home.styles.scss";
import Landing from "../../components/Landing/Landing";
import Pricing from "../../components/Pricing/Pricing";
import FeatureBento from "../../components/FeatureSection/FeatureSection";

const Home = () => {
  return (
    <div id="home">
      <div className="container">
        <Landing />
      </div>

      <FeatureBento />

      <div className="container">
        <Pricing />
      </div>
    </div>
  );
};

export default Home;
