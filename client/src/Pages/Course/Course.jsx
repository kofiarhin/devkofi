import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { baseUrl } from "../../constants/constants";
import "./course.styles.scss";

const Course = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCourse = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/courses/${id}`);
        if (!res.ok) throw new Error("Failed to fetch course");
        const data = await res.json();
        setCourse(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getCourse();
  }, [id]);

  if (loading) return <div className="loading">Loading course...</div>;
  if (!course) return <div className="error">Course not found.</div>;

  const {
    title,
    tagline,
    category,
    level,
    durationWeeks,
    instructor,
    tags,
    price,
    requirements,
    outcomes,
    modules,
    media,
    links,
  } = course;

  return (
    <section id="course">
      {/* ----------- Hero Section ----------- */}
      <div className="hero">
        <img
          src={media?.heroUrl || media?.thumbnailUrl}
          alt={title}
          className="hero-img"
        />
        <div className="hero-content">
          <h1 className="course-title">{title}</h1>
          <p className="tagline">{tagline}</p>
          <div className="meta">
            <span className="badge">{category}</span>
            <span className="badge">{level}</span>
            <span className="badge">{durationWeeks} weeks</span>
          </div>
          <div className="actions">
            <Link to={links?.enroll} className="cta">
              Enroll Now (£{price.amount})
            </Link>
            <Link to={links?.syllabus} className="ghost">
              View Syllabus
            </Link>
          </div>
        </div>
      </div>

      {/* ----------- Instructor ----------- */}
      <div className="instructor">
        <h2>Instructor</h2>
        <p className="name">{instructor.name}</p>
        <p className="title">{instructor.title}</p>
        <p className="bio">{instructor.bio}</p>
      </div>

      {/* ----------- Requirements ----------- */}
      <div className="requirements">
        <h2>Requirements</h2>
        <ul>
          {requirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>
      </div>

      {/* ----------- Outcomes ----------- */}
      <div className="outcomes">
        <h2>What You’ll Learn</h2>
        <ul>
          {outcomes.map((outcome, i) => (
            <li key={i}>{outcome}</li>
          ))}
        </ul>
      </div>

      {/* ----------- Modules ----------- */}
      <div className="modules">
        <h2>Course Modules</h2>
        <div className="module-list">
          {modules.map((mod) => (
            <div className="module-card" key={mod.id}>
              <h3>{mod.title}</h3>
              <p className="duration">{mod.durationWeeks} weeks</p>
              <ul>
                {mod.learn.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ----------- Tags ----------- */}
      <div className="tags">
        {tags.map((tag, i) => (
          <span key={i} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Course;
