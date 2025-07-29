import "./scale.styles.scss";
import { codeSnippetImage } from "../../constants/constants";
import { Link } from "react-router-dom";
const Scale = () => {
  return (
    <div id="scale">
      <h1 className="heaidng">
        <div className="scale-wrapper">
          <div className="text-wrapper">
            <h1 className="heading">
              Write Code that <br /> scales....
            </h1>
            <p>
              A deliberate, disciplined mindset for building systems that
              last—design with foresight, architect with clarity, refactor with
              purpose, and ship solutions that grow without breaking.
            </p>
            <Link to="/mentorship">Join Now</Link>
          </div>
          <div className="image-wrapper">
            <img src={codeSnippetImage} alt="" />
          </div>
        </div>
      </h1>
    </div>
  );
};

export default Scale;
