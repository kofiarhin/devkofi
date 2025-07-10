import Landing from "../../components/Landing/Landing";
import About from "../../components/About/About";
import Audience from "../../components/Audience/Audience";
import Services from "../../components/Services/Services";
import Pricing from "../../components/Pricing/Pricing";
import Newsletter from "../../components/Newsletter/Newsletter";
import Faq from "../../components/Faq/Faq";
const Home = () => {
  return (
    <div className="container">
      <Landing />
      <Services />
      <About />
      <Audience />
      <Pricing />
      <Faq />
      <Newsletter />
    </div>
  );
};

export default Home;
