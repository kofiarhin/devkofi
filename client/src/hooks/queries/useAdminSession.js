import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getAdminSession } from '../../services/adminService';
import { setAdmin, clearAdmin, setChecked } from '../../redux/auth/authSlice';

const useAdminSession = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  const query = useQuery({
    queryKey: ['adminSession'],
    queryFn: getAdminSession,
    retry: false,
    enabled: isAdminRoute,
  });

  useEffect(() => {
    if (!isAdminRoute) {
      return;
    }

    if (query.isSuccess) {
      const isAuthenticated = query.data?.data?.authenticated;

      if (isAuthenticated) {
        dispatch(setAdmin(query.data?.data?.data));
      } else {
        dispatch(clearAdmin());
      }

      dispatch(setChecked());
    }

    if (query.isError) {
      dispatch(clearAdmin());
      dispatch(setChecked());
    }
  }, [isAdminRoute, query.isSuccess, query.isError, query.data, dispatch]);

  return query;
};

export default useAdminSession;
