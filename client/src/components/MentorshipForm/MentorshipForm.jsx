import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import useMentorshipMutation from "../../hooks/useMentorshipMutation";
import "./mentorship.styles.scss";

const MentorshipForm = () => {
  const navigate = useNavigate();
  const { mutate, isPending, error, isSuccess, data } = useMentorshipMutation();
  const [formData, setFormData] = useState({
    fullName: "nicholas owusu amaniampong",
    email: "amaniampongnicholas@gmail.com",
    phone: "2343242343243",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
    });
  };

  if (isPending) return <Spinner />;
  if (data && data?.success) {
    navigate("/success?type=mentorship");
  }
  // if (isSuccess) navigate("/success?type=mentorship");

  return (
    <section className="mentorship">
      <div className="overlay">
        <h1 className="heading">Join Mentorship</h1>
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

          {data && data?.error && <p className="text-error"> {data?.error} </p>}
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
