// App.jsx
import {
  BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation,
} from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Registration from './pages/Registration';
import Home from './pages/Home.jsx';
import Login, { OAuthCallback } from './pages/Login';
import MembersDashboard from './pages/MembersDashboard.jsx';
import ProfileDashboard from './components/Dashboard/ProfileDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './App.css';
import './pages/css/styles.css';
import LogoutButton from './components/LogoutButton.jsx';
import NotesDashboard from './components/Dashboard/note/NoteDashboard.jsx';
import MasterDashboard from './pages/MasterDashboard.jsx';
import Feedback from './pages/Feedback.jsx';
import { getCurrentMemberId, hasValidAuthToken, isMasterUser } from './utils/auth.js';

function Navigation() {
  useLocation();
  const isLoggedIn = hasValidAuthToken();
  const currentMemberId = getCurrentMemberId();

  return (
    <header>
      <h1>
        <Link className="header-brand" to="/">The Social Match Game</Link>
      </h1>
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
              Home
            </NavLink>
          </li>
          {!isLoggedIn && (
            <>
              <li>
                <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Login
                </NavLink>
              </li>
            </>
          )}
          {isLoggedIn && (
            <>
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Profiles
                </NavLink>
              </li>
              <li>
                <NavLink to="/notes" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Notes
                </NavLink>
              </li>
              <li>
                <NavLink to="/feedback" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Feedback
                </NavLink>
              </li>
              <li>
                <NavLink
                    to={currentMemberId ? `/dashboard/profile?id=${currentMemberId}` : '/dashboard'}
                    className={({ isActive }) => `profile-nav-link${isActive ? ' active' : ''}`}
                    aria-label="View my profile"
                    title="My profile"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5" />
                  </svg>
                  <span className="profile-nav-label">My Profile</span>
                </NavLink>
              </li>
              {isMasterUser() && (
                <li>
                  <NavLink to="/master" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Manage Profiles
                  </NavLink>
                </li>
              )}
              <li>
                <LogoutButton />
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

function PresenceTracker() {
  useLocation();
  const token = localStorage.getItem('authToken');
  const hasSession = Boolean(token || localStorage.getItem('authUser'));
  const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');

  useEffect(() => {
    if (!hasSession) return undefined;

    const markPresence = async () => {
      try {
        await axios.post(`${apiUrl}/api/members/presence`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error('Error updating online status:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          window.location.replace('/login');
        }
      }
    };

    markPresence();
    const presenceInterval = window.setInterval(markPresence, 60 * 1000);
    return () => window.clearInterval(presenceInterval);
  }, [apiUrl, hasSession, token]);

  return null;
}

function App() {
  return (
      <Router>
        <div className="App">
          <PresenceTracker />
          {/* Navigation */}
          <Navigation />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MembersDashboard />
                  </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <ProfileDashboard />
                  </ProtectedRoute>
                }
            />
            <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <NotesDashboard />
                  </ProtectedRoute>
                }
            />
            <Route
                path="/feedback"
                element={
                  <ProtectedRoute>
                    <Feedback />
                  </ProtectedRoute>
                }
            />
            <Route
                path="/master"
                element={
                  <ProtectedRoute requiredRole="master">
                    <MasterDashboard />
                  </ProtectedRoute>
                }
            />

          </Routes>
          <footer className="site-footer">
            <div>
              <p>Part of a more intentional approach to connection.</p>
                <a
              href="https://therelationshipresume.netlify.app/"
              target="_blank"
              rel="noreferrer"
            >
              Explore the Relationship Resume
            </a>
            <p className="site-footer-copyright">
                &copy; {new Date().getFullYear()} The Social Match Game. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </Router>
  );
}

export default App;