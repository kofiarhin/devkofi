import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import useJoinEnrollmentMutation from "../../hooks/useJoinEnrollmentMutation";
import useOnboardingStatusQuery from "../../hooks/useOnboardingStatusQuery";
import "./join.styles.scss";

const Join = () => {
  const { planSlug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.auth.token);

  const { data: onboardingData, isLoading: onboardingLoading } =
    useOnboardingStatusQuery(token, ["standard", "pro"].includes(planSlug));

  const { mutate, isPending, isSuccess, data, error } =
    useJoinEnrollmentMutation(token);

  useEffect(() => {
    if (!planSlug) return;
    if (planSlug === "team") {
      navigate("/enterprise", { replace: true });
      return;
    }

    if (!token) {
      navigate(`/login?plan=${planSlug}`, { replace: true });
      return;
    }

    if (onboardingLoading) return;

    if (!onboardingData?.onboardingCompleted) {
      navigate(`/onboarding?plan=${planSlug}`, { replace: true });
      return;
    }

    mutate(
      { slug: planSlug },
      {
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["my-enrollments"] }),
            queryClient.invalidateQueries({ queryKey: ["my-access-requests"] }),
            queryClient.invalidateQueries({ queryKey: ["student-dashboard-summary"] }),
          ]);
          setTimeout(() => navigate("/dashboard"), 400);
        },
      },
    );
  }, [planSlug, onboardingData, onboardingLoading]);

  return (
    <div className="join-page">
      <div className="join-card">
        <h1 className="join-title">Apply: {planSlug}</h1>
        {(isPending || onboardingLoading) && <p className="join-text">Preparing your mentorship application…</p>}
        {!isPending && error && (
          <>
            <p className="join-error">{error.message}</p>
            <div className="join-actions">
              <Link to="/dashboard" className="join-btn">Go to Dashboard</Link>
              <Link to="/" className="join-btn join-btn--ghost">Back Home</Link>
            </div>
          </>
        )}
        {!isPending && isSuccess && (
          <>
            <p className="join-text">Application status: <strong>{data?.enrollment?.applicationStatus || "submitted"}</strong></p>
            <p className="join-subtext">Redirecting to your dashboard…</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Join;
