import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useProfileMeQuery from "../../hooks/useProfileMeQuery";
import useUpdateProfileMutation from "../../hooks/useUpdateProfileMutation";
import useOnboardingStatusQuery from "../../hooks/useOnboardingStatusQuery";
import useMyEnrollmentsQuery from "../../hooks/useMyEnrollmentsQuery";
import "./settings.styles.scss";

const initialForm = {
  timezone: "",
  country: "",
  currentRole: "",
  skillLevel: "",
  mernExperience: "",
  aiExperience: "",
  primaryGoal: "",
  biggestBlocker: "",
  githubUrl: "",
  portfolioUrl: "",
  linkedinUrl: "",
  currentProjectSummary: "",
  preferredStartTimeline: "",
};

const requiredFields = [
  "currentRole",
  "skillLevel",
  "mernExperience",
  "aiExperience",
  "primaryGoal",
  "biggestBlocker",
  "currentProjectSummary",
  "timezone",
  "country",
  "preferredStartTimeline",
];

const readinessFields = [...requiredFields];
const urlFields = ["githubUrl", "portfolioUrl", "linkedinUrl"];

const prettyFieldName = {
  currentRole: "Current role",
  skillLevel: "Skill level",
  mernExperience: "MERN experience",
  aiExperience: "AI experience",
  primaryGoal: "Primary goal",
  biggestBlocker: "Biggest blocker",
  currentProjectSummary: "Current project summary",
  timezone: "Timezone",
  country: "Country",
  preferredStartTimeline: "Preferred start timeline",
};

const sanitizeFieldValue = (value) => (typeof value === "string" ? value.trim() : "");

const sanitizeForm = (form) => {
  return Object.keys(initialForm).reduce((acc, key) => {
    acc[key] = sanitizeFieldValue(form?.[key] || "");
    return acc;
  }, {});
};

const isValidOptionalUrl = (value) => {
  const trimmed = sanitizeFieldValue(value);
  if (!trimmed) return true;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const getCompletionLabel = (percent) => {
  if (percent >= 100) return "Complete";
  if (percent >= 80) return "Nearly complete";
  if (percent >= 40) return "In progress";
  return "Incomplete";
};

const Settings = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [initialSnapshot, setInitialSnapshot] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");

  const profileQuery = useProfileMeQuery(token);
  const onboardingQuery = useOnboardingStatusQuery(token);
  const enrollmentsQuery = useMyEnrollmentsQuery(token);
  const updateMutation = useUpdateProfileMutation(token);

  useEffect(() => {
    if (!profileQuery.data?.profile) return;

    const nextForm = sanitizeForm(profileQuery.data.profile);
    setForm(nextForm);
    setInitialSnapshot(nextForm);
  }, [profileQuery.data]);

  useEffect(() => {
    const hasUnsaved = JSON.stringify(sanitizeForm(form)) !== JSON.stringify(sanitizeForm(initialSnapshot));
    const onBeforeUnload = (event) => {
      if (!hasUnsaved) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [form, initialSnapshot]);

  const sanitizedForm = useMemo(() => sanitizeForm(form), [form]);
  const sanitizedInitial = useMemo(() => sanitizeForm(initialSnapshot), [initialSnapshot]);

  const isDirty = useMemo(
    () => JSON.stringify(sanitizedForm) !== JSON.stringify(sanitizedInitial),
    [sanitizedForm, sanitizedInitial],
  );

  const validationErrors = useMemo(() => {
    const nextErrors = {};

    requiredFields.forEach((field) => {
      if (!sanitizedForm[field]) {
        nextErrors[field] = "This field is required.";
      }
    });

    urlFields.forEach((field) => {
      if (!isValidOptionalUrl(sanitizedForm[field])) {
        nextErrors[field] = "Enter a valid URL including http:// or https://";
      }
    });

    return nextErrors;
  }, [sanitizedForm]);

  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  const changedPayload = useMemo(() => {
    return Object.keys(sanitizedForm).reduce((acc, key) => {
      if (sanitizedForm[key] !== sanitizedInitial[key]) {
        acc[key] = sanitizedForm[key];
      }
      return acc;
    }, {});
  }, [sanitizedForm, sanitizedInitial]);

  const completionPercent = Math.round(((onboardingQuery.data?.readinessScore || 0) / 10) * 100);
  const completionLabel = getCompletionLabel(completionPercent);

  const missingFields = readinessFields.filter((field) => !sanitizedForm[field]);

  const enrollment = enrollmentsQuery.data?.enrollments?.[0] || null;
  const plan = enrollment?.planSlug || profileQuery.data?.profile?.selectedPlan || "none";
  const supportLevel = plan === "pro" ? "high-touch" : plan === "standard" ? "structured" : "not-set";

  const accountName = [profileQuery.data?.user?.firstName, profileQuery.data?.user?.lastName]
    .filter(Boolean)
    .join(" ");

  const onChangeField = (event) => {
    const { name, value } = event.target;
    setFeedback("");
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setForm(sanitizedInitial);
    setErrors({});
    setFeedback("");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setErrors(validationErrors);

    if (!isDirty || hasValidationErrors || !Object.keys(changedPayload).length) {
      return;
    }

    try {
      await updateMutation.mutateAsync(changedPayload);
      const nextSnapshot = sanitizeForm({ ...sanitizedInitial, ...changedPayload });
      setInitialSnapshot(nextSnapshot);
      setForm(nextSnapshot);
      setErrors({});
      setFeedback("Profile saved successfully.");
    } catch (error) {
      setFeedback(error.message || "Unable to save profile.");
    }
  };

  const handleLeaveSettings = () => {
    if (isDirty) {
      const shouldLeave = window.confirm("You have unsaved changes. Leave without saving?");
      if (!shouldLeave) return;
    }

    navigate("/dashboard");
  };

  if (profileQuery.isLoading) {
    return <div className="settings-page">Loading account settings...</div>;
  }

  if (profileQuery.isError) {
    return (
      <div className="settings-page settings-page--error">
        <p>{profileQuery.error?.message || "Unable to load account settings."}</p>
        <button onClick={() => profileQuery.refetch()} type="button">Retry</button>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-page__header">
        <h1>Account Settings</h1>
        <p>Manage your mentorship profile, links, and readiness</p>
      </div>

      <div className="settings-page__layout">
        <form className="settings-form" onSubmit={handleSave}>
          <section className="settings-card">
            <h2>Engineering profile</h2>
            <label>Current role<input name="currentRole" value={form.currentRole} onChange={onChangeField} /></label>
            <label>Skill level
              <select name="skillLevel" value={form.skillLevel} onChange={onChangeField}>
                <option value="">Select skill level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
            <label>MERN experience<textarea name="mernExperience" value={form.mernExperience} onChange={onChangeField} /></label>
            <label>AI experience<textarea name="aiExperience" value={form.aiExperience} onChange={onChangeField} /></label>
          </section>

          <section className="settings-card">
            <h2>Goals and context</h2>
            <label>Primary goal<textarea name="primaryGoal" value={form.primaryGoal} onChange={onChangeField} /></label>
            <label>Biggest blocker<textarea name="biggestBlocker" value={form.biggestBlocker} onChange={onChangeField} /></label>
            <label>Current project summary<textarea name="currentProjectSummary" value={form.currentProjectSummary} onChange={onChangeField} /></label>
            <label>Preferred start timeline
              <select name="preferredStartTimeline" value={form.preferredStartTimeline} onChange={onChangeField}>
                <option value="">Select timeline</option>
                <option value="immediately">Immediately</option>
                <option value="within_30_days">Within 30 days</option>
                <option value="within_90_days">Within 90 days</option>
                <option value="just_exploring">Just exploring</option>
              </select>
            </label>
          </section>

          <section className="settings-card">
            <h2>Links and location</h2>
            <label>GitHub URL<input name="githubUrl" value={form.githubUrl} onChange={onChangeField} /></label>
            <label>Portfolio URL<input name="portfolioUrl" value={form.portfolioUrl} onChange={onChangeField} /></label>
            <label>LinkedIn URL<input name="linkedinUrl" value={form.linkedinUrl} onChange={onChangeField} /></label>
            <label>Timezone<input name="timezone" value={form.timezone} onChange={onChangeField} /></label>
            <label>Country<input name="country" value={form.country} onChange={onChangeField} /></label>
          </section>

          <div className="settings-actions">
            <button type="button" onClick={handleReset} disabled={updateMutation.isPending || !isDirty}>Reset</button>
            <button type="submit" disabled={profileQuery.isLoading || updateMutation.isPending || !isDirty || hasValidationErrors}>
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="settings-errors">
              {Object.entries(errors).map(([key, message]) => (
                <p key={key}>{prettyFieldName[key] || key}: {message}</p>
              ))}
            </div>
          )}

          {feedback ? <p className="settings-feedback">{feedback}</p> : null}
        </form>

        <aside className="settings-summary">
          <section className="settings-card">
            <h3>Account</h3>
            <p><strong>Name:</strong> {accountName || "Not set"}</p>
            <p><strong>Email:</strong> {profileQuery.data?.user?.email || "Not set"}</p>
            <p><strong>Role:</strong> {profileQuery.data?.user?.role || "student"}</p>
          </section>

          <section className="settings-card">
            <h3>Profile completeness</h3>
            <p><strong>Completion:</strong> {completionPercent}%</p>
            <p><strong>Readiness score:</strong> {onboardingQuery.data?.readinessScore || 0}/10</p>
            <p><strong>Status:</strong> {completionLabel}</p>
            <p><strong>Missing fields:</strong></p>
            <ul>
              {missingFields.length ? missingFields.map((field) => <li key={field}>{prettyFieldName[field]}</li>) : <li>All required fields completed.</li>}
            </ul>
          </section>

          <section className="settings-card">
            <h3>Plan & support summary</h3>
            <p><strong>Plan:</strong> {plan}</p>
            <p><strong>Enrollment status:</strong> {enrollment?.status || "none"}</p>
            <p><strong>Application status:</strong> {enrollment?.applicationStatus || "draft"}</p>
            <p><strong>Payment status:</strong> {enrollment?.paymentStatus || "not_required"}</p>
            <p><strong>Support level:</strong> {supportLevel}</p>
          </section>

          <section className="settings-card">
            <h3>Save state</h3>
            <p>{isDirty ? "You have unsaved changes" : "All changes saved"}</p>
            <button type="button" onClick={handleLeaveSettings}>Back to dashboard</button>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Settings;
