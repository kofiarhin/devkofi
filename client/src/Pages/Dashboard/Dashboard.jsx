import "./dashboard.styles.scss";
import { useSelector } from "react-redux";
import StudentDashboard from "./StudentDashboard/StudentDashboard";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div id="dashboard">
      <div className="container">
        {user && user?.role === "student" && <StudentDashboard user={user} />}
      </div>
    </div>
  );
};

export default Dashboard;
