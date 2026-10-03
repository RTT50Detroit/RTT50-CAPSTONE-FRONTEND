import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ProfileCards from '../components/ProfileCard/ProfileCards';
import './css/members_dashboard.css';

const MembersDashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [sexFilter, setSexFilter] = useState('all');
  const [onlineStatusFilter, setOnlineStatusFilter] = useState('all');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
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

  useEffect(() => {
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

    fetchProfiles();
  }, [apiUrl, token]);

  const filteredProfiles = profiles.filter((profile) => {
    const profileSex = profile.gender?.toLowerCase();
    const profileAge = Number(profile.age);
    const isOnline = profile.isOnline === true ||
      profile.online === true ||
      profile.status?.toLowerCase() === 'online';
    const matchesSex = sexFilter === 'all' || profileSex === sexFilter;
    const matchesOnlineStatus = onlineStatusFilter === 'all' ||
      (onlineStatusFilter === 'online' && isOnline) ||
      (onlineStatusFilter === 'offline' && !isOnline);
    const matchesMinAge = !minAge || profileAge >= Number(minAge);
    const matchesMaxAge = !maxAge || profileAge <= Number(maxAge);

    return matchesSex && matchesOnlineStatus && matchesMinAge && matchesMaxAge;
  });

  const hasActiveFilters = sexFilter !== 'all' || onlineStatusFilter !== 'all' || minAge || maxAge;

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
            {!isLoading && !error && <span>{filteredProfiles.length} results</span>}
          </div>

          {!isLoading && !error && profiles.length > 0 && (
            <div className="profile-filters" aria-label="Filter profiles">
              <div className="profile-filter-field">
                <label htmlFor="sex-filter">Sex</label>
                <select
                    id="sex-filter"
                    value={sexFilter}
                    onChange={(event) => setSexFilter(event.target.value)}
                >
                  <option value="all">All sexes</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="profile-filter-field">
                <label htmlFor="online-status-filter">Online status</label>
                <select
                    id="online-status-filter"
                    value={onlineStatusFilter}
                    onChange={(event) => setOnlineStatusFilter(event.target.value)}
                >
                  <option value="all">All statuses</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <div className="profile-filter-field">
                <label htmlFor="min-age">Minimum age</label>
                <input
                    id="min-age"
                    type="number"
                    min="0"
                    value={minAge}
                    onChange={(event) => setMinAge(event.target.value)}
                    placeholder="Any"
                />
              </div>
              <div className="profile-filter-field">
                <label htmlFor="max-age">Maximum age</label>
                <input
                    id="max-age"
                    type="number"
                    min="0"
                    value={maxAge}
                    onChange={(event) => setMaxAge(event.target.value)}
                    placeholder="Any"
                />
              </div>
              {hasActiveFilters && (
                <button
                    type="button"
                    className="profile-filter-reset"
                    onClick={() => {
                      setSexFilter('all');
                      setOnlineStatusFilter('all');
                      setMinAge('');
                      setMaxAge('');
                    }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {isLoading && <p className="dashboard-status">Loading member profiles...</p>}
          {error && <p className="dashboard-status dashboard-error">{error}</p>}
          {!isLoading && !error && profiles.length === 0 && (
            <p className="dashboard-status">No profiles found yet.</p>
          )}
          {!isLoading && !error && profiles.length > 0 && filteredProfiles.length === 0 && (
            <p className="dashboard-status">No profiles match these filters.</p>
          )}
          {!isLoading && !error && filteredProfiles.length > 0 && (
            <ProfileCards profiles={filteredProfiles} />
          )}
        </section>
      </main>
  );
};

export default MembersDashboard;
