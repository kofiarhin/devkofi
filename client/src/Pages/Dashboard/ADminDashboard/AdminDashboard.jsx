import React from "react";
import { Users, MessageSquare, DollarSign, LifeBuoy } from "lucide-react";

const gridMapping = [
  {
    id: "students",
    title: "Students",
    icon: Users,
    badge: "12",
    desktop_span: 3,
    description: "View list of students.",
  },
  {
    id: "messages",
    title: "Messages",
    icon: MessageSquare,
    badge: "85%",
    desktop_span: 1,
    description: "View messages from students.",
  },
  {
    id: "revenue",
    title: "Revenue",
    icon: DollarSign,
    badge: "3",
    desktop_span: 2,
    description: "View revenue details.",
  },
  {
    id: "support",
    title: "Support",
    icon: LifeBuoy,
    badge: "Online",
    desktop_span: 2,
    description: "Instant help from the community.",
  },
];

const AdminDashboard = ({ user }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-wrapper">
        <header className="header-section">
          <h1>
            Welcome back, <span>{user?.firstName}</span>
          </h1>
          <p>You have 3 assignments due this week.</p>
        </header>

        <main className="bento-grid">
          {gridMapping.map((item) => {
            const Icon = item.icon;

            return (
              <section
                key={item.id}
                className={`card ${item.id}-card span-${item.desktop_span}`}
              >
                <div className="card-header">
                  <Icon size={22} strokeWidth={1.8} />
                  <span className="badge">{item.badge}</span>
                </div>

                <div className="card-content">
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </div>
              </section>
            );
          })}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
