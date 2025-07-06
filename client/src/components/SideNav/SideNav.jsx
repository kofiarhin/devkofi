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
      <Link to="/templates" onClick={nandleToggleNav}>
        Templates
      </Link>
      <Link to="/contact" onclick={nandleToggleNav}>
        Contact
      </Link>
    </div>
  );
};

export default SideNav;
