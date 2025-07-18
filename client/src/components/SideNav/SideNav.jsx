import "./sideNav.styles.scss";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toggleNav } from "../../redux/navigation/navigationSlice";

import { Link } from "react-router-dom";

const SideNav = () => {
  const dispatch = useDispatch();

  const nandleToggleNav = () => {
    dispatch(toggleNav());
  };
  return (
    <div id="sideNav" className="close">
      <FaTimes className="close" onClick={() => dispatch(toggleNav())} />
      <Link to="/" onClick={nandleToggleNav}>
        Home
      </Link>

      <Link to="/course-outline" onClick={nandleToggleNav}>
        Course Outline
      </Link>

      <Link to="/contact" onClick={nandleToggleNav}>
        Contact
      </Link>

      {import.meta.env.DEV && (
        <Link to="/playground" onClick={nandleToggleNav}>
          Playground
        </Link>
      )}
    </div>
  );
};

export default SideNav;
