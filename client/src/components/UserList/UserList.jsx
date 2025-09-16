import React, { useMemo, useState } from "react";
import "./userList.styles.scss";

const Avatar = ({ name = "" }) => {
  const initials = useMemo(() => {
    const parts = name.trim().split(" ").filter(Boolean);
    return (
      (parts[0]?.[0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase()
    );
  }, [name]);
  return (
    <div className="avatar" aria-hidden="true">
      {initials || "U"}
    </div>
  );
};

const UserRow = ({ fullName, email, phone }) => (
  <li className="row" tabIndex={0}>
    <Avatar name={fullName} />
    <div className="meta">
      <span className="name">{fullName || "Unknown"}</span>
      <span className="sub">
        {email && (
          <a href={`mailto:${email}`} className="link">
            {email}
          </a>
        )}
        {email && phone && (
          <span className="dot" aria-hidden="true">
            •
          </span>
        )}
        {phone && (
          <a href={`tel:${phone}`} className="link">
            {phone}
          </a>
        )}
      </span>
    </div>
  </li>
);

const UserList = ({ users = [], loading = false }) => {
  const [q, setQ] = useState("");

  const data = useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return users;
    return users.filter(
      (u) =>
        (u.fullName || "").toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term) ||
        (u.phone || "").toLowerCase().includes(term)
    );
  }, [users, q]);

  return (
    <section id="users" className="users-section">
      <header className="toolbar">
        <h2>Students</h2>
        <div className="tools">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, phone"
            aria-label="Search users"
          />
          <span className="count">{data.length}</span>
        </div>
      </header>

      {loading ? (
        <ul className="list">
          {Array.from({ length: 6 }).map((_, i) => (
            <li className="row skeleton" key={i}>
              <div className="avatar" />
              <div className="meta">
                <span className="name" />
                <span className="sub" />
              </div>
            </li>
          ))}
        </ul>
      ) : data.length ? (
        <ul className="list">
          {data.map((u) => (
            <UserRow
              key={u._id || u.email || u.phone}
              fullName={u.fullName}
              email={u.email}
              phone={u.phone}
            />
          ))}
        </ul>
      ) : (
        <div className="empty">
          <p>No users found</p>
        </div>
      )}
    </section>
  );
};

export default UserList;
