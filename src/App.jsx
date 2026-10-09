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
import ResumeRequired from './pages/ResumeRequired.jsx';
import JoinFromResume from './pages/JoinFromResume.jsx';
import './App.css';
import './pages/css/styles.css';
import LogoutButton from './components/LogoutButton.jsx';
import NotesDashboard from './components/Dashboard/note/NoteDashboard.jsx';
import MasterDashboard from './pages/MasterDashboard.jsx';
import Feedback from './pages/Feedback.jsx';
import StatusBanner from './components/StatusBanner.jsx';
import StatusPage from './pages/StatusPage.jsx';
import CompleteProfile from './pages/CompleteProfile.jsx';
import PolicyPage, { PoliciesIndex } from './pages/PolicyPage.jsx';
import DataDeletionPage from './pages/DataDeletionPage.jsx';
import { policies } from './content/policies.js';
import './pages/css/Policy.css';
import { getCurrentMemberId, hasValidAuthToken, isMasterUser } from './utils/auth.js';

function Navigation() {
  useLocation();
  const isLoggedIn = hasValidAuthToken();
  const currentMemberId = getCurrentMemberId();

  return (
    <header>
      <h1>
        <Link className="header-brand" to="/">
          <img className="header-brand-icon" src="/favicon.svg" alt="" />
          <span>The Social Match Game</span>
        </Link>
      </h1>
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
              Home
            </NavLink>
          </li>
          {!isLoggedIn && (
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive || window.location.pathname === '/register' ? 'active' : ''
                }
              >
                Register / Login
              </NavLink>
            </li>
          )}
          {isLoggedIn && (
            <>
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Roster
                </NavLink>
              </li>
              <li>
                <NavLink to="/notes" className={({ isActive }) => (isActive ? 'active' : '')}>
                Journal
                </NavLink>
              </li>
              <li>
                <NavLink
                    to={currentMemberId ? `/dashboard/profile?id=${currentMemberId}` : '/dashboard'}
                    className={({ isActive }) => `profile-nav-link${isActive ? ' active' : ''}`}
                    aria-label="View My Profile"
                    title="My Profile"
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

function EnterKeySubmitter() {
  useEffect(() => {
    const submitFormOnEnter = (event) => {
      if (event.key !== 'Enter' || event.shiftKey) return;

      const target = event.target;
      if (!(target instanceof HTMLInputElement
        || target instanceof HTMLSelectElement)) {
        return;
      }

      const form = target.form;
      if (!form) return;

      event.preventDefault();
      form.requestSubmit();
    };

    document.addEventListener('keydown', submitFormOnEnter);
    return () => document.removeEventListener('keydown', submitFormOnEnter);
  }, []);

  return null;
}

function SiteFooter() {
  useLocation();
  const isLoggedIn = hasValidAuthToken();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-main">
          <img className="site-footer-brand" src="/favicon.svg" alt="" />
          <div className="site-footer-copy">
            <p className="site-footer-title">The Social Match Game</p>
            <p className="site-footer-description">
              Part of a more intentional approach to connection.
            </p>
          </div>
          <a
            className="site-footer-link"
            href="https://therelationshipresume.netlify.app/"
            target="_blank"
            rel="noreferrer"
          >
            Explore The Relationship Resume
            <span aria-hidden="true">-&gt;</span>
          </a>
        </div>
        <ul className="site-footer-policies" aria-label="Footer Links">
          <li><Link to="/status">Project Status</Link></li>
          {isLoggedIn && <li><Link to="/feedback">Feedback</Link></li>}
          <li><Link to="/data-deletion">Facebook User Data Deletion</Link></li>
          {policies.map((policy) => (
            <li key={policy.slug}>
              <Link to={`/policies/${policy.slug}`}>{policy.title}</Link>
            </li>
          ))}
        </ul>
        <div className="site-footer-bottom">
          <p className="site-footer-copyright">
            &copy; {new Date().getFullYear()} The Social Match Game. All rights reserved.
          </p>
          <p className="site-footer-note">Dating · Friendship · Community</p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
      <Router>
        <div className="App">
          <PresenceTracker />
          <EnterKeySubmitter />
          <StatusBanner />
          {/* Navigation */}
          <Navigation />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/resume-required" element={<ResumeRequired />} />
            <Route path="/join" element={<JoinFromResume />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/policies" element={<PoliciesIndex />} />
            <Route path="/policies/:slug" element={<PolicyPage />} />
            <Route path="/data-deletion" element={<DataDeletionPage />} />

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
          <SiteFooter />
        </div>
      </Router>
  );
}

export default App;