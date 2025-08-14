import "./dashboard.styles.scss";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>

      <div className="dashboard-content">
        <div className="card">
          <h2>Register User</h2>
          <p>Register a new user</p>
          <Link to="/register">Register User</Link>
        </div>

        <div className="card">
          <h2>Users</h2>
          <p>Manage all registered users.</p>
          <button>View Users</button>
        </div>

        <div className="card">
          <h2>Messages</h2>
          <p>Check contact form submissions.</p>
          <button>View Messages</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
