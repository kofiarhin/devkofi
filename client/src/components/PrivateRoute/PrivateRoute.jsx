import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const location = useLocation();
  const { token, user } = useSelector((state) => state.auth);

  const hasToken =
    !!token ||
    !!user?.token ||
    !!JSON.parse(localStorage.getItem("user"))?.token;

  return hasToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};

export default PrivateRoute;
