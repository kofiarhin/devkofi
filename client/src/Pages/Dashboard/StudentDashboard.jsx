const StudentDashboard = ({ user }) => {
  return (
    <div className="dashboard-wrapper">
      <h1 className="heading center">Welcome {user.fullName}</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis id
        eaque dicta laboriosam, perferendis accusamus quos vel numquam eveniet
        sapiente!
      </p>
    </div>
  );
};

export default StudentDashboard;
