import "./integrateAi.styles.scss";
import { aiImage } from "../../constants/constants";
import { Link } from "react-router-dom";
import AnimatedSection from "../Animations/AnimatedSection";
import { textVariant, imageVariant } from "../Animations/animationVariants";

const IntegrateAI = () => {
  return (
    <section id="integrate-ai">
      <div className="integrate-wrapper">
        <AnimatedSection variant={textVariant} className="text-wrapper">
          <h1 className="heading">
            Integrate AI... <br /> Your Way...
          </h1>
          <p>
            Harness the power of the ChatGPT API and Grok API to add
            intelligence to your apps. From natural language understanding to
            real-time insights, build smarter, faster, and more adaptive
            experiences—tailored to your vision.
          </p>
          <Link to="/register" className="cta">
            Join Now
          </Link>
        </AnimatedSection>

        <AnimatedSection
          variant={imageVariant}
          className="image-wrapper"
          hoverEffect={{ scale: 1.05, rotate: -2 }}
        >
          <img src={aiImage} alt="AI interface illustration" loading="lazy" />
        </AnimatedSection>
      </div>
    </section>
  );
};

export default IntegrateAI;
