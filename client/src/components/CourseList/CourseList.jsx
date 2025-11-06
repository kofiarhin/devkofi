// CourseList.jsx
import "./course-list.styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSterlingSign } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 420, damping: 30 },
  },
};

const CourseList = ({ courses = [] }) => {
  if (courses.length === 0) {
    return <p> no courses found!</p>;
  }

  const onImgError = (e) => {
    if (e?.target?.src !== PLACEHOLDER) e.target.src = PLACEHOLDER;
  };

  return (
    <motion.div
      id="course-list"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div className="container" variants={containerVariants}>
        {courses?.map((course, index) => {
          const imgSrc = course?.media?.thumbnailUrl || PLACEHOLDER;
          return (
            <motion.div
              key={index}
              className="course-item"
              variants={cardVariants}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.996 }}
            >
              <motion.img
                className="course-img"
                src={imgSrc}
                alt={course?.title || course?.name}
                loading="lazy"
                onError={onImgError}
                whileHover={{ scale: 1.03, filter: "brightness(1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              />

              <h2 className="course-title">{course.name}</h2>

              <div className="course-divider" />

              <p className="price">
                <FontAwesomeIcon icon={faSterlingSign} />
                {Number(course?.price?.amount || 0).toFixed(2)}
              </p>

              <motion.div whileHover={{ scale: 1.01 }}>
                <Link className="cta" to={`/courses/${course.id}`}>
                  view More
                </Link>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default CourseList;
