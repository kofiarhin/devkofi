import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import useOnboardingIntakeMutation from "../../hooks/useOnboardingIntakeMutation";
import "./onboarding.styles.scss";

const defaultForm = {
  currentRole: "",
  skillLevel: "",
  mernExperience: "",
  aiExperience: "",
  primaryGoal: "",
  biggestBlocker: "",
  githubUrl: "",
  portfolioUrl: "",
  currentProjectSummary: "",
  timezone: "",
  country: "",
  preferredStartTimeline: "",
};

const Onboarding = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan") || "standard";
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const queryClient = useQueryClient();

  const [form, setForm] = useState(defaultForm);
  const { mutate, isPending, error } = useOnboardingIntakeMutation(token);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    mutate(
      {
        ...form,
        selectedPlan: plan,
        supportPreference: plan === "pro" ? "high-touch" : "structured",
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
          navigate(`/join/${plan}`, { replace: true });
        },
      },
    );
  };

  return (
    <section className="onboarding-page">
      <div className="onboarding-card">
        <h1>Mentorship Intake ({plan === "pro" ? "Pro" : "Standard"})</h1>
        <p>
          Share your current engineering context so we can tailor your AI-powered
          MERN mentorship path.
        </p>

        <form onSubmit={onSubmit} className="onboarding-form">
          {Object.keys(defaultForm).map((field) => (
            <label key={field}>
              <span>{field}</span>
              {field.includes("Summary") || field.includes("Goal") || field.includes("Blocker") ? (
                <textarea name={field} value={form[field]} onChange={onChange} rows={3} required />
              ) : (
                <input name={field} value={form[field]} onChange={onChange} required={!["githubUrl", "portfolioUrl"].includes(field)} />
              )}
            </label>
          ))}

          {error ? <p className="onboarding-error">{error.message}</p> : null}
          <button type="submit" disabled={isPending}>
            {isPending ? "Saving intake..." : "Continue to application"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Onboarding;
