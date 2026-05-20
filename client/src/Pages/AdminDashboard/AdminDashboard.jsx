import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useContactMessages from '../../hooks/queries/useContactMessages';
import useNewsletterSubscribers from '../../hooks/queries/useNewsletterSubscribers';
import useLogoutAdmin from '../../hooks/mutations/useLogoutAdmin';
import {
  deleteContactMessage,
  deleteNewsletterSubscriber,
  exportNewsletterSubscribersCsv,
  exportNewsletterSubscribersJson,
  updateContactMessage,
  updateNewsletterSubscriber,
} from '../../services/adminService';
import downloadFile, { getFilenameFromDisposition } from '../../utils/downloadFile';
import AdminBookingsTab from '../../components/AdminBookings/AdminBookingsTab';
import s from './AdminDashboard.module.scss';

const TABS = ['Bookings', 'Contact Messages', 'Newsletter Subscribers'];

const getApiError = (error, fallback = 'Something went wrong. Please try again.') =>
  error?.response?.data?.error || fallback;

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
        <button type="button" onClick={onPrev} disabled={page <= 1} className={s.pageBtn}>Prev</button>
        <button type="button" onClick={onNext} disabled={page >= totalPages} className={s.pageBtn}>Next</button>
      </div>
    </div>
  );
};

const AdminFilters = ({ search, filterValue, filterLabel, options, onSearch, onFilter, onReset }) => (
  <div className={s.filters}>
    <label className={s.filterField}>
      <span>Search</span>
      <input
        type="search"
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Search records"
      />
    </label>

    <label className={s.filterField}>
      <span>{filterLabel}</span>
      <select value={filterValue} onChange={(event) => onFilter(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>

    <button type="button" className={s.secondaryBtn} onClick={onReset}>Reset</button>
  </div>
);

const ContactForm = ({ message, mutation, onDone }) => {
  const [form, setForm] = useState({
    name: message.name || '',
    email: message.email || '',
    subject: message.subject || '',
    message: message.message || '',
    isRead: Boolean(message.isRead),
  });
  const [error, setError] = useState('');

  const setValue = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setError('All contact message fields are required.');
      return;
    }

    try {
      await mutation.mutateAsync({ messageId: message._id, payload: form });
      onDone();
    } catch (apiError) {
      setError(getApiError(apiError, 'Message could not be saved.'));
    }
  };

  return (
    <form className={s.panelForm} onSubmit={handleSubmit}>
      <label className={s.panelField}>
        <span>Name</span>
        <input value={form.name} onChange={(event) => setValue('name', event.target.value)} />
      </label>

      <label className={s.panelField}>
        <span>Email</span>
        <input type="email" value={form.email} onChange={(event) => setValue('email', event.target.value)} />
      </label>

      <label className={s.panelField}>
        <span>Subject</span>
        <input value={form.subject} onChange={(event) => setValue('subject', event.target.value)} />
      </label>

      <label className={s.panelField}>
        <span>Message</span>
        <textarea rows="6" value={form.message} onChange={(event) => setValue('message', event.target.value)} />
      </label>

      <label className={s.checkboxField}>
        <input
          type="checkbox"
          checked={form.isRead}
          onChange={(event) => setValue('isRead', event.target.checked)}
        />
        <span>Mark as read</span>
      </label>

      {error ? <p className={s.errorText} role="alert">{error}</p> : null}

      <div className={s.panelActions}>
        <button type="submit" className={s.primaryBtn} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save message'}
        </button>
      </div>
    </form>
  );
};

const ContactMessagesTab = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ page: 1, limit: 20, search: '', isRead: 'all' });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [mode, setMode] = useState('details');
  const { data, isLoading, isError, refetch } = useContactMessages(filters);
  const { messages = [], total = 0, limit = 20, page = filters.page } = data?.data?.data || {};

  const updateMutation = useMutation({
    mutationFn: ({ messageId, payload }) => updateContactMessage(messageId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contactMessages'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContactMessage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contactMessages'] }),
  });

  const queryParams = useMemo(() => {
    const next = { page: filters.page, limit: filters.limit };
    if (filters.search.trim()) next.search = filters.search.trim();
    if (filters.isRead !== 'all') next.isRead = filters.isRead;
    return next;
  }, [filters]);

  const syncFilters = (patch) => setFilters((current) => ({ ...current, ...patch }));

  const openPanel = (message, nextMode) => {
    setSelectedMessage(message);
    setMode(nextMode);
  };

  const closePanel = () => {
    setSelectedMessage(null);
    setMode('details');
  };

  const handleToggleRead = async (message) => {
    await updateMutation.mutateAsync({ messageId: message._id, payload: { isRead: !message.isRead } });
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(selectedMessage._id);
    closePanel();
  };

  if (isLoading) return <Spinner />;

  return (
    <section>
      <AdminFilters
        search={filters.search}
        filterValue={filters.isRead}
        filterLabel="Status"
        options={[
          { label: 'All', value: 'all' },
          { label: 'Unread', value: 'false' },
          { label: 'Read', value: 'true' },
        ]}
        onSearch={(search) => syncFilters({ search, page: 1 })}
        onFilter={(isRead) => syncFilters({ isRead, page: 1 })}
        onReset={() => setFilters({ page: 1, limit: 20, search: '', isRead: 'all' })}
      />

      {isError ? (
        <div className={s.empty}>
          <p role="alert">Messages could not be loaded.</p>
          <button type="button" className={s.secondaryBtn} onClick={() => refetch()}>Retry</button>
        </div>
      ) : !messages.length ? (
        <p className={s.empty}>No messages found</p>
      ) : (
        <>
          <div className={s.tableWrapper}>
            <table className={s.table}>
              <thead className={s.thead}>
                <tr>
                  <th>Status</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className={s.tbody}>
                {messages.map((msg) => (
                  <tr key={msg._id}>
                    <td><span className={`${s.statusPill} ${msg.isRead ? s.statusRead : s.statusUnread}`}>{msg.isRead ? 'Read' : 'Unread'}</span></td>
                    <td>{msg.name}</td>
                    <td className={s.cellMuted}>{msg.email}</td>
                    <td>{msg.subject || 'No subject'}</td>
                    <td className={s.cellTruncate} title={msg.message}>{msg.message}</td>
                    <td className={s.cellMono}>{new Date(msg.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className={s.rowActions}>
                        <button type="button" className={s.actionBtn} onClick={() => openPanel(msg, 'details')}>View</button>
                        <button type="button" className={s.actionBtn} onClick={() => openPanel(msg, 'edit')}>Edit</button>
                        <button type="button" className={s.actionBtn} onClick={() => handleToggleRead(msg)}>
                          {msg.isRead ? 'Unread' : 'Read'}
                        </button>
                        <button type="button" className={s.dangerBtn} onClick={() => openPanel(msg, 'delete')}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            total={total}
            limit={limit}
            onPrev={() => syncFilters({ page: Math.max(1, filters.page - 1) })}
            onNext={() => syncFilters({ page: filters.page + 1 })}
          />
        </>
      )}

      {selectedMessage && (
        <div className={s.overlay}>
          <aside className={s.panel} role="dialog" aria-modal="true" aria-labelledby="contact-panel-title">
            <div className={s.panelTop}>
              <h2 id="contact-panel-title">Contact Message</h2>
              <button type="button" className={s.closeBtn} onClick={closePanel}>Close</button>
            </div>

            {mode === 'edit' ? (
              <ContactForm
                message={selectedMessage}
                mutation={updateMutation}
                onDone={closePanel}
              />
            ) : mode === 'delete' ? (
              <div className={s.panelStack}>
                <p>Delete message from <strong>{selectedMessage.name}</strong> permanently?</p>
                {deleteMutation.error ? <p className={s.errorText}>{getApiError(deleteMutation.error, 'Delete failed.')}</p> : null}
                <div className={s.panelActions}>
                  <button type="button" className={s.dangerBtn} onClick={handleDelete} disabled={deleteMutation.isPending}>
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete message'}
                  </button>
                  <button type="button" className={s.secondaryBtn} onClick={() => setMode('details')}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className={s.panelStack}>
                <span className={`${s.statusPill} ${selectedMessage.isRead ? s.statusRead : s.statusUnread}`}>{selectedMessage.isRead ? 'Read' : 'Unread'}</span>
                <h3>{selectedMessage.subject}</h3>
                <p className={s.cellMuted}>{selectedMessage.name} · {selectedMessage.email}</p>
                <p>{selectedMessage.message}</p>
                <div className={s.panelActions}>
                  <button type="button" className={s.primaryBtn} onClick={() => setMode('edit')}>Edit</button>
                  <button type="button" className={s.secondaryBtn} onClick={() => handleToggleRead(selectedMessage)}>
                    {selectedMessage.isRead ? 'Mark unread' : 'Mark read'}
                  </button>
                  <button type="button" className={s.dangerBtn} onClick={() => setMode('delete')}>Delete</button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </section>
  );
};

const NewsletterSubscribersTab = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ page: 1, limit: 20, search: '', verified: 'all' });
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [editEmail, setEditEmail] = useState('');
  const [panelMode, setPanelMode] = useState('edit');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [exportError, setExportError] = useState('');
  const { data, isLoading, isError, refetch } = useNewsletterSubscribers(filters);
  const { subscribers = [], total = 0, limit = 20, page = filters.page } = data?.data?.data || {};

  const updateMutation = useMutation({
    mutationFn: ({ subscriberId, payload }) => updateNewsletterSubscriber(subscriberId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['newsletterSubscribers'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNewsletterSubscriber,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['newsletterSubscribers'] }),
  });

  const csvMutation = useMutation({ mutationFn: exportNewsletterSubscribersCsv });
  const jsonMutation = useMutation({ mutationFn: exportNewsletterSubscribersJson });
  const isExporting = csvMutation.isPending || jsonMutation.isPending;

  const exportActions = useMemo(
    () => ({
      csv: {
        fallbackName: `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`,
        run: csvMutation.mutateAsync,
      },
      json: {
        fallbackName: `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.json`,
        run: jsonMutation.mutateAsync,
      },
    }),
    [csvMutation.mutateAsync, jsonMutation.mutateAsync]
  );

  const syncFilters = (patch) => setFilters((current) => ({ ...current, ...patch }));

  const openPanel = (subscriber, mode) => {
    setSelectedSubscriber(subscriber);
    setEditEmail(subscriber.email || '');
    setPanelMode(mode);
  };

  const closePanel = () => {
    setSelectedSubscriber(null);
    setPanelMode('edit');
    setEditEmail('');
  };

  const handleExport = async (format) => {
    setExportError('');

    try {
      const action = exportActions[format];
      const response = await action.run();
      const filename = getFilenameFromDisposition(response.headers?.['content-disposition'], action.fallbackName);
      downloadFile({ blob: response.data, filename });
      setIsExportMenuOpen(false);
    } catch {
      setExportError('Export failed. Please try again.');
    }
  };

  const handleSaveSubscriber = async (event) => {
    event.preventDefault();
    await updateMutation.mutateAsync({
      subscriberId: selectedSubscriber._id,
      payload: { email: editEmail, verified: selectedSubscriber.verified },
    });
    closePanel();
  };

  const handleToggleVerified = async (subscriber) => {
    await updateMutation.mutateAsync({
      subscriberId: subscriber._id,
      payload: { verified: !subscriber.verified },
    });
  };

  const handleDeleteSubscriber = async () => {
    await deleteMutation.mutateAsync(selectedSubscriber._id);
    closePanel();
  };

  if (isLoading) return <Spinner />;

  return (
    <section>
      <div className={s.sectionToolbar}>
        <AdminFilters
          search={filters.search}
          filterValue={filters.verified}
          filterLabel="Verified"
          options={[
            { label: 'All', value: 'all' },
            { label: 'Verified', value: 'true' },
            { label: 'Unverified', value: 'false' },
          ]}
          onSearch={(search) => syncFilters({ search, page: 1 })}
          onFilter={(verified) => syncFilters({ verified, page: 1 })}
          onReset={() => setFilters({ page: 1, limit: 20, search: '', verified: 'all' })}
        />

        <div className={s.exportWrap}>
          <button type="button" onClick={() => setIsExportMenuOpen((open) => !open)} className={s.exportBtn} disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export'}
          </button>

          {isExportMenuOpen && (
            <div className={s.exportMenu} role="menu" aria-label="Export options">
              <button type="button" role="menuitem" className={s.exportMenuItem} onClick={() => handleExport('csv')} disabled={isExporting}>Export CSV</button>
              <button type="button" role="menuitem" className={s.exportMenuItem} onClick={() => handleExport('json')} disabled={isExporting}>Export JSON</button>
            </div>
          )}
        </div>
      </div>

      {exportError ? <p className={s.errorText}>{exportError}</p> : null}

      {isError ? (
        <div className={s.empty}>
          <p role="alert">Subscribers could not be loaded.</p>
          <button type="button" className={s.secondaryBtn} onClick={() => refetch()}>Retry</button>
        </div>
      ) : !subscribers.length ? (
        <p className={s.empty}>No subscribers found</p>
      ) : (
        <>
          <div className={s.tableWrapper}>
            <table className={s.table}>
              <thead className={s.thead}>
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Subscribed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className={s.tbody}>
                {subscribers.map((sub) => (
                  <tr key={sub._id}>
                    <td>{sub.email}</td>
                    <td><span className={`${s.statusPill} ${sub.verified ? s.statusRead : s.statusUnread}`}>{sub.verified ? 'Verified' : 'Unverified'}</span></td>
                    <td className={s.cellMono}>{new Date(sub.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className={s.rowActions}>
                        <button type="button" className={s.actionBtn} onClick={() => openPanel(sub, 'edit')}>Edit</button>
                        <button type="button" className={s.actionBtn} onClick={() => handleToggleVerified(sub)}>
                          {sub.verified ? 'Unverify' : 'Verify'}
                        </button>
                        <button type="button" className={s.dangerBtn} onClick={() => openPanel(sub, 'delete')}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            total={total}
            limit={limit}
            onPrev={() => syncFilters({ page: Math.max(1, filters.page - 1) })}
            onNext={() => syncFilters({ page: filters.page + 1 })}
          />
        </>
      )}

      {selectedSubscriber && (
        <div className={s.overlay}>
          <aside className={s.panel} role="dialog" aria-modal="true" aria-labelledby="subscriber-panel-title">
            <div className={s.panelTop}>
              <h2 id="subscriber-panel-title">Newsletter Subscriber</h2>
              <button type="button" className={s.closeBtn} onClick={closePanel}>Close</button>
            </div>

            {panelMode === 'delete' ? (
              <div className={s.panelStack}>
                <p>Delete <strong>{selectedSubscriber.email}</strong> permanently?</p>
                {deleteMutation.error ? <p className={s.errorText}>{getApiError(deleteMutation.error, 'Delete failed.')}</p> : null}
                <div className={s.panelActions}>
                  <button type="button" className={s.dangerBtn} onClick={handleDeleteSubscriber} disabled={deleteMutation.isPending}>
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete subscriber'}
                  </button>
                  <button type="button" className={s.secondaryBtn} onClick={() => setPanelMode('edit')}>Cancel</button>
                </div>
              </div>
            ) : (
              <form className={s.panelForm} onSubmit={handleSaveSubscriber}>
                <label className={s.panelField}>
                  <span>Email</span>
                  <input type="email" value={editEmail} onChange={(event) => setEditEmail(event.target.value)} />
                </label>

                <label className={s.checkboxField}>
                  <input
                    type="checkbox"
                    checked={selectedSubscriber.verified}
                    onChange={() => setSelectedSubscriber((current) => ({ ...current, verified: !current.verified }))}
                  />
                  <span>Verified</span>
                </label>

                {updateMutation.error ? <p className={s.errorText}>{getApiError(updateMutation.error, 'Subscriber could not be saved.')}</p> : null}

                <div className={s.panelActions}>
                  <button type="submit" className={s.primaryBtn} disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Saving...' : 'Save subscriber'}
                  </button>
                  <button type="button" className={s.dangerBtn} onClick={() => setPanelMode('delete')}>Delete</button>
                </div>
              </form>
            )}
          </aside>
        </div>
      )}
    </section>
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
          <button type="button" onClick={() => logout()} disabled={loggingOut} className={s.logoutBtn}>
            {loggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </header>

      <main className={s.main}>
        <div className={s.tabs} role="tablist" aria-label="Admin dashboard sections">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`${s.tab} ${activeTab === i ? s.active : ''}`}
              role="tab"
              aria-selected={activeTab === i}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={s.card}>
          {activeTab === 0 && <AdminBookingsTab />}
          {activeTab === 1 && <ContactMessagesTab />}
          {activeTab === 2 && <NewsletterSubscribersTab />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
