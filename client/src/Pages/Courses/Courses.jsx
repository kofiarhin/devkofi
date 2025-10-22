import { useEffect } from "react";
import useCourseQuery from "../../hooks/useCourseQuery";
import CourseList from "../../components/CourseList/CourseList";
const Courses = () => {
  const { data } = useCourseQuery();

  return (
    <div>
      {data && data?.courses && data?.courses.length > 0 && (
        <CourseList courses={data?.courses} />
      )}
    </div>
  );
};

export default Courses;
