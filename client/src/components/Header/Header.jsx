import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "./header.styles.scss";
const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h2>DevKofi</h2>
        </Link>
        <div className="menu">
          <FaBars />
        </div>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/templates">Templates</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
