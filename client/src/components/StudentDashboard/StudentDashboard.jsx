import { useMemo } from "react";
import { useSelector } from "react-redux";
import ProgressBar from "../ProgressBar.jsx";
import BadgeList from "../BadgeList.jsx";
import AccessibleButton from "../AccessibleButton.jsx";
import { useProgress, useProgressUpdate } from "../../hooks/useProgress.js";
import "./studentDashboard.styles.scss";

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading } = useProgress();
  const { mutate, isPending } = useProgressUpdate();

  const badges = useMemo(() => {
    if (!data?.badges) {
      return [];
    }
    return data.badges.map((badge) => ({
      id: badge.id,
      icon: badge.icon || "🏅",
      title: badge.title,
      description: badge.description,
    }));
  }, [data]);

  const handleAdvance = () => {
    mutate({
      courseId: data?.activeCourseId,
      completedLessons: (data?.completedLessons || 0) + 1,
      totalLessons: data?.totalLessons || 0,
      courseTitle: data?.activeCourseTitle,
    });
  };

  return (
    <section className="student-dashboard" aria-label="Student dashboard overview">
      <header className="student-dashboard-header">
        <h1 className="student-dashboard-title">Welcome back, {user?.fullName || "student"}</h1>
        <p className="student-dashboard-subtitle">
          Track your mentorship progress, celebrate new badges, and jump to the next lesson in your roadmap.
        </p>
      </header>

      <div className="student-dashboard-progress surface-card">
        <div className="student-dashboard-progress-meta">
          <h2 className="student-dashboard-progress-title">Weekly progress</h2>
          <p className="student-dashboard-progress-copy">
            {isLoading ? "Loading progress…" : `${data?.completedLessons || 0} lessons complete · ${data?.streak || 0}-day streak`}
          </p>
        </div>
        <ProgressBar value={data?.percentage || 0} />
        <div className="student-dashboard-actions">
          <AccessibleButton
            className="btn btn--primary"
            type="button"
            onClick={handleAdvance}
            disabled={isPending || isLoading || !data?.activeCourseId}
          >
            Mark next lesson complete
          </AccessibleButton>
          <AccessibleButton
            className="btn btn--ghost"
            as="a"
            href={`/courses/${data?.activeCourseId || ""}`}
          >
            Resume lesson
          </AccessibleButton>
        </div>
      </div>

      {badges.length ? (
        <div className="student-dashboard-badges surface-card">
          <h2 className="student-dashboard-progress-title">Unlocked badges</h2>
          <BadgeList badges={badges} />
        </div>
      ) : null}
    </section>
  );
};

export default StudentDashboard;
