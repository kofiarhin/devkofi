import "./course-list.styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSterlingSign } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const CourseList = ({ courses = [] }) => {
  if (courses.length === 0) {
    return <p> no courses found!</p>;
  }
  return (
    <div id="courses">
      {/* container */}
      <div className="container">
        {courses?.map((course, index) => {
          console.log({ course });
          return (
            <div key={index} className="course-item">
              {" "}
              <img src={course?.media?.thumbnailUrl} />
              <h2> {course.name} </h2>
              <p className="price">
                {" "}
                <FontAwesomeIcon icon={faSterlingSign} />
                {course?.price.amount.toFixed(2)}{" "}
              </p>
              <Link to={`/courses/${course.id}`}>view More</Link>
            </div>
          );
        })}
      </div>
      {/* end container */}
    </div>
  );
};

export default CourseList;
