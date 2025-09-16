import "./users.styles.scss";
import { useSelector } from "react-redux";
import useUsersQuery from "../../hooks/useUsersQuery";
import Spinner from "../../components/Spinner/Spinner";
import UserList from "../../components/UserList/UserList";
const Users = () => {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading } = useUsersQuery(user?.token);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <section id="users">
      <h1 className="heading center">Students</h1>
      {data && <UserList users={data} />}
    </section>
  );
};

export default Users;
