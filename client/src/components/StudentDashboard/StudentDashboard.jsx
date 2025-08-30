import React from "react";
import useStudentData from "../../hooks/useStudentData";
import { useSelector } from "react-redux";
import "./studentDashboard.styles.scss";

const StudentDashboard = () => {
  const { data, isLoading, error } = useStudentData();
  const { user } = useSelector((state) => state.auth);
  const { fullName: name, email } = user;

  return (
    <div className="dashboard">
      <header className="header">
        <h1 className="title">Welcome, {name}!</h1>
      </header>

      <nav className="nav">{/* Navigation content if needed */}</nav>

      <main className="main">
        <div className="card">
          <div className="card-content">
            <div className="card-icon">📚</div>
            <h3 className="card-title">Assignments</h3>
            <p>
              {isLoading
                ? "Loading..."
                : error
                ? "Error loading data"
                : data?.assignmentsCount || 0}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="card-icon">💬</div>
            <h3 className="card-title">Messages</h3>
            <p>
              {isLoading
                ? "Loading..."
                : error
                ? "Error loading data"
                : data?.messagesCount || 0}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="card-icon">👤</div>
            <h3 className="card-title">Profile</h3>
            <p>
              {isLoading
                ? "Loading..."
                : error
                ? "Error loading data"
                : `${data?.profileCompletion || 0}%`}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
