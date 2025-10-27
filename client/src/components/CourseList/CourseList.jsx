import "./course-list.styles.scss";

const CourseList = ({ courses = [] }) => {
  if (courses.length === 0) {
    return <p> no courses found!</p>;
  }
  return (
    <div id="courses">
      {/* container */}
      <div className="container">
        {courses?.map((course, index) => {
          return (
            <div key={index} className="course-item">
              {" "}
              <img src={course?.media?.thumbnailUrl} />
              <h2> {course.name} </h2>
            </div>
          );
        })}
      </div>
      {/* end container */}
    </div>
  );
};

export default CourseList;
