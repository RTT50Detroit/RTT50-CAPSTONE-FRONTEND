import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ProfileCards from '../components/ProfileCard/ProfileCards';
import './css/members_dashboard.css';

const MembersDashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_APP_BASE_URL.replace(/\/$/, '');
  const token = localStorage.getItem('authToken');
  let loginName = 'Member';

  try {
    const tokenPayload = jwtDecode(token);
    loginName = tokenPayload.loginName || tokenPayload.username ||
      tokenPayload.name || tokenPayload.email || loginName;
  } catch {
    // Keep the dashboard usable when the token has no readable identity claim.
  }

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${apiUrl}/api/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfiles(response.data || []);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(
          err.response?.data?.message || 'Failed to load profile cards. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
      <main className="page-content dashboard-page">
        <section className="dashboard-hero">
          <div>
            <p className="dashboard-eyebrow">Member directory</p>
            <h1>Find your people</h1>
            <p className="dashboard-welcome">Welcome back, {loginName}.</p>
          </div>
          <div className="dashboard-accent" aria-hidden="true">SM</div>
        </section>

        <section className="dashboard-stats" aria-label="Directory summary">
          <div className="dashboard-stat">
            <span className="dashboard-stat-value">{profiles.length}</span>
            <span className="dashboard-stat-label">Members available</span>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat-value">{isLoading ? '...' : 'Open'}</span>
            <span className="dashboard-stat-label">Directory status</span>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat-value">24/7</span>
            <span className="dashboard-stat-label">Connection space</span>
          </div>
        </section>

        <section className="profiles-section" aria-labelledby="profiles-heading">
          <div className="profiles-section-heading">
            <div>
              <p className="dashboard-eyebrow">Explore the community</p>
              <h2 id="profiles-heading">Profile cards</h2>
            </div>
            {!isLoading && !error && <span>{profiles.length} results</span>}
          </div>

          {isLoading && <p className="dashboard-status">Loading member profiles...</p>}
          {error && <p className="dashboard-status dashboard-error">{error}</p>}
          {!isLoading && !error && profiles.length === 0 && (
            <p className="dashboard-status">No profiles found yet.</p>
          )}
          {!isLoading && !error && profiles.length > 0 && (
            <ProfileCards profiles={profiles} />
          )}
        </section>
      </main>
  );
};

export default MembersDashboard;
