import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// dashboard
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);
  return (
    <div>
      <h1 className="heading center">Dashboard</h1>
    </div>
  );
};

export default Dashboard;
