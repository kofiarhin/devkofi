import "./header.styles.scss";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaBars } from "react-icons/fa";
import { toggleSideNav } from "../../redux/navigation/navigationSlice";

const Header = () => {
  const dispatch = useDispatch();

  return (
    <header className="main-header">
      <div className="container header-content">
        <Link to="/" className="logo-container">
          <h1 className="logo">
            Dev<span>Kofi</span>
          </h1>
        </Link>

        <nav className="nav-links">
          <Link to="/" className="nav-item">
            Home
          </Link>
          <Link to="/about" className="nav-item">
            About
          </Link>
          <Link to="/projects" className="nav-item">
            Projects
          </Link>
          <Link to="/contact" className="nav-item">
            Contact
          </Link>
          <Link to="/book-a-call" className="btn-cta">
            Book a Call
          </Link>
        </nav>

        <div className="mobile-actions">
          <FaBars
            className="menu-icon"
            onClick={() => dispatch(toggleSideNav())}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
