import "./courseOutline.styles.scss";
import courseOutline from "./courseData.json";

const CourseOutline = () => {
  const { courseDuration, courseRequirements, modules } = courseOutline;

  return (
    <div className="course-outline">
      <h1>Full Stack Development Course Outline</h1>
      <p className="course-duration">Duration: {courseDuration}</p>

      <section className="requirements">
        <h2>Course Requirements</h2>
        <ul>
          {courseRequirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </section>

      <section className="modules">
        <h2>Modules</h2>
        {modules.map((mod, idx) => (
          <div key={idx} className="module">
            <h3>{mod.module}</h3>
            <p className="module-duration">Duration: {mod.duration}</p>
            <h4>What You'll Learn</h4>
            <ul>
              {mod.content.map((item, cIdx) => (
                <li key={cIdx}>{item}</li>
              ))}
            </ul>
            <p className="module-project">
              <strong>Project:</strong> {mod.project}
            </p>
          </div>
        ))}
      </section>

      <div className="cta-container">
        <a href="/mentorship" className="cta-button">
          Join Mentorship Program
        </a>
      </div>
    </div>
  );
};

export default CourseOutline;
