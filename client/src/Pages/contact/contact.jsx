import { useState } from "react";
import { Link } from "react-router-dom";
import "./contact.styles.scss";
import usecontactMutation from "../../hooks/useContactMutation";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";

const Contact = () => {
  const navigate = useNavigate();
  const { mutate, isPending, error, isSuccess } = usecontactMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate(formData);

    // Clear form after submit (optional)
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  if (error) {
    navigate("/error");
  }

  if (isPending) {
    return <Spinner />;
  }

  if (isSuccess) {
    navigate("/success");
  }

  return (
    <section className="contact">
      <div className="overlay">
        <div className="text">
          <h1>Let’s Work Together</h1>
          <p>
            Got a project, an idea, or just want to say hello? Fill out the form
            below and I’ll get back to you as soon as possible.
          </p>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
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
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                placeholder="Your message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="primary-btn">
              Send Message
            </button>
          </form>
          <div className="actions">
            <Link to="/" className="secondary-btn">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
