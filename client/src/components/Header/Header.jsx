import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaBars } from "react-icons/fa";
import { toggleNav } from "../../redux/navigation/navigationSlice";
import "./header.styles.scss";
import SideNav from "../SideNav/SideNav";

// header
const Header = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.navigation);
  console.log(isOpen);
  const handleToggleNav = () => {
    dispatch(toggleNav());
  };
  return (
    <header className="header">
      {isOpen ? <SideNav /> : ""}
      <div className="container">
        <Link to="/" className="logo">
          <h2>DevKofi</h2>
        </Link>
        <div className="menu">
          <FaBars onClick={handleToggleNav} />
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
