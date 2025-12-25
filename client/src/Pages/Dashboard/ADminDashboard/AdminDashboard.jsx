import React from "react";

const gridMapping = [
  {
    id: "revenue",
    title: "Total Revenue",
    icon: "💰",
    badge: "+12.5%",
    desktop_span: 4, // Full width banner for financial overview
    description: "Monthly recurring revenue and course sales analytics.",
  },
  {
    id: "messages",
    title: "Messages",
    icon: "✉️",
    badge: "12",
    desktop_span: 2,
    description: "Manage student inquiries and feedback threads.",
  },
  {
    id: "users",
    title: "Users",
    icon: "👥",
    badge: "1,240",
    desktop_span: 2,
    description: "Monitor student enrollment and active participants.",
  },
];

const AdminDashboard = ({ user }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-wrapper">
        <header className="header-section">
          <h1>
            Welcome back, <span>{user.firstName}</span>
          </h1>
          <p>You have new revenue milestones this morning.</p>
        </header>

        <main className="bento-grid">
          {gridMapping.map((item) => (
            <section
              key={item.id}
              className={`card ${item.id}-card span-${item.desktop_span}`}
            >
              <div className="card-header">
                <span className="icon">{item.icon}</span>
                <span className="badge">{item.badge}</span>
              </div>
              <div className="card-content">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
