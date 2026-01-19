// Author: TrungQuanDev: https://youtube.com/@trungquandev
import axios, { HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';
import { handleLogoutApi, handleRefreshTokenApi } from '~/apis';

// ==== Creating an instance Axios to custom config
let authorizedAxiosInstance = axios.create({
  timeout: 1000 * 60 * 10,
  withCredentials: true, // Approach 2: Usage HttpOnly Cookie - Enable axios attach and send cookie for each request
});

// ==== Request and response interceptors
// Request interceptor
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Get access token from local storage and attach it into request header
    // Step 1. Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken');

    // Step 2. Attach token into header request if token is exist
    if (accessToken) {
      // "Bearer" is a rule of OAuth 2.0 - define token type usage for authentication and authorization
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
);

// When the refresh token API called in the first time, hold and process it until completed. After completion, the server re-call APIs failed
let refreshTokenPromise = null;

// Response interceptor
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const statusCode = error.response?.status;

    // Case Status Code = 401
    if (statusCode === HttpStatusCode.Unauthorized) {
      await handleLogoutApi();
      location.href = '/login';
    }

    // Case Status 410 - GONE  will be used to refresh token api
    const originalRequest = error.config; // Get request API failed

    if (
      statusCode === HttpStatusCode.Gone &&
      originalRequest
      // && originalRequest._retry
    ) {
      // originalRequest._retry = true; // Ensure refresh token api only call once at the same time

      if (!refreshTokenPromise) {
        const refreshToken = localStorage.getItem('refreshToken');

        refreshTokenPromise = handleRefreshTokenApi(refreshToken)
          .then((res) => {
            // Get new access token
            // Assign into localStorage (with case: localStorage)
            const { accessToken } = res.data;
            localStorage.setItem('accessToken', accessToken);

            // Assign into Header (with case: HttpOnly Cookie)
            authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
          })
          .catch(async (err) => {
            await handleLogoutApi();
            location.href = '/login';

            return Promise.reject(err);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      // Returns refreshTokenPromise in the success case
      return refreshTokenPromise.then(() => {
        // Return axios instance with original request to re-call APIs that have an error
        return authorizedAxiosInstance(originalRequest);
      });
    }

    // Handle error and show error notification for all API, exclude StatusCode: 410 - GONE (use for refresh token)
    toast.error(error.response?.data?.message || error?.message);
    return Promise.reject(error);
  },
);

export default authorizedAxiosInstance;
