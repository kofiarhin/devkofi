import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import useMentorshipMutation from "../../hooks/useMentorshipMutation";
import "./mentorship.styles.scss";

const MentorshipForm = () => {
  const navigate = useNavigate();
  const { mutate, isPending, error, isSuccess } = useMentorshipMutation();
  const [formData, setFormData] = useState({
    fullName: "david kraku",
    email: "davidkraku69@gmail.com",
    phone: "2342342432",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
    return;
    if (!formData.fullName || !formData.email) {
      alert("Please fill in Full Name and Email.");
      return;
    }
    mutate(formData);
    setFormData({ fullName: "david karku", email: "", phone: "" });
  };

  if (error) navigate("/error");
  if (isPending) return <Spinner />;
  if (isSuccess) navigate("/success");

  return (
    <section className="mentorship">
      <div className="overlay">
        <h1>Join Mentorship</h1>
        <p>Enter your information, and I’ll contact you soon.</p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name*</label>
            <input
              id="fullName"
              placeholder="e.g. Jane Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              placeholder="e.g. +44 1234 567890"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="primary-btn">
            Submit
          </button>
        </form>

        <div className="actions">
          <Link to="/" className="secondary-btn">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MentorshipForm;
