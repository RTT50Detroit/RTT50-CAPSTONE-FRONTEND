import { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileCards, { ProfileLayoutControls } from '../components/ProfileCard/ProfileCards';
import { getCurrentMemberId, getTokenPayload } from '../utils/auth.js';
import { getMemberId, isMemberOnline } from '../utils/member.js';
import './css/members_dashboard.css';

const MembersDashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [sexFilter, setSexFilter] = useState('all');
  const [onlineStatusFilter, setOnlineStatusFilter] = useState('all');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cardLayout, setCardLayout] = useState('current');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_APP_BASE_URL.replace(/\/$/, '');
  const token = localStorage.getItem('authToken');
  const currentMemberId = getCurrentMemberId();
  const tokenPayload = getTokenPayload();
  const currentProfile = profiles.find((profile) => (
    String(getMemberId(profile)) === String(currentMemberId)
  ));
  const loginName = currentProfile?.name || tokenPayload?.loginName ||
    tokenPayload?.username || tokenPayload?.name;

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
    const isOnline = isMemberOnline(profile, currentMemberId);
    const searchableText = [
      profile.name,
      profile.occupation,
      profile.aboutMe,
      profile.aboutme,
      ...(Array.isArray(profile.hobbies) ? profile.hobbies : []),
    ].filter(Boolean).join(' ').toLowerCase();
    const matchesSearch = !searchQuery.trim() ||
      searchableText.includes(searchQuery.trim().toLowerCase());
    const matchesSex = sexFilter === 'all' || profileSex === sexFilter;
    const matchesOnlineStatus = onlineStatusFilter === 'all' ||
      (onlineStatusFilter === 'online' && isOnline) ||
      (onlineStatusFilter === 'offline' && !isOnline);
    const matchesMinAge = !minAge || profileAge >= Number(minAge);
    const matchesMaxAge = !maxAge || profileAge <= Number(maxAge);

    return matchesSearch && matchesSex && matchesOnlineStatus && matchesMinAge && matchesMaxAge;
  });

  const onlineCount = profiles.filter((profile) => isMemberOnline(profile, currentMemberId)).length;
  const hasActiveFilters = searchQuery || sexFilter !== 'all' ||
    onlineStatusFilter !== 'all' || minAge || maxAge;

  return (
      <main className="page-content dashboard-page dashboard-game-ui game-interface">
        <section className="dashboard-hero">
          <div className="dashboard-hero-copy">
            <p className="dashboard-eyebrow">Member Directory</p>
            <h1>Find Your People</h1>
            <p className="dashboard-welcome">
              Welcome Back{loginName ? `, ${loginName}` : ''}.
            </p>
          </div>
          <div className="dashboard-hero-readout" aria-hidden="true">
            <span>Community Network</span>
            <span className="dashboard-network-status">Connected</span>
          </div>
        </section>

        <section className="dashboard-stats" aria-label="Directory Summary">
          <div className="dashboard-stat">
            <span className="dashboard-stat-icon" aria-hidden="true">◌</span>
            <span className="dashboard-stat-value">{profiles.length}</span>
            <span className="dashboard-stat-label">Members Available</span>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat-icon dashboard-stat-icon--green" aria-hidden="true">●</span>
            <span className="dashboard-stat-value">{isLoading ? '...' : onlineCount}</span>
            <span className="dashboard-stat-label">Online Right Now</span>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat-icon dashboard-stat-icon--orange" aria-hidden="true">✦</span>
            <span className="dashboard-stat-value">{isLoading ? '...' : filteredProfiles.length}</span>
            <span className="dashboard-stat-label">Profiles in View</span>
          </div>
        </section>

        <section className="profiles-section" aria-labelledby="profiles-heading">
          <div className="profiles-section-heading">
            <div>
              <p className="dashboard-eyebrow">Explore the Community</p>
              <h2 id="profiles-heading">Game Roster</h2>
            </div>
            <div className="profiles-section-actions">
              {!isLoading && !error && filteredProfiles.length > 0 && (
                <ProfileLayoutControls layout={cardLayout} onLayoutChange={setCardLayout} />
              )}
              {!isLoading && !error && <span>{filteredProfiles.length} results</span>}
            </div>
          </div>

          <div className="directory-console">
            {!isLoading && !error && profiles.length > 0 && (
              <aside className="profile-filters" aria-label="Filter Profiles">
                <p className="directory-panel-kicker">Search Parameters</p>
                <div className="profile-filter-field profile-filter-search">
                  <label htmlFor="profile-search">Search Profiles</label>
                  <div className="profile-search-input">
                    <span aria-hidden="true">⌕</span>
                    <input
                        id="profile-search"
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Name, interests, or role"
                    />
                  </div>
                </div>
                <div className="profile-filter-field">
                  <label htmlFor="sex-filter">Sex</label>
                  <select
                      id="sex-filter"
                      value={sexFilter}
                      onChange={(event) => setSexFilter(event.target.value)}
                  >
                    <option value="all">All Sexes</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="profile-filter-field">
                  <label htmlFor="online-status-filter">Online Status</label>
                  <select
                      id="online-status-filter"
                      value={onlineStatusFilter}
                      onChange={(event) => setOnlineStatusFilter(event.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div className="profile-filter-field">
                  <label htmlFor="min-age">Minimum Age</label>
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
                  <label htmlFor="max-age">Maximum Age</label>
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
                        setSearchQuery('');
                      }}
                  >
                    Clear Filters
                  </button>
                )}
              </aside>
            )}

            <div className="directory-roster">
              {isLoading && <p className="dashboard-status">Loading member profiles...</p>}
              {error && <p className="dashboard-status dashboard-error">{error}</p>}
              {!isLoading && !error && profiles.length === 0 && (
                <p className="dashboard-status">No profiles found yet.</p>
              )}
              {!isLoading && !error && profiles.length > 0 && filteredProfiles.length === 0 && (
                <p className="dashboard-status">No profiles match these filters.</p>
              )}
              {!isLoading && !error && filteredProfiles.length > 0 && (
                <ProfileCards
                    profiles={filteredProfiles}
                    currentMemberId={currentMemberId}
                    layout={cardLayout}
                />
              )}
            </div>
          </div>
        </section>
      </main>
  );
};

export default MembersDashboard;
