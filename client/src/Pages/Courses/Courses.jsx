import { useEffect } from "react";
import useCourseQuery from "../../hooks/useCourseQuery";
import CourseList from "../../components/CourseList/CourseList";
const Courses = () => {
  const { data } = useCourseQuery();

  return (
    <div>
      <h1 className="heading center">Course Library</h1>
      {data && data?.courses && data?.courses.length > 0 && (
        <CourseList courses={data?.courses} />
      )}
    </div>
  );
};

export default Courses;
