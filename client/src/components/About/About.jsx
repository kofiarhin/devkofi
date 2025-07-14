import "./about.styles.scss";

const About = () => {
  return (
    <div id="about">
      <h1 className="heading">Why Join My Coding Mentorship?</h1>
      <div className="about-wrapper">
        <img src="/img/profile.jpg" alt="Profile" />
        <div className="text-wrapper">
          <p>
            I’ve spent the last 4 years building 13+ apps from scratch. Most of
            them failed. But in the past year alone, I’ve built 4 apps that each
            generated over $1,000 per month at their peak.
          </p>

          <p>
            I’m not a coding guru or a millionaire founder. I’m a developer
            who’s spent years in the trenches—figuring out how to build and
            launch real-world apps, and how to market them online to get actual
            users and revenue.
          </p>

          <p>
            This mentorship is not about theory or textbooks. It’s about
            learning by building real projects, avoiding the mistakes I made,
            and understanding how to turn your code into something people
            actually want.
          </p>

          <p>
            If you want practical coding skills, real feedback, and a roadmap to
            building apps that don’t just sit on your laptop, this program is
            for you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
