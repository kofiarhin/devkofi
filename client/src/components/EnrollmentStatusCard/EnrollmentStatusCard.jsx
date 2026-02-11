import { Link } from "react-router-dom";
import "./enrollmentStatusCard.styles.scss";

const getBestEnrollment = (enrollments = []) => {
  if (!Array.isArray(enrollments) || !enrollments.length) return null;

  const active = enrollments.find((e) => e.status === "active");
  if (active) return active;

  const pending = enrollments.find((e) => e.status === "pending");
  if (pending) return pending;

  return enrollments[0];
};

const getBestRequest = (requests = []) => {
  if (!Array.isArray(requests) || !requests.length) return null;
  return requests[0];
};

const prettyPlan = (slug) => {
  if (slug === "standard") return "Full-Stack Bootcamp: Standard";
  if (slug === "pro") return "Full-Stack Bootcamp: Pro";
  if (slug === "team") return "Team / Enterprise";
  return "No Plan Selected";
};

const EnrollmentStatusCard = ({
  enrollments = [],
  requests = [],
  loading,
  error,
}) => {
  const enrollment = getBestEnrollment(enrollments);
  const request = getBestRequest(requests);

  let status = "none";
  let planSlug = "none";
  let planLabel = "No Plan Selected";
  let note = "";

  if (enrollment) {
    planSlug = enrollment.planSlug;
    planLabel = prettyPlan(planSlug);
    status = enrollment.status; // pending | active | cancelled
  } else if (request) {
    planSlug = request.planSlug;
    planLabel = prettyPlan(planSlug);
    status = "request";
    note = "Requires a short discovery call.";
  }

  const statusLabel =
    status === "active"
      ? "ACTIVE"
      : status === "pending"
        ? "PENDING"
        : status === "request"
          ? "REQUEST"
          : "NONE";

  // ✅ key change: choose package should go to dedicated pricing page
  const cta =
    status === "active"
      ? { label: "Go to Program", to: "/dashboard" }
      : status === "pending"
        ? { label: "Complete onboarding", to: "/dashboard" }
        : status === "request"
          ? { label: "Book discovery call", to: "/enterprise" }
          : { label: "Choose a package", to: "/pricing" };

  return (
    <div className="enrollment-card">
      <div className="enrollment-card__top">
        <div>
          <p className="enrollment-card__kicker">Enrollment Status</p>
          <h2 className="enrollment-card__plan">{planLabel}</h2>
        </div>

        <span
          className={[
            "enrollment-card__badge",
            status === "active"
              ? "is-active"
              : status === "pending"
                ? "is-pending"
                : status === "request"
                  ? "is-request"
                  : "is-none",
          ].join(" ")}
        >
          {statusLabel}
        </span>
      </div>

      {loading && (
        <p className="enrollment-card__meta">Loading your enrollment…</p>
      )}

      {!loading && error && (
        <p className="enrollment-card__error">
          {error || "Failed to load enrollment."}
        </p>
      )}

      {!loading && !error && note && (
        <p className="enrollment-card__meta">{note}</p>
      )}

      <div className="enrollment-card__actions">
        <Link className="enrollment-card__btn" to={cta.to}>
          {cta.label}
        </Link>

        <Link className="enrollment-card__btn is-ghost" to="/pricing">
          View pricing
        </Link>
      </div>
    </div>
  );
};

export default EnrollmentStatusCard;
