import axios from 'axios';

const http = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || '',
  withCredentials: true,
});

http.interceptors.request.use(function(req) {
  const token = localStorage.getItem('access-token') || '';

  if (token && req.headers) req.headers['authorization'] = `Bearer ${token}`;

  return req;
});

export { http };
