import "./courseOutline.styles.scss";
import courseOutline from "./courseData.json";
import { motion } from "framer-motion";

const headingVariant = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
};

const listItemVariant = {
  hidden: { opacity: 0, x: -20 },
  show: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

const CourseOutline = () => {
  const { courseDuration, courseRequirements, modules } = courseOutline;

  return (
    <div className="course-outline">
      {/* Heading */}
      <motion.h1
        variants={headingVariant}
        initial="hidden"
        animate="show"
        className="heading"
      >
        Full Stack Development Course Outline
      </motion.h1>

      {/* Course Duration */}
      <motion.p
        className="course-duration"
        variants={sectionVariant}
        custom={0}
        initial="hidden"
        animate="show"
      >
        Duration: {courseDuration}
      </motion.p>

      {/* Requirements */}
      <motion.section
        className="requirements"
        variants={sectionVariant}
        custom={1}
        initial="hidden"
        animate="show"
      >
        <h2>Course Requirements</h2>
        <ul>
          {courseRequirements.map((req, index) => (
            <motion.li
              key={index}
              variants={listItemVariant}
              custom={index}
              initial="hidden"
              animate="show"
            >
              {req}
            </motion.li>
          ))}
        </ul>
      </motion.section>

      {/* Modules */}
      <motion.section
        className="modules"
        variants={sectionVariant}
        custom={2}
        initial="hidden"
        animate="show"
      >
        <h2>Modules</h2>
        {modules.map((mod, idx) => (
          <motion.div
            key={idx}
            className="module"
            variants={sectionVariant}
            custom={idx}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h3>{mod.module}</h3>
            <p className="module-duration">Duration: {mod.duration}</p>
            <h4>What You'll Learn</h4>
            <ul>
              {mod.content.map((item, cIdx) => (
                <motion.li
                  key={cIdx}
                  variants={listItemVariant}
                  custom={cIdx}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
            <p className="module-project">
              <strong>Project:</strong> {mod.project}
            </p>
          </motion.div>
        ))}
      </motion.section>

      {/* CTA */}
      <motion.div
        className="cta-container"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <a href="/mentorship" className="cta-button">
          Join Mentorship Program
        </a>
      </motion.div>
    </div>
  );
};

export default CourseOutline;
