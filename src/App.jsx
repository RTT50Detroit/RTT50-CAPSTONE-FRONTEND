// App.jsx
import React from 'react';
import {
  BrowserRouter as Router, Routes, Route, NavLink,
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
import CreateNote from './components/Dashboard/note/CreateNote.jsx';

function App() {
  return (
      <Router>
        <div className="App">
          {/* Navigation */}
          <header>
            <h1>Social Match Makers</h1>
            <nav>
              <ul>
                <li>
                  <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Home
                  </NavLink>
                </li>
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
                  {localStorage.getItem('token') && <LogoutButton />}
                </li>
              </ul>
            </nav>
          </header>

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
                    <CreateNote /> {/* Render your Create Note component */}
                  </ProtectedRoute>
                }
            />

          </Routes>
        </div>
      </Router>
  );
}

export default App;