import { Link } from "react-router-dom";
import "./contact.styles.scss";

const Contact = () => {
  return (
    <section className="contact">
      <div className="overlay">
        <div className="text">
          <h1>Let’s Work Together</h1>
          <p>
            Got a project, an idea, or just want to say hello? Fill out the form
            below and I’ll get back to you as soon as possible.
          </p>
          <form className="form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                placeholder="Your message"
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
