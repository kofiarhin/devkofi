import "./portal.styles.scss";
import { useSelector } from "react-redux";
import StudentPortal from "./StudentPortal";
import AdminPortal from "./AdminPortal";
import StudentDashboard from "../../components/StudentDashboard/StudentDashboard";
import AdminDashboard from "../../components/AdminDashboard/AdminDashboard";

const Portal = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="container" id="portal">
      {user && user?.role === "student" && <StudentDashboard name="big man" />}
      {user && user?.role === "admin" && <AdminDashboard user={user} />}
    </div>
  );
};

export default Portal;
