import React, { useMemo } from "react";
import "./StudentDashboard.styles.scss";
import { MessageSquare, Zap, BookOpen, LifeBuoy } from "lucide-react";
import { useSelector } from "react-redux";
import useStudentDashboardSummaryQuery from "../../../hooks/useStudentDashboardSummaryQuery";
import useMyAccessRequestsQuery from "../../../hooks/useMyAccessRequestsQuery";
import useMyEnrollmentsQuery from "../../../hooks/useMyEnrollmentsQuery";

const StudentDashboard = ({ user }) => {
  const { token } = useSelector((state) => state.auth);

  const { data: summaryData } = useStudentDashboardSummaryQuery(token);
  const { data: accessRequestsData } = useMyAccessRequestsQuery(token);
  const { data: enrollmentsData } = useMyEnrollmentsQuery(token);

  const computed = useMemo(() => {
    const messagesUnread = Number(summaryData?.messages?.unreadCount || 0);

    const assignmentsDue = Number(summaryData?.assignments?.dueThisWeek || 0);

    const supportOnline =
      summaryData?.support?.online === true ? "Online" : "Offline";

    const progressPct =
      typeof summaryData?.progress?.percent === "number"
        ? Math.max(0, Math.min(100, summaryData.progress.percent))
        : null;

    const pendingAccess =
      Number(accessRequestsData?.requests?.length || 0) || 0;

    const hasEnrollment = Boolean(
      enrollmentsData?.enrollments && enrollmentsData.enrollments.length > 0,
    );

    const progressBadge =
      progressPct !== null ? `${progressPct}%` : hasEnrollment ? "0%" : "--";

    const subline =
      assignmentsDue > 0
        ? `You have ${assignmentsDue} assignment${
            assignmentsDue === 1 ? "" : "s"
          } due this week.`
        : "No assignments due this week.";

    return {
      subline,
      messagesUnread,
      assignmentsDue,
      progressBadge,
      supportOnline,
      pendingAccess,
    };
  }, [summaryData, accessRequestsData, enrollmentsData]);

  const gridMapping = useMemo(
    () => [
      {
        id: "messages",
        title: "Messages",
        icon: MessageSquare,
        badge: String(computed.messagesUnread),
        desktop_span: 3,
        description: "View latest updates and task status from mentors.",
      },
      {
        id: "progress",
        title: "Progress",
        icon: Zap,
        badge: computed.progressBadge,
        desktop_span: 1,
        description: "Course completion status.",
      },
      {
        id: "assignments",
        title: "Assignments",
        icon: BookOpen,
        badge: String(computed.assignmentsDue),
        desktop_span: 2,
        description: "Upcoming deadlines for MERN modules.",
      },
      {
        id: "support",
        title: "Support",
        icon: LifeBuoy,
        badge: computed.supportOnline,
        desktop_span: 2,
        description:
          computed.supportOnline === "Online"
            ? "Instant help from the community."
            : "Support is currently offline.",
      },
    ],
    [computed],
  );

  return (
    <div className="dashboard">
      <div className="dashboard-wrapper">
        <header className="header-section">
          <h1>
            Welcome back, <span>{user?.firstName || "Student"}</span>
          </h1>
          <p>{computed.subline}</p>
          {computed.pendingAccess > 0 && (
            <p style={{ opacity: 0.8, marginTop: 6 }}>
              Pending access requests: <strong>{computed.pendingAccess}</strong>
            </p>
          )}
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

export default StudentDashboard;
