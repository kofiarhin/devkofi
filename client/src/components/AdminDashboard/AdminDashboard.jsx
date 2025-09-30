import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  return <div>AdminDashboard</div>;
};

export default AdminDashboard;
