import authorizedAxiosInstance from '~/utils/authorizedAxios';
import { API_ROOT } from '~/utils/constants';

export const handleLogoutApi = async () => {
  // Step 1: Clear tokens and user info in LocalStorage/Cookie
  // - With LocalStorage: Delete tokens and user info into LocalStorage (Client)
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userInfo');

  // - With Cookie: HttpOnly Cookies -> Call API to handle remove cookie (Backend)
  return await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`);
};

export const handleRefreshTokenApi = async (refreshToken) => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/refresh_token`, { refreshToken });
};
