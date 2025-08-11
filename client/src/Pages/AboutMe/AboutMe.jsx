import "./aboutMe.styles.scss";
import { aboutMeImage } from "../../constants/constants";
// import { textVariant, imageVariant } from "../Animations/animationVariants";
import {
  textVariant,
  imageVariant,
} from "../../components/Animations/animationVariants";
// import AnimatedSection from "../Animations/AnimatedSection";
import AnimatedSection from "../../components/Animations/AnimatedSection";

const AboutMe = () => {
  return (
    <div id="about-me">
      <div className="container">
        <h1 className="heading center">About Me</h1>
        <div className="about-me-wrapper">
          {/* image-wrapper */}
          <AnimatedSection
            variant={imageVariant}
            className="image-wrapper"
            hoverEffect={{ scale: 1.05, rotate: -2 }}
          >
            <img src={aboutMeImage} alt="About Me" />
          </AnimatedSection>
          {/* end image-wrapper */}

          {/* text-wrapper */}
          <AnimatedSection variant={textVariant} className="text-wrapper">
            <p>
              Hey there! I’m someone who’s always been curious about how things
              work and, more importantly, how to make them better. Over the
              years, that curiosity has turned into a real passion for building
              and creating—whether it’s solving a tricky problem, experimenting
              with a new idea, or bringing a project to life from scratch.
            </p>

            <p>
              On the tech side, I work with JavaScript (ES6+), React + Vite,
              Node.js, Express, MongoDB (Mongoose), and SCSS modules, which
              means I can take a project from concept to a fully working,
              polished product. I enjoy building clean, responsive interfaces,
              setting up smooth backend systems, and making sure everything
              works seamlessly together.
            </p>

            <p>
              I’m big on efficiency and clarity, but I also love the creative
              side of tech—finding smarter ways to do things, trying out new
              tools, and learning as I go. Collaboration is a huge part of what
              keeps me inspired, and I believe the best ideas often come from
              bouncing thoughts around with others.
            </p>

            <p>
              When I’m not deep in code, I’m usually exploring new technologies,
              reading up on creative problem-solving, or just enjoying projects
              that let me mix design, strategy, and development. For me, tech
              isn’t just a job—it’s a space where I can keep growing,
              experimenting, and contributing to something meaningful.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
