import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useLoginAdmin from '../../hooks/mutations/useLoginAdmin';
import s from './AdminLogin.module.scss';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const admin = useSelector((state) => state.auth.admin);
  const { mutate: login, isPending, error } = useLoginAdmin();

  useEffect(() => {
    if (admin) navigate('/admin/dashboard', { replace: true });
  }, [admin, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  const errorMessage =
    error?.response?.data?.error || (error ? 'Login failed. Please try again.' : null);

  return (
    <div className={s.page}>
      <div className={s.card}>
        <span className={s.badge}>Admin Portal</span>
        <h1 className={s.title}>Welcome back</h1>
        <p className={s.subtitle}>Sign in to access the admin dashboard.</p>

        <form onSubmit={handleSubmit} noValidate className={s.form}>
          <div className={s.field}>
            <label htmlFor="email" className={s.label}>Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className={s.input}
            />
          </div>

          <div className={s.field}>
            <label htmlFor="password" className={s.label}>Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={s.input}
            />
          </div>

          {errorMessage && (
            <p role="alert" className={s.error}>{errorMessage}</p>
          )}

          <button type="submit" disabled={isPending} className={s.button}>
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
