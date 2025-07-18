import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaBars } from "react-icons/fa";
import { toggleNav } from "../../redux/navigation/navigationSlice";
import "./header.styles.scss";
import SideNav from "../SideNav/SideNav";
import profileImage from "../../assets/img/profile.jpg";

// header
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.navigation);
  const handleToggleNav = () => {
    dispatch(toggleNav());
  };
  return (
    <header className="header">
      {isOpen ? <SideNav /> : ""}
      <div className="container">
        <div className="logo-wrapper">
          <img src={profileImage} alt="" />
          <Link to="/" className="logo">
            <h2>
              Dev<span>Kofi</span>{" "}
            </h2>
          </Link>
        </div>

        <div className="center-nav">
          <button onClick={() => navigate("/mentorship")}> Join Now!</button>
          <FaBars onClick={handleToggleNav} className="menu" />
        </div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/course-outline">Course Outline</Link>
          {/* <Link to="/templates">Templates</Link> */}
          <Link to="/contact">Contact</Link>
          {import.meta.env.DEV ? <Link to="/playground">Playground</Link> : ""}
          <button onClick={() => navigate("/mentorship")} className="join">
            Join Now
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
