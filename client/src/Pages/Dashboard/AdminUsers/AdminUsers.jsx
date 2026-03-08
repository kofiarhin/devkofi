import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import useAdminUsersQuery from "../../../hooks/useAdminUsersQuery";
import useApproveTeamEnrollmentMutation from "../../../hooks/useApproveTeamEnrollmentMutation";
import useApproveEnrollmentMutation from "../../../hooks/useApproveEnrollmentMutation";
import useRejectEnrollmentMutation from "../../../hooks/useRejectEnrollmentMutation";
import useActivateEnrollmentMutation from "../../../hooks/useActivateEnrollmentMutation";
import "./adminUsers.styles.scss";

const AdminUsers = () => {
  const token = useSelector((state) => state.auth.token);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useAdminUsersQuery(token);
  const approveTeamMutation = useApproveTeamEnrollmentMutation(token);
  const approveEnrollmentMutation = useApproveEnrollmentMutation(token);
  const rejectEnrollmentMutation = useRejectEnrollmentMutation(token);
  const activateEnrollmentMutation = useActivateEnrollmentMutation(token);

  const users = useMemo(() => data?.users || [], [data]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const onApproveTeam = async (teamId) => {
    await approveTeamMutation.mutateAsync({ teamId });
    await refresh();
  };

  const onApproveEnrollment = async (userId) => {
    await approveEnrollmentMutation.mutateAsync({ userId });
    await refresh();
  };

  const onRejectEnrollment = async (userId) => {
    await rejectEnrollmentMutation.mutateAsync({ userId });
    await refresh();
  };

  const onActivateEnrollment = async (userId) => {
    await activateEnrollmentMutation.mutateAsync({ userId });
    await refresh();
  };

  if (isLoading) return <section id="admin-users"><div className="admin-users__state">Loading users…</div></section>;
  if (isError) return <section id="admin-users"><div className="admin-users__state is-error">{error?.message || "Failed to load users."}</div></section>;

  return (
    <section id="admin-users">
      <div className="admin-users__container">
        <h1 className="admin-users__title">Mentorship Applicants</h1>
        <div className="admin-users__table-wrap">
          <table className="admin-users__table">
            <thead>
              <tr>
                <th>User</th>
                <th>Plan</th>
                <th>Enrollment</th>
                <th>Mentorship Profile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const profile = u?.profile || {};
                const fullName = [u?.firstName, u?.lastName].filter(Boolean).join(" ") || "—";
                const enrollment = u?.enrollment;
                const teamPending = u?.team?.teamPlanStatus === "pending" && u?.team?.role === "owner";
                return (
                  <tr key={u?._id}>
                    <td>
                      <strong>{fullName}</strong>
                      <div>{u?.email}</div>
                    </td>
                    <td>{u?.plan || "free"}</td>
                    <td>
                      <div>Status: {u?.status || "none"}</div>
                      <div>Application: {enrollment?.applicationStatus || "—"}</div>
                    </td>
                    <td>
                      <div>Role: {profile.currentRole || "—"}</div>
                      <div>Skill: {profile.skillLevel || "—"}</div>
                      <div>MERN: {profile.mernExperience || "—"}</div>
                      <div>AI: {profile.aiExperience || "—"}</div>
                      <div>Goal: {profile.primaryGoal || "—"}</div>
                      <div>Blocker: {profile.biggestBlocker || "—"}</div>
                      <div>GitHub: {profile.githubUrl ? "yes" : "no"}</div>
                      <div>Portfolio: {profile.portfolioUrl ? "yes" : "no"}</div>
                      <div>Onboarding: {profile.onboardingCompleted ? "complete" : "incomplete"}</div>
                    </td>
                    <td className="admin-users__actions-cell">
                      {teamPending ? (
                        <button className="admin-users__btn is-primary" onClick={() => onApproveTeam(u?.team?.teamId)}>Approve Team</button>
                      ) : (
                        <>
                          <button className="admin-users__btn is-primary" onClick={() => onApproveEnrollment(u?._id)}>Approve</button>
                          <button className="admin-users__btn" onClick={() => onActivateEnrollment(u?._id)}>Activate</button>
                          <button className="admin-users__btn is-danger" onClick={() => onRejectEnrollment(u?._id)}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminUsers;
