import React from "react";
import AdminDashboard from "../Dashboard/ADminDashboard/AdminDashboard";

const user = {
  firstName: "kofi",
  lastName: "Arhin",
  email: "kofi@gmail.com",
  role: "admin",
};
const Playground = () => {
  return (
    <div>
      <AdminDashboard user={user} />
    </div>
  );
};

export default Playground;
