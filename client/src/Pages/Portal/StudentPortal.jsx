import { Link } from "react-router-dom";
const StudentPortal = ({ user }) => {
  return (
    <div>
      <h1 className="heading center">Welcome {user?.fullName} </h1>

      {/* text-wrapper */}
      <Link to="/profile" className="text-wrapper">
        <p>
          This is your Student Dashboard. From here, you can view assignments,
          check your messages, and update your profile.
        </p>
      </Link>
      {/* end text-wrapper */}
      {/* menu wrapper */}
      <div className="menu-wrapper">
        {/* menu-unit */}
        <div className="menu-unit">
          <h2>Profile</h2>
          <p>
            Keep your details up to date so your instructors can contact you.
          </p>
        </div>
        {/* end mneu unit */}

        {/* menu-unit */}
        <div className="menu-unit">
          <h2>Messages</h2>
          <p>Stay connected with your instructors and classmates.</p>
        </div>
        {/* end mneu unit */}

        {/* menu-unit */}
        <div className="menu-unit">
          <h2>Assignments</h2>
          <p>Track and manage your coursework easily.</p>
        </div>
        {/* end mneu unit */}
      </div>
      {/* end menu-wrapper */}
    </div>
  );
};

export default StudentPortal;
