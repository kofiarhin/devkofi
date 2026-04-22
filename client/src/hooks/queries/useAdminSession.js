import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { getAdminSession } from '../../services/adminService';
import { setAdmin, clearAdmin, setChecked } from '../../redux/auth/authSlice';

const useAdminSession = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['adminSession'],
    queryFn: getAdminSession,
    retry: false,
  });

  useEffect(() => {
    if (query.isSuccess) {
      dispatch(setAdmin(query.data?.data?.data));
      dispatch(setChecked());
    }
    if (query.isError) {
      dispatch(clearAdmin());
      dispatch(setChecked());
    }
  }, [query.isSuccess, query.isError, query.data, dispatch]);

  return query;
};

export default useAdminSession;
