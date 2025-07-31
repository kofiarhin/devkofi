import React from "react";
import "./dashboard.styles.scss";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>

      <div className="dashboard-content">
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
