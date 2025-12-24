import React from "react";

const StudentDashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-wrapper">
        <header className="header-section">
          <h1>
            Welcome back, <span>Kofi</span>
          </h1>
          <p>You have 3 assignments due this week.</p>
        </header>

        <main className="bento-grid">
          {/* Main unit - Spans 3 columns on desktop */}
          <section className="card feature-card">
            <div className="card-header">
              <span className="icon">✉️</span>
              <span className="badge">12</span>
            </div>
            <h2>Messages</h2>
            <p>View your latest updates and task status from mentors.</p>
          </section>

          {/* Progress unit - Spans 1 column */}
          <section className="card stat-card">
            <div className="card-header">
              <span className="icon">⚡</span>
              <span className="badge">85%</span>
            </div>
            <h2>Progress</h2>
            <p>Course completion</p>
          </section>

          {/* Assignments unit - Spans 2 columns */}
          <section className="card mid-card">
            <div className="card-header">
              <span className="icon">📚</span>
              <span className="badge">3</span>
            </div>
            <h2>Assignments</h2>
            <p>Upcoming deadlines for your MERN modules.</p>
          </section>

          {/* Support unit - Spans 2 columns */}
          <section className="card mid-card">
            <div className="card-header">
              <span className="icon">🛡️</span>
              <span className="badge">Online</span>
            </div>
            <h2>Support</h2>
            <p>Get instant help from the DevKofi community.</p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
