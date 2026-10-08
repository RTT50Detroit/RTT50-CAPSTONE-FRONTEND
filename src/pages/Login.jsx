import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './css/Login.css';

const Login = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [configuredProviders, setConfiguredProviders] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname === '/register';
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

  useEffect(() => {
    setMessage('');
    if (!location.search.includes('oauthError=')) setError('');
  }, [isRegister, location.search]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setPreviewImage('');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      if (isRegister) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('age', age);
        formData.append('gender', gender);
        formData.append('email', email);
        formData.append('password', password);

        const profileImage = fileInputRef.current?.files[0];
        if (profileImage) formData.append('photo', profileImage);

        const response = await axios.post(`${apiUrl}/api/register`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        let token = response.data.token;
        if (!token) {
          const loginResponse = await axios.post(`${apiUrl}/api/login`, {
            email,
            password,
          });
          token = loginResponse.data.token;
        }

        localStorage.setItem('authToken', token);
        setMessage(response.data.message || 'Registration successful!');
        setName('');
        setAge('');
        setGender('');
        setEmail('');
        setPassword('');
        setPreviewImage('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        navigate('/dashboard');
      } else {
        const response = await axios.post(`${apiUrl}/api/login`, { email, password });
        localStorage.setItem('authToken', response.data.token);
        localStorage.removeItem('authUser');
        setMessage('Login successful!');
        setEmail('');
        setPassword('');
        navigate('/dashboard');
      }
    } catch (err) {
      if (isRegister) {
        console.error('Error making the API call:', err);
        setError(err.response?.data?.message
          || (err.response?.data
            ? 'An error occurred during registration.'
            : 'Unable to connect to the server. Please try again later.'));
      } else {
        setError(err.response?.data?.message
          || (err.response?.data
            ? 'Invalid email or password. Please try again.'
            : 'Unable to connect to the server. Please try again later.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-content auth-page">
      <section className="auth-shell" aria-labelledby="auth-title">
        <aside className="auth-story">
          <img
            className="auth-story-image"
            src="/images/black-love/after-dark.jpg"
            alt="A Black couple posing together against a dark backdrop"
          />
          <div className="auth-brand-mark" aria-hidden="true">SM</div>
          <p className="auth-eyebrow">THE SOCIAL MATCH GAME</p>
          <h1>Make room for more meaningful connection.</h1>
          <p className="auth-story-copy">
            A thoughtful space to meet people, share what matters, and find
            your kind of connection.
          </p>
          <p className="auth-story-note">Dating <span>·</span> Friendship <span>·</span> Community</p>
        </aside>

        <div className="auth-panel">
          <div className="auth-heading">
            <p className="auth-panel-eyebrow">
              {isRegister ? 'YOUR NEXT CHAPTER' : 'GOOD TO SEE YOU'}
            </p>
            <h2 id="auth-title">{isRegister ? 'Create your account' : 'Welcome back'}</h2>
            <p>
              {isRegister
                ? 'Start building more intentional connections.'
                : 'Sign in to pick up where your connections left off.'}
            </p>
          </div>

          <nav className="auth-switch" aria-label="Choose an account action">
            <Link
              to="/login"
              className={!isRegister ? 'auth-switch-link is-active' : 'auth-switch-link'}
              aria-current={!isRegister ? 'page' : undefined}
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className={isRegister ? 'auth-switch-link is-active' : 'auth-switch-link'}
              aria-current={isRegister ? 'page' : undefined}
            >
              Create account
            </Link>
          </nav>

          {message && <p className="success-message" role="status">{message}</p>}
          {error && <p className="error-message" role="alert">{error}</p>}

          <form onSubmit={handleSubmit} className="login-form">
            <div
              className={`auth-field${isRegister ? '' : ' auth-field-reserved'}`}
              aria-hidden={!isRegister}
            >
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required={isRegister}
                disabled={!isRegister}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <div
              className={`auth-field${isRegister ? '' : ' auth-field-reserved'}`}
              aria-hidden={!isRegister}
            >
              <label htmlFor="age" className="form-label">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                className="form-input"
                value={age}
                onChange={(event) => setAge(event.target.value)}
                required={isRegister}
                disabled={!isRegister}
                placeholder="Your age"
                autoComplete="off"
              />
            </div>
            <div
              className={`auth-field${isRegister ? '' : ' auth-field-reserved'}`}
              aria-hidden={!isRegister}
            >
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                id="gender"
                name="gender"
                className="form-input"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                required={isRegister}
                disabled={!isRegister}
              >
                <option value="">Select an option</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="auth-field auth-field-full">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="auth-field auth-field-full">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder={isRegister ? 'Create a password' : 'Enter your password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
            </div>

            <div
              className={`auth-field auth-field-full${isRegister ? '' : ' auth-field-reserved'}`}
              aria-hidden={!isRegister}
            >
              <label htmlFor="profileImage" className="form-label">
                Profile image <span className="auth-optional">(optional)</span>
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                className="form-input auth-file-input"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                disabled={!isRegister}
              />
              {previewImage && isRegister && (
                <img src={previewImage} alt="Selected profile preview" className="image-preview" />
              )}
            </div>

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting
                ? (isRegister ? 'Creating account...' : 'Signing in...')
                : (isRegister ? 'Create account' : 'Sign in')}
              {!isSubmitting && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <div className="social-login-slot">
            {!isRegister && configuredProviders.length > 0 && (
              <div className="social-login" aria-label="Social sign-in options">
                <p className="social-login-divider"><span>or continue with</span></p>
                <div className="social-login-options">
                  {[
                    ['google', 'Google'],
                    ['github', 'GitHub'],
                  ].filter(([provider]) => configuredProviders.includes(provider))
                      .map(([provider, label]) => (
                        <a
                          className="social-login-button"
                          href={`${apiUrl}/api/auth/${provider}`}
                          key={provider}
                        >
                          {label}
                        </a>
                      ))}
                </div>
              </div>
            )}
          </div>

          <p className="auth-privacy-note">
            Your next meaningful connection starts with a hello.
          </p>
        </div>
      </section>
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
      <div className="auth-callback-card">
        {error ? <p className="error-message">{error}</p> : <p>Completing sign-in...</p>}
      </div>
    </main>
  );
};
