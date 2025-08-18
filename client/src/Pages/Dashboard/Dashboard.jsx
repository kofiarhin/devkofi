import "./dashboard.styles.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import StudentDashboard from "./studentDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="dashboard">
      {user.role === "student" && <StudentDashboard user={user} />}
      {user.role === "admin" && <AdminDashboard />}
    </div>
  );
};

export default Dashboard;
