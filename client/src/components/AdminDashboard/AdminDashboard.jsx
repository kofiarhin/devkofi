import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const { user } = useSelsector((state) => state.auth);
  return <div>AdminDashboard</div>;
};

export default AdminDashboard;
