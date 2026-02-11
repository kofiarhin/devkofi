import { useState } from "react";
import { useSelector } from "react-redux";
import useTeamAccessRequestMutation from "../../hooks/useTeamAccessRequestMutation";
import "./enterprise.styles.scss";

const Enterprise = () => {
  const token = useSelector((state) => state.auth.token);
  const { mutate, isPending, isSuccess, data, error } =
    useTeamAccessRequestMutation(token);

  const [form, setForm] = useState({
    companyName: "",
    companySize: "",
    message: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div className="enterprise-page">
      <div className="enterprise-card">
        <h1 className="enterprise-title">Team / Enterprise</h1>
        <p className="enterprise-subtitle">
          Submit a request and we’ll reach out to schedule a discovery call.
        </p>

        <form className="enterprise-form" onSubmit={onSubmit}>
          <div className="enterprise-field">
            <label htmlFor="companyName">Company name</label>
            <input
              id="companyName"
              name="companyName"
              value={form.companyName}
              onChange={onChange}
              placeholder="Your company"
              autoComplete="organization"
            />
          </div>

          <div className="enterprise-field">
            <label htmlFor="companySize">Company size</label>
            <input
              id="companySize"
              name="companySize"
              value={form.companySize}
              onChange={onChange}
              placeholder="e.g. 3, 5, 10"
            />
          </div>

          <div className="enterprise-field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={onChange}
              placeholder="Tell us what your team is trying to ship + what you need help with."
              rows={5}
            />
          </div>

          {error && <p className="enterprise-error">{error.message}</p>}

          {isSuccess && (
            <div className="enterprise-success">
              <p>
                Request submitted:{" "}
                <strong>{data?.request?.status || "request"}</strong>
              </p>
              <p className="enterprise-muted">
                We’ll contact you to schedule a discovery call.
              </p>
            </div>
          )}

          <button className="enterprise-btn" type="submit" disabled={isPending}>
            {isPending ? "Submitting…" : "Request Access"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Enterprise;
