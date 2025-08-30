import "./adminDashboard.styles.scss";
import useAdminData from "../../hooks/useAdminData";

export default function AdminDashboard({ name = "Admin" }) {
  const { data, isLoading, error } = useAdminData();

  const n = (v) => (typeof v === "number" ? v.toLocaleString() : v ?? "N/A");

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1 className="welcome">Welcome, {name}!</h1>

        {isLoading && (
          <div className="status" role="status">
            Loading admin overview…
          </div>
        )}

        {error && (
          <div className="status error">Failed to load admin overview.</div>
        )}

        {!isLoading && !error && (
          <section className="grid">
            <Card title="Users" icon="users" value={n(data?.usersCount)} />
            <Card
              title="Courses"
              icon="courses"
              value={n(data?.coursesCount)}
            />
            <Card
              title="Messages"
              icon="messages"
              value={n(data?.messagesCount)}
            />
            <Card
              title="Payments"
              icon="payments"
              value={n(data?.paymentsCount)}
            />
            <Card
              title="Transactions"
              icon="transactions"
              value={n(data?.transactionsCount)}
            />
          </section>
        )}
      </div>
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <article className="card" aria-label={title}>
      <div className="card-icon">{getIcon(icon)}</div>
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
    </article>
  );
}

function getIcon(name) {
  switch (name) {
    case "users":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16 11c1.657 0 3-1.79 3-4s-1.343-4-3-4-3 1.79-3 4 1.343 4 3 4ZM8 11c1.657 0 3-1.79 3-4S9.657 3 8 3 5 4.79 5 7s1.343 4 3 4Zm0 2c-3.314 0-6 2.686-6 6v1h12v-1c0-3.314-2.686-6-6-6Zm8 0c-.71 0-1.387.118-2.02.336A7.007 7.007 0 0 1 20 19v1h4v-1c0-3.314-2.686-6-6-6Z" />
        </svg>
      );
    case "courses":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6l9-4 9 4-9 4-9-4Zm0 6 9 4 9-4M3 18l9 4 9-4" />
        </svg>
      );
    case "messages":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6l-4 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "payments":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 5h18a2 2 0 0 1 2 2v2H1V7a2 2 0 0 1 2-2Zm-2 8h22v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-4Zm5 2h4v2H6v-2Z" />
        </svg>
      );
    case "transactions":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 7h10V3h2v6H7l3 3-1.4 1.4L3.2 7l5.4-5.4L10 3 7 6V3H5v4Zm10 10H7v4H5v-6h12l-3-3 1.4-1.4 5.4 5.4-5.4 5.4L14 21l3-3v3h2v-4Z" />
        </svg>
      );
    default:
      return null;
  }
}

// Usage example (comment only):
// import AdminDashboard from "../../components/AdminDashboard/AdminDashboard";
// <AdminDashboard name="Kofi" />
