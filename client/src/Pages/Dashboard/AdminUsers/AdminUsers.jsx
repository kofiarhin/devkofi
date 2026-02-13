import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Search, RefreshCcw, CheckCircle2 } from "lucide-react";

import useAdminUsersQuery from "../../../hooks/useAdminUsersQuery";
import useApproveTeamEnrollmentMutation from "../../../hooks/useApproveTeamEnrollmentMutation";
import useApproveEnrollmentMutation from "../../../hooks/useApproveEnrollmentMutation";
import "./adminUsers.styles.scss";

const normalize = (v) => (typeof v === "string" ? v.trim().toLowerCase() : "");

const AdminUsers = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, token } = useSelector((state) => state.auth);

  if (user?.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminUsersQuery(token);

  const approveTeamMutation = useApproveTeamEnrollmentMutation(token);
  const approveEnrollmentMutation = useApproveEnrollmentMutation(token);

  const [filter, setFilter] = useState("all"); // all | active | pending | free
  const [q, setQ] = useState("");

  const users = data?.users || [];

  const filtered = useMemo(() => {
    const query = normalize(q);

    return users
      .filter((u) => {
        if (filter === "active") return u?.status === "active";
        if (filter === "pending") return u?.status === "pending";
        if (filter === "free") return u?.plan === "free";
        return true;
      })
      .filter((u) => {
        if (!query) return true;
        const hay = [
          u?.firstName,
          u?.lastName,
          u?.email,
          u?.role,
          u?.plan,
          u?.status,
          u?.team?.teamName,
        ]
          .filter(Boolean)
          .map(normalize)
          .join(" ");

        return hay.includes(query);
      });
  }, [users, filter, q]);

  const refetchUsers = async () => {
    await qc.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const onApproveTeam = async (teamId) => {
    if (!teamId || approveTeamMutation.isPending) return;
    try {
      await approveTeamMutation.mutateAsync({ teamId });
      await refetchUsers();
    } catch (_) {}
  };

  const onApproveEnrollment = async (userId) => {
    if (!userId || approveEnrollmentMutation.isPending) return;
    try {
      await approveEnrollmentMutation.mutateAsync({ userId });
      await refetchUsers();
    } catch (_) {}
  };

  return (
    <section className="admin-users">
      <div className="admin-users__container">
        <header className="admin-users__header">
          <div className="admin-users__title">
            <h1>Admin · Users</h1>
            <p>View users, subscription status, and team access.</p>
          </div>

          <div className="admin-users__actions">
            <button
              className="admin-users__btn"
              onClick={() => refetch()}
              disabled={isFetching}
              type="button"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>
        </header>

        <div className="admin-users__controls">
          <div className="admin-users__tabs">
            <button
              type="button"
              className={`admin-users__tab ${filter === "all" ? "is-active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              className={`admin-users__tab ${filter === "active" ? "is-active" : ""}`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              type="button"
              className={`admin-users__tab ${filter === "pending" ? "is-active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
            <button
              type="button"
              className={`admin-users__tab ${filter === "free" ? "is-active" : ""}`}
              onClick={() => setFilter("free")}
            >
              Free
            </button>
          </div>

          <div className="admin-users__search">
            <Search size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, plan..."
            />
          </div>
        </div>

        {isLoading ? (
          <div className="admin-users__state">Loading users…</div>
        ) : isError ? (
          <div className="admin-users__state is-error">
            {error?.message || "Failed to load users."}
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-users__state">No users match your filters.</div>
        ) : (
          <div className="admin-users__table-wrap">
            <table className="admin-users__table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Team</th>
                  <th className="admin-users__col-actions">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((u) => {
                  const fullName = [u?.firstName, u?.lastName]
                    .filter(Boolean)
                    .join(" ")
                    .trim();

                  const plan = u?.plan || "free";
                  const status = u?.status || "none";
                  const team = u?.team || null;

                  const teamPending =
                    team?.teamPlanStatus === "pending" &&
                    team?.role === "owner";

                  const enrollmentPending =
                    status === "pending" &&
                    (plan === "standard" || plan === "pro") &&
                    !teamPending; // prefer team approval button when applicable

                  return (
                    <tr key={u?._id}>
                      <td>
                        <div className="admin-users__user">
                          <div className="admin-users__user-main">
                            <div className="admin-users__name">
                              {fullName || "—"}
                            </div>
                            <div className="admin-users__email">
                              {u?.email || "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-users__pill">
                          {u?.role || "student"}
                        </span>
                      </td>

                      <td>
                        <span className={`admin-users__pill is-plan`}>
                          {plan}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-users__pill is-status ${
                            status === "active"
                              ? "is-active"
                              : status === "pending"
                                ? "is-pending"
                                : "is-none"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        {team ? (
                          <div className="admin-users__team">
                            <div className="admin-users__team-name">
                              {team?.teamName || "Team"}
                            </div>
                            <div className="admin-users__team-meta">
                              {team?.role} · {team?.teamPlanStatus}
                            </div>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="admin-users__actions-cell">
                        {teamPending ? (
                          <button
                            type="button"
                            className="admin-users__btn is-primary"
                            onClick={() => onApproveTeam(team?.teamId)}
                            disabled={approveTeamMutation.isPending}
                            title="Approve team enrollment"
                          >
                            <CheckCircle2 size={16} />
                            Approve Team
                          </button>
                        ) : enrollmentPending ? (
                          <button
                            type="button"
                            className="admin-users__btn is-primary"
                            onClick={() => onApproveEnrollment(u?._id)}
                            disabled={approveEnrollmentMutation.isPending}
                            title="Approve enrollment"
                          >
                            <CheckCircle2 size={16} />
                            Approve
                          </button>
                        ) : (
                          <span className="admin-users__muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {approveTeamMutation.isError ? (
              <div className="admin-users__toast is-error">
                {approveTeamMutation.error?.message ||
                  "Failed to approve team enrollment."}
              </div>
            ) : null}

            {approveTeamMutation.isSuccess ? (
              <div className="admin-users__toast is-success">
                Team enrollment approved.
              </div>
            ) : null}

            {approveEnrollmentMutation.isError ? (
              <div className="admin-users__toast is-error">
                {approveEnrollmentMutation.error?.message ||
                  "Failed to approve enrollment."}
              </div>
            ) : null}

            {approveEnrollmentMutation.isSuccess ? (
              <div className="admin-users__toast is-success">
                Enrollment approved.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminUsers;
