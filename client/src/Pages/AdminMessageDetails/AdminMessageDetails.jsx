import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useContactMessage from '../../hooks/queries/useContactMessage';
import s from './AdminMessageDetails.module.scss';

const formatDateTime = (dateString) => {
  if (!dateString) {
    return '—';
  }

  return new Date(dateString).toLocaleString();
};

const AdminMessageDetails = () => {
  const { messageId } = useParams();
  const [copyState, setCopyState] = useState('');
  const { data, isLoading, isError, error, refetch, isFetching } = useContactMessage(messageId);

  const message = data?.data?.data?.message;
  const isNotFound = error?.response?.status === 404 || error?.response?.status === 400;

  const mailtoHref = useMemo(() => {
    if (!message?.email) {
      return '#';
    }

    const subject = encodeURIComponent(`Re: ${message.subject || 'No subject'}`);
    return `mailto:${message.email}?subject=${subject}`;
  }, [message?.email, message?.subject]);

  const handleCopy = async (value, label) => {
    if (!value || !navigator?.clipboard?.writeText) {
      setCopyState(`Unable to copy ${label.toLowerCase()}`);
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyState(`${label} copied`);
      setTimeout(() => setCopyState(''), 1800);
    } catch {
      setCopyState(`Unable to copy ${label.toLowerCase()}`);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className={s.page}>
        <main className={s.main}>
          <div className={s.card}>
            <p className={s.muted}>Loading message details…</p>
          </div>
        </main>
      </div>
    );
  }

  if (isError && isNotFound) {
    return (
      <div className={s.page}>
        <main className={s.main}>
          <div className={s.card}>
            <h1 className={s.title}>Message not found</h1>
            <p className={s.muted}>The link is invalid or the message no longer exists.</p>
            <Link className={s.backBtn} to="/admin/dashboard">Back to dashboard</Link>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={s.page}>
        <main className={s.main}>
          <div className={s.card}>
            <h1 className={s.title}>Unable to load message</h1>
            <p className={s.muted}>Please try again.</p>
            <div className={s.actions}>
              <button type="button" onClick={() => refetch()} className={s.actionBtn}>Retry</button>
              <Link className={s.backBtn} to="/admin/dashboard">Back to dashboard</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <main className={s.main}>
        <header className={s.header}>
          <Link className={s.backBtn} to="/admin/dashboard">← Back to dashboard</Link>
          <h1 className={s.title}>Message Details</h1>
          <span className={s.statusBadge}>
            {message?.isRead ? 'Read' : 'Unread'}
          </span>
        </header>

        <section className={s.card}>
          <h2 className={s.sectionTitle}>Sender</h2>
          <dl className={s.metaGrid}>
            <div>
              <dt>Name</dt>
              <dd>{message?.name || '—'}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{message?.email || '—'}</dd>
            </div>
            <div>
              <dt>Sent</dt>
              <dd>{formatDateTime(message?.createdAt)}</dd>
            </div>
            <div>
              <dt>Read status</dt>
              <dd>
                {message?.isRead ? 'Read' : 'Unread'}
                {message?.readAt ? ` · ${formatDateTime(message.readAt)}` : ''}
              </dd>
            </div>
          </dl>
        </section>

        <section className={s.card}>
          <h2 className={s.sectionTitle}>Subject</h2>
          <p className={s.subject}>{message?.subject || 'No subject'}</p>
        </section>

        <section className={s.card}>
          <h2 className={s.sectionTitle}>Message</h2>
          <p className={s.body}>{message?.message || 'No message content.'}</p>
        </section>

        <section className={s.card}>
          <h2 className={s.sectionTitle}>Actions</h2>
          <div className={s.actions}>
            <a href={mailtoHref} className={s.actionBtn}>Reply</a>
            <button
              type="button"
              className={s.actionBtn}
              onClick={() => handleCopy(message?.email, 'Email')}
            >
              Copy email
            </button>
            <button
              type="button"
              className={s.actionBtn}
              onClick={() => handleCopy(message?.message, 'Message')}
            >
              Copy message
            </button>
          </div>
          {copyState ? <p className={s.copyFeedback}>{copyState}</p> : null}
        </section>
      </main>
    </div>
  );
};

export default AdminMessageDetails;
