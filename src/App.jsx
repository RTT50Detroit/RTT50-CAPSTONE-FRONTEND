// App.jsx
import {
  BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation,
} from 'react-router-dom';
import Registration from './pages/Registration';
import Home from './pages/Home.jsx';
import Login from './pages/Login';
import MembersDashboard from './pages/MembersDashboard.jsx';
import ProfileDashboard from './components/Dashboard/ProfileDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './App.css';
import './pages/css/styles.css';
import LogoutButton from './components/LogoutButton.jsx';
import NotesDashboard from './components/Dashboard/note/NoteDashboard.jsx';
import { getAuthToken, getCurrentMemberId } from './utils/auth.js';

function Navigation() {
  useLocation();
  const isLoggedIn = Boolean(getAuthToken());
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
                  <span className="profile-nav-label">My profile</span>
                </NavLink>
              </li>
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

function App() {
  return (
      <Router>
        <div className="App">
          {/* Navigation */}
          <Navigation />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />

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

          </Routes>
        </div>
      </Router>
  );
}

export default App;