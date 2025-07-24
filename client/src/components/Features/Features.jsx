import "./features.styles.scss";
import {
  FaHammer,
  FaShippingFast,
  FaBullseye,
  FaChartLine,
} from "react-icons/fa";

const Features = () => {
  return (
    <div id="features">
      <h1 className="heading">Why DevKofi Mentorship Works</h1>
      <div className="features-wrapper">
        <div className="feature-unit">
          <FaHammer className="icon" />
          <div className="text-wrapper">
            <h2>Real Builder Experience</h2>
            <p>
              No hype, no fluff. Just honest, hard-earned lessons from building
              13+ real apps—most failed, some broke even, but 4 now generate
              consistent revenue every month. You’ll learn what actually works,
              what doesn't, and how to avoid the costly mistakes that slow most
              devs down.
            </p>
          </div>
        </div>
        <div className="feature-unit">
          <FaShippingFast className="icon" />
          <div className="text-wrapper">
            <h2>Ship Fast Approach</h2>
            <p>
              You don’t wait to “feel ready.” You build first—then learn,
              refine, and improve. The mentorship is designed to push you into
              action fast, with feedback and guidance at every step. No endless
              planning, no perfectionism—just momentum, progress, and real
              experience through doing.
            </p>
          </div>
        </div>

        <div className="feature-unit">
          <FaBullseye className="icon" />
          <div className="text-wrapper">
            <h2>Outcome over theory</h2>
            <p>
              Every call, message, and roadmap is designed to help you ship
              something real—an actual app, feature, or product you can show,
              use, or sell. No academic filler. No memorizing things you’ll
              forget. Just practical execution tied to real results, so every
              hour you invest moves you forward.
            </p>
          </div>
        </div>
        <div className="feature-unit">
          <FaChartLine className="icon" />
          <div className="text-wrapper">
            <h2>Feedback that levels you up</h2>
            <p>
              Get real, no-BS reviews on your code, user experience, and app
              architecture. Not just “it works”—but how it performs, how it
              scales, and how it reads to other developers. You’ll learn to
              think like a senior dev, write cleaner code, and build projects
              that hold up in the real world—not just on your local machine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
