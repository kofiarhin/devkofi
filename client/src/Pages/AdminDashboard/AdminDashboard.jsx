import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useContactMessages from '../../hooks/queries/useContactMessages';
import useNewsletterSubscribers from '../../hooks/queries/useNewsletterSubscribers';
import useLogoutAdmin from '../../hooks/mutations/useLogoutAdmin';
import s from './AdminDashboard.module.scss';

const TABS = ['Contact Messages', 'Newsletter Subscribers'];

const Spinner = () => (
  <div className={s.spinnerWrap}>
    <div className={s.spinner} />
  </div>
);

const Pagination = ({ page, total, limit, onPrev, onNext }) => {
  const totalPages = Math.ceil(total / limit) || 1;
  return (
    <div className={s.pagination}>
      <span>Page {page} of {totalPages} &mdash; {total} total</span>
      <div className={s.paginationBtns}>
        <button onClick={onPrev} disabled={page <= 1} className={s.pageBtn}>Prev</button>
        <button onClick={onNext} disabled={page >= totalPages} className={s.pageBtn}>Next</button>
      </div>
    </div>
  );
};

const ContactMessagesTab = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useContactMessages(page);
  const { messages = [], total = 0, limit = 20 } = data?.data?.data || {};

  if (isLoading) return <Spinner />;
  if (!messages.length) return <p className={s.empty}>No messages yet</p>;

  return (
    <>
      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody className={s.tbody}>
            {messages.map((msg) => (
              <tr key={msg._id}>
                <td>{msg.name}</td>
                <td className={s.cellMuted}>{msg.email}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/messages/${msg._id}`)}
                    className={s.subjectBtn}
                    aria-label={`View message from ${msg.name}`}
                  >
                    {msg.subject || 'No subject'}
                  </button>
                </td>
                <td className={s.cellTruncate} title={msg.message}>{msg.message}</td>
                <td className={s.cellMono}>{new Date(msg.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={total} limit={limit}
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </>
  );
};

const NewsletterSubscribersTab = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNewsletterSubscribers(page);
  const { subscribers = [], total = 0, limit = 20 } = data?.data?.data || {};

  if (isLoading) return <Spinner />;
  if (!subscribers.length) return <p className={s.empty}>No subscribers yet</p>;

  return (
    <>
      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th>Email</th>
              <th>Subscribed</th>
            </tr>
          </thead>
          <tbody className={s.tbody}>
            {subscribers.map((sub) => (
              <tr key={sub._id}>
                <td>{sub.email}</td>
                <td className={s.cellMono}>{new Date(sub.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={total} limit={limit}
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const admin = useSelector((state) => state.auth.admin);
  const { mutate: logout, isPending: loggingOut } = useLogoutAdmin();

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={s.headerLeft}>
          <span className={s.headerBadge}>Admin</span>
          <h1 className={s.headerTitle}>Dashboard</h1>
        </div>
        <div className={s.headerRight}>
          <span className={s.adminEmail}>{admin?.email}</span>
          <button onClick={() => logout()} disabled={loggingOut} className={s.logoutBtn}>
            {loggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </header>

      <main className={s.main}>
        <div className={s.tabs}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`${s.tab} ${activeTab === i ? s.active : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={s.card}>
          {activeTab === 0 ? <ContactMessagesTab /> : <NewsletterSubscribersTab />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
