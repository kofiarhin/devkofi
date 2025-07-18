import React from "react";
import "./userList.styles.scss";

const UserList = ({ users }) => {
  if (!users) {
    return <p> No Users found</p>;
  }
  return (
    <div className="user-list">
      <h1 className="heading center">Admin Dashboard</h1>
      <div className="container">
        {users.map((user) => {
          return (
            <div className="user-unit" key={user.email}>
              <h3> {user?.fullName}</h3>
              <p> {user?.email} </p>
              <p> {user?.phone} </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;
