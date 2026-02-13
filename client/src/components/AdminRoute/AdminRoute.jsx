import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const AdminRoute = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  //test
  const stored = getStoredUser();
  const role = user?.role || stored?.role || null;

  if (role !== "admin") {
    return (
      <Navigate to="/dashboard" state={{ from: location.pathname }} replace />
    );
  }

  return <Outlet />;
};

export default AdminRoute;
