import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/Login.css';

const Login = () => {
  // State variables for form data and messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [configuredProviders, setConfiguredProviders] = useState([]);
  const navigate = useNavigate(); // For navigation after login
  const location = useLocation();
  const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');

  useEffect(() => {
    const oauthError = new URLSearchParams(location.search).get('oauthError');
    if (oauthError) setError(oauthError);
  }, [location.search]);

  useEffect(() => {
    axios.get(`${apiUrl}/api/auth/providers`)
        .then(({ data }) => setConfiguredProviders(data.providers || []))
        .catch(() => setConfiguredProviders([]));
  }, [apiUrl]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      // Prepare login data
      const loginData = { email, password };
      // Send request to backend
      const response = await axios.post(`${apiUrl}/api/login`, loginData);

      // Extract the token from the response and store it
      const token = response.data.token;
      localStorage.setItem('authToken', token); // Store token in localStorage
      localStorage.removeItem('authUser');

      // Handle success: Display message and optionally do further actions
      setMessage('Login successful!');
      setError('');
      console.log('Token:', response.data.token); // Example usage: Store the token in localStorage

      // Clear form fields
      setEmail('');
      setPassword('');

      // Navigate to the dashboard
      navigate('/dashboard'); // Redirect to Dashboard

    } catch (err) {
      // Handle login errors:
      setMessage('');
      if (err.response && err.response.data) {
        // Error response from backend
        setError(err.response.data.message || 'Invalid email or password. Please try again.');
      } else {
        // Generic error (e.g., network issue)
        setError('Unable to connect to the server. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <main className="page-content auth-page">
        <div className="login-card">
          <h1 className="login-title">Welcome Back</h1>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="email" className="form-label">Email</label>
            <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                autoComplete="email"
            />
            <label htmlFor="password" className="form-label">Password</label>
            <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
            />
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <div className="social-login" aria-label="Social sign-in options">
            <p className="social-login-divider">Or continue with</p>
            {[
              ['google', 'Google'],
              ['facebook', 'Facebook'],
              ['apple', 'Apple'],
              ['github', 'GitHub'],
            ].filter(([provider]) => configuredProviders.includes(provider))
                .map(([provider, label]) => (
              <a className="social-login-button" href={`${apiUrl}/api/auth/${provider}`} key={provider}>
                Continue with {label}
              </a>
            ))}
          </div>
          <p className="login-footer">
            Don&apos;t have an account? <a href="/register" target="_blank">Sign up</a>
          </p>
        </div>
      </main>
  );
};


export default Login;

export const OAuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');

  useEffect(() => {
    axios.get(`${apiUrl}/api/auth/session/current`)
        .then(({ data }) => {
          localStorage.setItem('authUser', JSON.stringify(data.user));
          navigate('/dashboard', { replace: true });
        })
        .catch(() => {
          setError('Social sign-in could not be completed. Please try again.');
        });
  }, [apiUrl, navigate]);

  return (
    <main className="page-content auth-page">
      <div className="login-card">
        {error ? <p className="error-message">{error}</p> : <p>Completing sign-in...</p>}
      </div>
    </main>
  );
};