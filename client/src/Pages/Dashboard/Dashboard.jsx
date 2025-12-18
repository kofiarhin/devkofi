import "./dashboard.styles.scss";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div id="dashboard">
      <h1 className="heading center">Welcome {user?.firstName} </h1>
    </div>
  );
};

export default Dashboard;
