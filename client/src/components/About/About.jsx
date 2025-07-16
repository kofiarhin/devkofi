import "./about.styles.scss";
import { aboutData } from "./aboutData";

const About = () => {
  return (
    <div id="about">
      <h1 className="heading">Why Join My Coding Mentorship?</h1>
      <div className="about-wrapper">
        <img src="/img/profile.jpg" alt="Profile" className="profile-img" />
        <div className="text-wrapper">
          {aboutData.map((item, index) => (
            <div key={index} className="about-item">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
