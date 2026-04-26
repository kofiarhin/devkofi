import { useMemo, useState } from 'react';
import useAdminBooking from '../../hooks/queries/useAdminBooking';
import useAdminBookings from '../../hooks/queries/useAdminBookings';
import useCancelBooking from '../../hooks/mutations/useCancelBooking';
import useDeleteBooking from '../../hooks/mutations/useDeleteBooking';
import useUpdateBooking from '../../hooks/mutations/useUpdateBooking';
import s from './admin-bookings.module.scss';

const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Booked', value: 'booked' },
  { label: 'Cancelled', value: 'cancelled' },
];

const TIME_OPTIONS = ['16:00', '16:30', '17:00', '17:30'];

const getApiError = (error, fallback = 'Something went wrong. Please try again.') =>
  error?.response?.data?.error || fallback;

const toDateInputValue = (iso) => {
  if (!iso) return '';
  return iso.slice(0, 10);
};

const toTimeInputValue = (iso) => {
  if (!iso) return TIME_OPTIONS[0];
  const date = new Date(iso);
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
};

const toGmtSlotStart = (dateValue, timeValue) => {
  if (!dateValue || !timeValue) return '';
  return `${dateValue}T${timeValue}:00.000Z`;
};

const formatGmtDate = (iso) =>
  new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));

const formatGmtTime = (iso) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'UTC',
  }).format(new Date(iso));

const formatGmtRange = (booking) => {
  if (!booking?.slotStart || !booking?.slotEnd) return 'No slot';
  return `${formatGmtTime(booking.slotStart)}-${formatGmtTime(booking.slotEnd)} GMT`;
};

const isWeekendDate = (dateValue) => {
  if (!dateValue) return false;
  const date = new Date(`${dateValue}T00:00:00.000Z`);
  const day = date.getUTCDay();
  return day === 0 || day === 6;
};

const BookingStatus = ({ status }) => (
  <span className={`${s.status} ${status === 'cancelled' ? s.statusCancelled : s.statusBooked}`}>
    {status}
  </span>
);

const SkeletonRows = () => (
  <tbody className={s.tbody}>
    {Array.from({ length: 5 }).map((_, index) => (
      <tr key={index}>
        {Array.from({ length: 8 }).map((__, cellIndex) => (
          <td key={cellIndex}>
            <span className={s.skeleton} />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

const BookingFilters = ({ filters, onChange, onReset }) => (
  <div className={s.filters} aria-label="Booking filters">
    <label className={s.field}>
      <span>Status</span>
      <select
        value={filters.status}
        onChange={(event) => onChange({ status: event.target.value, page: 1 })}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>

    <label className={s.field}>
      <span>Search</span>
      <input
        type="search"
        value={filters.search}
        onChange={(event) => onChange({ search: event.target.value, page: 1 })}
        placeholder="Name, email, company"
      />
    </label>

    <label className={s.field}>
      <span>From</span>
      <input
        type="date"
        value={filters.from}
        onChange={(event) => onChange({ from: event.target.value, page: 1 })}
      />
    </label>

    <label className={s.field}>
      <span>To</span>
      <input
        type="date"
        value={filters.to}
        onChange={(event) => onChange({ to: event.target.value, page: 1 })}
      />
    </label>

    <button type="button" className={s.secondaryBtn} onClick={onReset}>
      Reset
    </button>
  </div>
);

const BookingTable = ({
  bookings,
  isLoading,
  onView,
  onEdit,
  onCancel,
  onDelete,
}) => (
  <div className={s.tableWrapper}>
    <table className={s.table}>
      <thead className={s.thead}>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Name</th>
          <th>Email</th>
          <th>Company</th>
          <th>Status</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      {isLoading ? (
        <SkeletonRows />
      ) : (
        <tbody className={s.tbody}>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className={s.cellMono}>{formatGmtDate(booking.slotStart)}</td>
              <td className={s.cellMono}>{formatGmtRange(booking)}</td>
              <td>{booking.name}</td>
              <td className={s.cellMuted}>{booking.email}</td>
              <td className={s.cellMuted}>{booking.company || 'None'}</td>
              <td><BookingStatus status={booking.status} /></td>
              <td className={s.cellMono}>{formatGmtDate(booking.createdAt)}</td>
              <td>
                <div className={s.actions}>
                  <button type="button" className={s.actionBtn} onClick={() => onView(booking.id)}>
                    View
                  </button>
                  <button type="button" className={s.actionBtn} onClick={() => onEdit(booking.id)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className={s.actionBtn}
                    onClick={() => onCancel(booking.id)}
                    disabled={booking.status === 'cancelled'}
                  >
                    Cancel
                  </button>
                  <button type="button" className={s.dangerBtn} onClick={() => onDelete(booking.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  </div>
);

const Pagination = ({ page, total, limit, onPrev, onNext }) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className={s.pagination}>
      <span>Page {page} of {totalPages} - {total} total</span>
      <div className={s.paginationBtns}>
        <button type="button" className={s.pageBtn} onClick={onPrev} disabled={page <= 1}>
          Prev
        </button>
        <button type="button" className={s.pageBtn} onClick={onNext} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

const BookingDetails = ({ booking, onEdit, onCancel, onDelete }) => (
  <div className={s.detailStack}>
    <div className={s.detailHeader}>
      <div>
        <p className={s.kicker}>Booking</p>
        <h2 id="booking-panel-title">{booking.name}</h2>
      </div>
      <BookingStatus status={booking.status} />
    </div>

    <dl className={s.detailGrid}>
      <div>
        <dt>Email</dt>
        <dd>{booking.email}</dd>
      </div>
      <div>
        <dt>Company</dt>
        <dd>{booking.company || 'None'}</dd>
      </div>
      <div>
        <dt>Date</dt>
        <dd>{formatGmtDate(booking.slotStart)}</dd>
      </div>
      <div>
        <dt>Time</dt>
        <dd>{formatGmtRange(booking)}</dd>
      </div>
      <div>
        <dt>Created</dt>
        <dd>{formatGmtDate(booking.createdAt)}</dd>
      </div>
      <div>
        <dt>Updated</dt>
        <dd>{formatGmtDate(booking.updatedAt)}</dd>
      </div>
    </dl>

    <div className={s.messageBlock}>
      <span>Message</span>
      <p>{booking.message || 'No message provided.'}</p>
    </div>

    <div className={s.panelActions}>
      <button type="button" className={s.primaryBtn} onClick={onEdit}>
        Edit
      </button>
      <button
        type="button"
        className={s.secondaryBtn}
        onClick={onCancel}
        disabled={booking.status === 'cancelled'}
      >
        Cancel booking
      </button>
      <button type="button" className={s.dangerBtn} onClick={onDelete}>
        Delete
      </button>
    </div>
  </div>
);

const BookingEditForm = ({ booking, mutation, onSaved }) => {
  const [form, setForm] = useState(() => ({
    name: booking.name || '',
    email: booking.email || '',
    company: booking.company || '',
    message: booking.message || '',
    status: booking.status || 'booked',
    date: toDateInputValue(booking.slotStart),
    time: toTimeInputValue(booking.slotStart),
  }));
  const [fieldError, setFieldError] = useState('');
  const [mutationError, setMutationError] = useState('');

  const setValue = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldError('');
    setMutationError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldError('');
    setMutationError('');

    if (!form.name.trim()) {
      setFieldError('Name is required.');
      return;
    }

    if (!form.email.trim()) {
      setFieldError('Email is required.');
      return;
    }

    if (form.status === 'booked') {
      if (!form.date || !form.time) {
        setFieldError('A date and time are required for booked calls.');
        return;
      }

      if (isWeekendDate(form.date)) {
        setFieldError('Bookings must be scheduled Monday through Friday.');
        return;
      }
    }

    const payload = {
      name: form.name,
      email: form.email,
      company: form.company,
      message: form.message,
      status: form.status,
      slotStart: toGmtSlotStart(form.date, form.time),
    };

    try {
      await mutation.mutateAsync({ bookingId: booking.id, payload });
      onSaved();
    } catch (error) {
      setMutationError(getApiError(error, 'Booking could not be saved.'));
    }
  };

  const isSaving = mutation.isPending;

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <div className={s.detailHeader}>
        <div>
          <p className={s.kicker}>Edit booking</p>
          <h2 id="booking-panel-title">{booking.name}</h2>
        </div>
      </div>

      {(fieldError || mutationError) && (
        <p className={s.alert} role="alert">{fieldError || mutationError}</p>
      )}

      <label className={s.field}>
        <span>Name</span>
        <input value={form.name} onChange={(event) => setValue('name', event.target.value)} />
      </label>

      <label className={s.field}>
        <span>Email</span>
        <input type="email" value={form.email} onChange={(event) => setValue('email', event.target.value)} />
      </label>

      <label className={s.field}>
        <span>Company</span>
        <input value={form.company} onChange={(event) => setValue('company', event.target.value)} />
      </label>

      <label className={s.field}>
        <span>Message</span>
        <textarea rows="4" value={form.message} onChange={(event) => setValue('message', event.target.value)} />
      </label>

      <div className={s.formGrid}>
        <label className={s.field}>
          <span>Status</span>
          <select value={form.status} onChange={(event) => setValue('status', event.target.value)}>
            <option value="booked">Booked</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>

        <label className={s.field}>
          <span>Date</span>
          <input type="date" value={form.date} onChange={(event) => setValue('date', event.target.value)} />
        </label>

        <label className={s.field}>
          <span>Time</span>
          <select value={form.time} onChange={(event) => setValue('time', event.target.value)}>
            {TIME_OPTIONS.map((time) => (
              <option key={time} value={time}>{time} GMT</option>
            ))}
          </select>
        </label>
      </div>

      <p className={s.helperText}>Bookings are scheduled in GMT.</p>

      <div className={s.panelActions}>
        <button type="submit" className={s.primaryBtn} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save booking'}
        </button>
      </div>
    </form>
  );
};

const ConfirmPanel = ({ booking, type, mutation, onConfirm, onBack }) => {
  const isDelete = type === 'delete';
  const actionText = isDelete ? 'Delete booking' : 'Cancel booking';
  const pendingText = isDelete ? 'Deleting...' : 'Cancelling...';
  const copy = isDelete
    ? `Delete ${booking.name}'s booking for ${formatGmtDate(booking.slotStart)} at ${formatGmtRange(booking)} permanently?`
    : `Cancel ${booking.name}'s booking for ${formatGmtDate(booking.slotStart)} at ${formatGmtRange(booking)}?`;

  return (
    <div className={s.detailStack}>
      <div>
        <p className={s.kicker}>{isDelete ? 'Permanent action' : 'Cancel booking'}</p>
        <h2 id="booking-panel-title">{actionText}</h2>
      </div>

      <p className={s.confirmText}>{copy}</p>

      {mutation.error && (
        <p className={s.alert} role="alert">
          {getApiError(mutation.error, `${actionText} failed.`)}
        </p>
      )}

      <div className={s.panelActions}>
        <button
          type="button"
          className={isDelete ? s.dangerBtn : s.primaryBtn}
          onClick={onConfirm}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? pendingText : actionText}
        </button>
        <button type="button" className={s.secondaryBtn} onClick={onBack} disabled={mutation.isPending}>
          Keep booking
        </button>
      </div>
    </div>
  );
};

const BookingPanel = ({ selectedId, mode, setMode, onClose }) => {
  const { data, isLoading, isError, refetch } = useAdminBooking(selectedId);
  const updateMutation = useUpdateBooking();
  const cancelMutation = useCancelBooking();
  const deleteMutation = useDeleteBooking();
  const [statusMessage, setStatusMessage] = useState('');
  const booking = data?.data?.data?.booking;

  const handleCancel = async () => {
    await cancelMutation.mutateAsync(selectedId);
    setStatusMessage('Booking cancelled.');
    setMode('details');
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(selectedId);
    onClose();
  };

  let content = null;

  if (isLoading) {
    content = <p className={s.panelState}>Loading booking...</p>;
  } else if (isError) {
    content = (
      <div className={s.panelState}>
        <p role="alert">Booking could not be loaded.</p>
        <button type="button" className={s.secondaryBtn} onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  } else if (booking && mode === 'edit') {
    content = (
      <BookingEditForm
        booking={booking}
        mutation={updateMutation}
        onSaved={() => {
          setStatusMessage('Booking saved.');
          setMode('details');
        }}
      />
    );
  } else if (booking && mode === 'cancel') {
    content = (
      <ConfirmPanel
        booking={booking}
        type="cancel"
        mutation={cancelMutation}
        onConfirm={handleCancel}
        onBack={() => setMode('details')}
      />
    );
  } else if (booking && mode === 'delete') {
    content = (
      <ConfirmPanel
        booking={booking}
        type="delete"
        mutation={deleteMutation}
        onConfirm={handleDelete}
        onBack={() => setMode('details')}
      />
    );
  } else if (booking) {
    content = (
      <BookingDetails
        booking={booking}
        onEdit={() => setMode('edit')}
        onCancel={() => setMode('cancel')}
        onDelete={() => setMode('delete')}
      />
    );
  }

  return (
    <div className={s.overlay}>
      <aside className={s.panel} role="dialog" aria-modal="true" aria-labelledby="booking-panel-title">
        <div className={s.panelTop}>
          {statusMessage ? <p className={s.statusText} role="status">{statusMessage}</p> : <span />}
          <button type="button" className={s.closeBtn} onClick={onClose} aria-label="Close booking panel">
            Close
          </button>
        </div>
        {content}
      </aside>
    </div>
  );
};

const AdminBookingsTab = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: 'all',
    search: '',
    from: '',
    to: '',
  });
  const [selectedId, setSelectedId] = useState('');
  const [mode, setMode] = useState('details');

  const queryParams = useMemo(() => {
    const params = { page: filters.page, limit: filters.limit, status: filters.status };
    if (filters.search.trim()) params.search = filters.search.trim();
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    return params;
  }, [filters]);

  const { data, isLoading, isError, refetch } = useAdminBookings(queryParams);
  const payload = data?.data?.data || {};
  const bookings = payload.bookings || [];
  const total = payload.total || 0;
  const page = payload.page || filters.page;
  const limit = payload.limit || filters.limit;

  const updateFilters = (next) => {
    setFilters((current) => ({ ...current, ...next }));
  };

  const resetFilters = () => {
    setFilters({ page: 1, limit: 20, status: 'all', search: '', from: '', to: '' });
  };

  const openPanel = (bookingId, nextMode) => {
    setSelectedId(bookingId);
    setMode(nextMode);
  };

  return (
    <section className={s.wrap} aria-labelledby="admin-bookings-title">
      <div className={s.heading}>
        <div>
          <h2 id="admin-bookings-title">Bookings</h2>
          <p>Manage Book a Call requests in GMT.</p>
        </div>
      </div>

      <BookingFilters filters={filters} onChange={updateFilters} onReset={resetFilters} />

      {isError ? (
        <div className={s.errorState}>
          <p role="alert">Bookings could not be loaded.</p>
          <button type="button" className={s.secondaryBtn} onClick={() => refetch()}>
            Retry
          </button>
        </div>
      ) : (
        <>
          {!isLoading && !bookings.length ? (
            <p className={s.empty}>No bookings found</p>
          ) : (
            <BookingTable
              bookings={bookings}
              isLoading={isLoading}
              onView={(id) => openPanel(id, 'details')}
              onEdit={(id) => openPanel(id, 'edit')}
              onCancel={(id) => openPanel(id, 'cancel')}
              onDelete={(id) => openPanel(id, 'delete')}
            />
          )}

          {!isLoading && bookings.length > 0 && (
            <Pagination
              page={page}
              total={total}
              limit={limit}
              onPrev={() => updateFilters({ page: Math.max(1, filters.page - 1) })}
              onNext={() => updateFilters({ page: filters.page + 1 })}
            />
          )}
        </>
      )}

      {selectedId && (
        <BookingPanel
          selectedId={selectedId}
          mode={mode}
          setMode={setMode}
          onClose={() => {
            setSelectedId('');
            setMode('details');
          }}
        />
      )}
    </section>
  );
};

export default AdminBookingsTab;
