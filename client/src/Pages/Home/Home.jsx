import Landing from "../../components/Landing/Landing";
import About from "../../components/About/About";
import Audience from "../../components/Audience/Audience";
import Services from "../../components/Services/Services";
const Home = () => {
  return (
    <div className="container">
      <Landing />
      <Services />
      <About />
      <Audience />
    </div>
  );
};

export default Home;
