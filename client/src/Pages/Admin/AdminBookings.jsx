import AdminBookingsTab from '../../components/AdminBookings/AdminBookingsTab';
import s from './Admin.module.scss';
const AdminBookings = () => <section className={s.page}><header className={s.header}><div><h1>Bookings</h1><p>Manage scheduled calls and availability.</p></div></header><AdminBookingsTab /></section>;
export default AdminBookings;
