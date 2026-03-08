import React, { useMemo } from "react";
import "./StudentDashboard.styles.scss";
import { Briefcase, Sparkles, ShieldCheck, LifeBuoy } from "lucide-react";
import { useSelector } from "react-redux";
import useStudentDashboardSummaryQuery from "../../../hooks/useStudentDashboardSummaryQuery";
import useMyAccessRequestsQuery from "../../../hooks/useMyAccessRequestsQuery";

const StudentDashboard = ({ user }) => {
  const { token } = useSelector((state) => state.auth);

  const { data: summaryData } = useStudentDashboardSummaryQuery(token);
  const { data: accessRequestsData } = useMyAccessRequestsQuery(token);

  const computed = useMemo(() => {
    const mentorship = summaryData?.mentorship || {};
    const enrollment = summaryData?.enrollment || {};
    const pendingAccess = Number(accessRequestsData?.requests?.length || 0) || 0;

    return {
      nextAction: mentorship.nextAction || "Select a mentorship plan to get started.",
      selectedPlan: mentorship.selectedPlan || "none",
      readiness: mentorship.aiWorkflowReadiness || "incomplete",
      supportLevel: mentorship.supportLevel || "not-set",
      enrollmentStatus: enrollment.status || "none",
      applicationStatus: enrollment.applicationStatus || "draft",
      pendingAccess,
      onboardingCompleted: mentorship.onboardingCompleted,
    };
  }, [summaryData, accessRequestsData]);

  const gridMapping = useMemo(
    () => [
      {
        id: "plan",
        title: "Current Plan",
        icon: Briefcase,
        badge: computed.selectedPlan,
        desktop_span: 2,
        description: `Enrollment: ${computed.enrollmentStatus} · Application: ${computed.applicationStatus}`,
      },
      {
        id: "readiness",
        title: "AI Workflow Readiness",
        icon: Sparkles,
        badge: computed.readiness,
        desktop_span: 2,
        description: computed.onboardingCompleted
          ? "Intake complete. You can move through mentorship milestones."
          : "Complete onboarding to unlock personalized mentorship support.",
      },
      {
        id: "support",
        title: "Support Level",
        icon: LifeBuoy,
        badge: computed.supportLevel,
        desktop_span: 2,
        description: "Support and accountability level based on your selected plan.",
      },
      {
        id: "next",
        title: "Next Action",
        icon: ShieldCheck,
        badge: computed.pendingAccess > 0 ? `${computed.pendingAccess} team request(s)` : "on track",
        desktop_span: 2,
        description: computed.nextAction,
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
          <p>{computed.nextAction}</p>
        </header>

        <main className="bento-grid">
          {gridMapping.map((item) => {
            const Icon = item.icon;

            return (
              <section key={item.id} className={`card ${item.id}-card span-${item.desktop_span}`}>
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
