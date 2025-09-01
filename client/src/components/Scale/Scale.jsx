import "./scale.styles.scss";
import { codeSnippetImage } from "../../constants/constants";
import { Link } from "react-router-dom";
// import { textVariant, imageVariant } from "../../animations/animationVariants";
import { textVariant, imageVariant } from "../Animations/animationVariants";
// import AnimatedSection from "../AnimatedSection";
import AnimatedSection from "../Animations/AnimatedSection";

const Scale = () => {
  return (
    <div id="scale">
      <div className="scale-wrapper">
        <AnimatedSection variant={textVariant} className="text-wrapper">
          <h1 className="heading">
            Code Meant to <br /> Scale...
          </h1>
          <p>
            A deliberate, disciplined mindset for building systems that
            last—design with foresight, architect with clarity, refactor with
            purpose, and ship solutions that grow without breaking.
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
          <img src={codeSnippetImage} alt="Code Snippet" />
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Scale;
