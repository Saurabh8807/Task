import axios from 'axios';
import Cookies from 'js-cookie'; 
import store from './redux/store'; 
import { clearUser, setUser } from './redux/slices/authSlice'; 

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('accessToken'); 
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error && error.response.status === 500 || error.response.status === 405 && originalRequest &&
      !originalRequest._isRetry) {
      originalRequest._retry = true;

      try {
        console.log("i am in refreshToken")
        const response = await axios.post('/auth/refresh-token', {}, { withCredentials: true });
        console.log("i got response" ,response)
        const newAccessToken = response.data.accessToken;
        console.log("i set new accessToken" ,newAccessToken)
        Cookies.set('accessToken', newAccessToken);

        // store.dispatch(setUser({ user: store.getState().auth.user}));

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        store.dispatch(clearUser());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
