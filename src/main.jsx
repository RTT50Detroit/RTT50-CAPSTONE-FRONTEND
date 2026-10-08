// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { requireProfileCompletion } from './utils/profileCompletion.js';
import App from './App';
import './index.css';
import './theme.css';

axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.code === 'AGE_VERIFICATION_REQUIRED'
      && window.location.pathname !== '/complete-profile') {
      requireProfileCompletion();
      window.location.replace('/complete-profile');
    }
    return Promise.reject(error);
  },
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
);