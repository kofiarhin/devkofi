import Landing from "../../components/Landing/Landing";
import About from "../../components/About/About";
import Audience from "../../components/Audience/Audience";
import Services from "../../components/Services/Services";
import Pricing from "../../components/Pricing/Pricing";
import Newsletter from "../../components/Newsletter/Newsletter";
import Faq from "../../components/Faq/Faq";
import Features from "../../components/Features/Features";
import Overview from "../../components/Overview/Overview";

const Home = () => {
  return (
    <div className="container">
      <Landing />
      <Overview />
      <About />
      {/* <Features /> */}
      <Pricing />
      <Newsletter />
    </div>
  );
};

export default Home;
