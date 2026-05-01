import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi, getErrorMessage } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { queryClient } from '../lib/queryClient';

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate('/dashboard');
    },
  });
};

export const useSignup = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate('/dashboard');
    },
  });
};

export const useLogout = () => {
  const { clearAuth, refreshToken } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) await authApi.logout(refreshToken);
    },
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },
  });
};
