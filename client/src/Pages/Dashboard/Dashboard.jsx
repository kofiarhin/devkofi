import "./dashboard.styles.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import StudentDashboard from "./studentDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1> Welcome {user?.fullName} </h1>
      </header>
      {user.role === "student" && <StudentDashboard />}
      {user.role === "admin" && <AdminDashboard />}
    </div>
  );
};

export default Dashboard;
