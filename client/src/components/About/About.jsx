import "./about.styles.scss";

const About = () => {
  return (
    <div id="about">
      <h1 className="heading">Why work with me?</h1>
      <div className="about-wrapper">
        <img src="/img/profile.jpg" alt="Profile" />
        <div className="text-wrapper">
          <p>
            I've spent the past 4 years building 13+ different apps. The vast
            majority of them have failed, but in the last year I've been able to
            make 4 different apps that have generated &gt;$1,000/month at their
            peak.
          </p>
          <p>
            I'm not an expert. I'm not a millionaire. I'm just a normal guy that
            has built a lot of apps and figured out how to market them on social
            media to get users + revenue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
