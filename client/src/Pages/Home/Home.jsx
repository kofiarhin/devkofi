import Landing from "../../components/Landing/Landing";
import About from "../../components/About/About";
import Audience from "../../components/Audience/Audience";
import Services from "../../components/Services/Services";
import Pricing from "../../components/Pricing/Pricing";
const Home = () => {
  return (
    <div className="container">
      <Landing />
      <Services />
      <About />
      <Audience />
      <Pricing />
    </div>
  );
};

export default Home;
