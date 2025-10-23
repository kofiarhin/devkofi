import useCourseQuery from "../../hooks/useCourseQuery";
import Section from "../../components/Section.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";
import BadgeList from "../../components/BadgeList.jsx";
import AccessibleButton from "../../components/AccessibleButton.jsx";
import { useProgress } from "../../hooks/useProgress.js";
import "./courses.styles.scss";

const Courses = () => {
  const { data } = useCourseQuery();
  const { data: progress } = useProgress();

  const badges = progress?.badges || [];

  return (
    <div className="courses">
      <Section
        title="Course library"
        description="Choose your next build. Each track is production-focused with code reviews, Loom breakdowns, and sprint artifacts."
      >
        <div className="courses-progress surface-card">
          <div className="courses-progress-header">
            <h2 className="courses-progress-title">Current track</h2>
            <p className="courses-progress-subtitle">
              {progress?.activeCourseTitle || "Select a course to get started."}
            </p>
          </div>
          <ProgressBar value={progress?.percentage || 0} />
          <div className="courses-progress-actions">
            <AccessibleButton
              className="btn btn--primary"
              as="a"
              href={`/courses/${progress?.activeCourseId || ""}`}
            >
              Resume learning
            </AccessibleButton>
            <AccessibleButton className="btn btn--ghost" as="a" href="/onboarding?step=3">
              Update goals
            </AccessibleButton>
          </div>
        </div>
        {badges.length ? (
          <div className="courses-badges surface-card">
            <h3 className="courses-badges-title">Milestones unlocked</h3>
            <BadgeList
              badges={badges.map((badge) => ({
                id: badge.id,
                icon: badge.icon || "🏆",
                title: badge.title,
                description: badge.description,
              }))}
            />
          </div>
        ) : null}
      </Section>
      <Section
        variant="surface"
        title="All courses"
        description="From onboarding funnels to AI-assisted workflows, pick the roadmap that levels up your stack."
      >
        {data?.courses?.length ? (
          <div className="courses-grid">
            {data.courses.map((course) => (
              <article className="courses-card surface-card" key={course._id}>
                <h3 className="courses-card-title">{course.title}</h3>
                <p className="courses-card-description text-muted">{course.description}</p>
                <AccessibleButton className="btn btn--primary" as="a" href={`/courses/${course._id}`}>
                  View course
                </AccessibleButton>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-muted">Courses are loading. Check back soon.</p>
        )}
      </Section>
    </div>
  );
};

export default Courses;
