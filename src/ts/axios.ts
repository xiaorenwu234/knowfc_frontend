import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://39.107.99.145:8081/',
  timeout: 50000, // 设置请求超时时间
  withCredentials: false // 全局设置 withCredentials 为 true
});

export const setAuthToken = (token: string) => {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default instance;
