import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../../services/adminService';
import { clearAdmin } from '../../redux/auth/authSlice';

const useLogoutAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      dispatch(clearAdmin());
      queryClient.invalidateQueries({ queryKey: ['adminSession'] });
      navigate('/admin/login');
    },
  });
};

export default useLogoutAdmin;
