import "./adminDashboard.styles.scss";
import { useEffect, useState } from "react";
import useUsers from "../../hooks/useUsers";
import UserList from "../../components/UserList/UserList";
import users from "../../data/users.json";

const AdminDashboard = () => {
  const { data, isLoading, isPending } = useUsers();

  if (isPending) {
    return <h2>Loading... </h2>;
  }

  return (
    <div id="admin-dashboard">
      {" "}
      {data && data?.length > 0 && <UserList users={data} />}{" "}
    </div>
  );
};

export default AdminDashboard;
