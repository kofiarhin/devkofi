import { FaTimes } from "react-icons/fa";
import { toggleSideNav } from "../../redux/navigation/navigationSlice";
import { logoutUser } from "../../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import "./sideNav.styles.scss";
import { Link } from "react-router-dom";

const SideNav = () => {
  const dispath = useDispatch();
  const { user } = useSelector((state) => state.auth);
  return (
    <div id="sideNav">
      <FaTimes onClick={() => dispath(toggleSideNav())} className="close" />

      <div className="content-wrapper">
        <ul>
          <li onClick={() => dispath(toggleSideNav())}>
            <Link to="/"> Home </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/dashboard" onClick={() => dispath(toggleSideNav())}>
                  Dashboard
                </Link>
              </li>

              <li>
                <button
                  onClick={() => {
                    dispath(logoutUser());
                    dispath(toggleSideNav());
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => dispath(toggleSideNav())}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={() => dispath(toggleSideNav())}>
                  {" "}
                  Register{" "}
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
