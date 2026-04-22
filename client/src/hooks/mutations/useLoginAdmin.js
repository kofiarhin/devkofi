import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../services/adminService';
import { setAdmin } from '../../redux/auth/authSlice';

const useLoginAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }) => loginAdmin(email, password),
    onSuccess: (res) => {
      dispatch(setAdmin(res.data.data));
      navigate('/admin/dashboard');
    },
  });
};

export default useLoginAdmin;
