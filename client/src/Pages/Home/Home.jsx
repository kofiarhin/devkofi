import "./home.styles.scss";
import Landing from "../../components/Landing/Landing";
import Pricing from "../../components/Pricing/Pricing";

const Home = () => {
  return (
    <div id="home">
      <div className="container">
        <Landing />
      </div>

      <Pricing />
    </div>
  );
};

export default Home;
