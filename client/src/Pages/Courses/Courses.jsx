import { useEffect } from "react";
import useCourseQuery from "../../hooks/useCourseQuery";
import CourseList from "../../components/CourseList/CourseList";
import Spinner from "../../components/Spinner/Spinner";
const Courses = () => {
  const { data, isLoading } = useCourseQuery();

  if (isLoading) {
    return <Spinner />;
  }
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
