import "./dashboard.styles.scss";
import { useSelector } from "react-redux";
import StudentDashboard from "./StudentDashboard/StudentDashboard";
import AdminDashboard from "./ADminDashboard/AdminDashboard";
import EnrollmentStatusCard from "../../components/EnrollmentStatusCard/EnrollmentStatusCard";
import useMyEnrollmentsQuery from "../../hooks/useMyEnrollmentsQuery";
import useMyAccessRequestsQuery from "../../hooks/useMyAccessRequestsQuery";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { data: enrollmentsData, isLoading: enrollmentsLoading } =
    useMyEnrollmentsQuery(token);
  const {
    data: accessRequestsData,
    isLoading: accessRequestsLoading,
    error: accessRequestsError,
  } = useMyAccessRequestsQuery(token);

  const enrollmentError =
    accessRequestsError?.message || enrollmentsData?.error || "";

  const enrollments = enrollmentsData?.enrollments || [];
  const requests = accessRequestsData?.requests || [];

  return (
    <div id="dashboard">
      <div className="container">
        {user && user?.role === "student" && (
          <EnrollmentStatusCard
            enrollments={enrollments}
            requests={requests}
            loading={enrollmentsLoading || accessRequestsLoading}
            error={enrollmentError}
          />
        )}
        {user && user?.role === "student" && <StudentDashboard user={user} />}
        {user && user?.role === "admin" && <AdminDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
