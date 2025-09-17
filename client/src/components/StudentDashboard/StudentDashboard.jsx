import "./studentDashboard.styles.scss";
import { useSelector } from "react-redux";
import { MdMessage, MdAssignment, MdPerson } from "react-icons/md";
const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { fullName, ...rest } = user;
  return (
    <div id="student-dashboard">
      <h1 className="heading center">Welcome! {fullName} </h1>

      {/* dashboard-wrapper */}
      <div className="dashboard-wrapper">
        {/* dashboard-unit */}
        <div className="dashboard-unit">
          <h3>Messages</h3>
          <MdMessage className="icon" />
          <p>
            Stay connected with your instructors and classmates. View new
            messages, respond quickly, and keep track of important announcements
            all in one place.
          </p>
        </div>
        {/* end dashboard-unit */}

        {/* dashboard-unit */}
        <div className="dashboard-unit">
          <h3>Assignments</h3>
          <MdAssignment className="icon" />
          <p>
            Access your upcoming assignments, track submission deadlines, and
            review feedback. Stay organized and never miss an important task.
          </p>
        </div>
        {/* end dashboard-unit */}

        {/* dashboard-unit */}
        <div className="dashboard-unit">
          <h3>Profile</h3>
          <MdPerson className="icon" />
          <p>
            Manage your personal information, update account details, and
            customize your student profile to keep your portal up to date.
          </p>
        </div>
        {/* end dashboard-unit */}
      </div>
      {/* end dashboard-wrapper */}
    </div>
  );
};

export default StudentDashboard;
