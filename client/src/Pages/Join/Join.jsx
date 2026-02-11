import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import useJoinEnrollmentMutation from "../../hooks/useJoinEnrollmentMutation";
import "./join.styles.scss";

const Join = () => {
  const { planSlug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.auth.token);

  const { mutate, isPending, isSuccess, data, error } =
    useJoinEnrollmentMutation(token);

  useEffect(() => {
    if (!planSlug) return;

    mutate(
      { slug: planSlug },
      {
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["my-enrollments"] }),
            queryClient.invalidateQueries({ queryKey: ["my-access-requests"] }),
          ]);

          setTimeout(() => navigate("/dashboard"), 300);
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planSlug]);

  return (
    <div className="join-page">
      <div className="join-card">
        <h1 className="join-title">Join: {planSlug}</h1>

        {isPending && <p className="join-text">Creating your enrollment…</p>}

        {!isPending && error && (
          <>
            <p className="join-error">{error.message}</p>
            <div className="join-actions">
              <Link to="/dashboard" className="join-btn">
                Go to Dashboard
              </Link>
              <Link to="/" className="join-btn join-btn--ghost">
                Back Home
              </Link>
            </div>
          </>
        )}

        {!isPending && isSuccess && (
          <>
            <p className="join-text">
              Enrollment created:{" "}
              <strong>{data?.enrollment?.status || "pending"}</strong>
            </p>
            <p className="join-subtext">Redirecting to your dashboard…</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Join;
