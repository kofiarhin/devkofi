import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaBars } from "react-icons/fa";
import { toggleNav } from "../../redux/navigation/navigationSlice";
import "./header.styles.scss";
import SideNav from "../SideNav/SideNav";
import { profileImage } from "../../constants/constants";
import { logoutUser } from "../../redux/auth/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // Only show playground in dev, but strictly restrict nav items
  const isDevEnvironment = import.meta.env.MODE !== "production";

  const handleToggleNav = () => dispatch(toggleNav());

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logoutUser());
  };

  return (
    <>
      <SideNav />
      <header className="header">
        <div className="container">
          <div className="logo-wrapper">
            <Link to="/">
              <img src={profileImage} alt="DevKofi Profile" />
            </Link>
            <Link to="/" className="logo">
              <h2>
                Dev<span>Kofi</span>
              </h2>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="center-nav">
            {!user && (
              <button onClick={() => navigate("/register")}>Join Now</button>
            )}
            <FaBars onClick={handleToggleNav} className="menu" />
          </div>

          {/* Desktop Nav - CLEANED UP */}
          <nav>
            <Link to="/">Home</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/projects">Projects</Link>
            {/* Moved Youtube/Chat/About/Contact to Footer or SideNav to reduce noise */}

            {isDevEnvironment && <Link to="/playground">Playground</Link>}

            {user ? (
              <>
                <Link to="/portal">Portal</Link>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <button onClick={() => navigate("/register")} className="join">
                  Join Now
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
