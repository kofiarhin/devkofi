import "./home.styles.scss";
import Landing from "../../components/Landing/Landing";
import Pricing from "../../components/Pricing/Pricing";
import AiProgram from "../../components/AiProgram/AiProgram";

const Home = () => {
  return (
    <div id="home" className="container">
      <Landing />
      <AiProgram />
      <Pricing />
    </div>
  );
};

export default Home;
