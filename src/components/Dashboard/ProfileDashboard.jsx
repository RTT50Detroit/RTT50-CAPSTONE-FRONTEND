import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProfileImage from './ProfileImage.jsx';
import MemberInfo from './MemberInfo.jsx';
import AboutMe from './aboutMe/AboutMe.jsx';
import axios from 'axios';
import { getCurrentMemberId, isMasterUser } from '../../utils/auth.js';
import { getMemberId, getProfileImage, isMemberOnline } from '../../utils/member.js';
import './Profile.css';

const ProfileDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState({
    details: true,
    about: true,
  });
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const token = localStorage.getItem('authToken');
  const currentMemberId = getCurrentMemberId();

  useEffect(() => {
    if (!id) return;
    try {
      const savedWidgets = JSON.parse(localStorage.getItem(`profile-widgets-${id}`));
      if (savedWidgets && typeof savedWidgets === 'object') {
        setVisibleWidgets((current) => ({ ...current, ...savedWidgets }));
      }
    } catch {
      // Use the default layout when a saved preference is unavailable.
    }
  }, [id]);

  const toggleWidget = (widget) => {
    setVisibleWidgets((current) => {
      const next = { ...current, [widget]: !current[widget] };
      localStorage.setItem(`profile-widgets-${id}`, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!id) {
          setError('No profile ID provided.');
          return;
        }

        const apiUrl = import.meta.env.VITE_APP_BASE_URL.replace(/\/$/, '');
        const authConfig = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const [memberResponse, aboutMeResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/members/${id}`, authConfig),
          axios.get(`${apiUrl}/api/members/aboutme`, authConfig),
        ]);
        const profiles = Array.isArray(aboutMeResponse.data)
          ? aboutMeResponse.data
          : aboutMeResponse.data?.profiles || [];
        const persistedProfile = profiles.find((profile) => (
          String(getMemberId(profile)) === String(id)
        ));

        setUserData({
          ...memberResponse.data,
          ...(persistedProfile || {}),
          occupation: memberResponse.data.occupation ??
            persistedProfile?.occupation ?? '',
          hobbies: memberResponse.data.hobbies ??
            persistedProfile?.hobbies ?? [],
          links: memberResponse.data.links ??
            persistedProfile?.links ?? [],
          profileImage: memberResponse.data.profileImage ||
            persistedProfile?.profileImage ||
            memberResponse.data.photo,
        });
      } catch (requestError) {
        console.error('Error fetching user profile:', requestError);
        setError('Error fetching user profile.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id, token]);

  if (isLoading) return <p className="profile-status">Loading profile...</p>;
  if (error) return <p className="profile-status">{error}</p>;

  const profileId = getMemberId(userData) || id;
  const canEdit = isMasterUser() || Boolean(currentMemberId && profileId &&
    currentMemberId === String(profileId));
  const isOnline = isMemberOnline(userData, currentMemberId);

  return (
      <main className="page-content profile-dashboard">
        {userData ? (
            <>
              <Link className="profile-back-link" to="/dashboard">
                &lt;- Back to profiles
              </Link>
              <header className="profile-detail-header profile-hero">
                <div className="profile-hero-copy">
                  <Link className="profile-back-link" to="/dashboard">
                    <span aria-hidden="true">&larr;</span> Back to profiles
                  </Link>
                  <p className="profile-detail-eyebrow">Community Profile</p>
                  <h1>{userData.name || 'Member profile'}</h1>
                  <p className="profile-hero-subtitle">
                    {userData.occupation || 'A closer look at the person behind the profile.'}
                  </p>
                </div>
                <div className="profile-hero-actions">
                  <button
                      type="button"
                      className="profile-customize-button"
                      onClick={() => setIsCustomizeOpen((current) => !current)}
                      aria-expanded={isCustomizeOpen}
                  >
                    <span aria-hidden="true">☷</span> Customize layout
                  </button>
                  <p className={`profile-detail-status${isOnline ? ' profile-detail-status--online' : ''}`}>
                    <span className="profile-detail-status-dot" aria-hidden="true" />
                    {isOnline ? 'Online now' : 'Offline'}
                  </p>
                </div>
              </header>
              {isCustomizeOpen && (
                <section className="profile-customize-panel" aria-label="Customize profile layout">
                  <div>
                    <p className="profile-detail-label">Your view</p>
                    <h2>Choose your widgets</h2>
                  </div>
                  <div className="profile-widget-toggles">
                    <label>
                      <input
                          type="checkbox"
                          checked={visibleWidgets.details}
                          onChange={() => toggleWidget('details')}
                      />
                      Details
                    </label>
                    <label>
                      <input
                          type="checkbox"
                          checked={visibleWidgets.about}
                          onChange={() => toggleWidget('about')}
                      />
                      About me
                    </label>
                  </div>
                </section>
              )}
              <div className="profile-detail-grid">
                <aside className="profile-sidebar profile-widget">
                  <ProfileImage
                      profileImageUrl={getProfileImage(userData)}
                      memberId={profileId}
                      canEdit={Boolean(currentMemberId && profileId &&
                        currentMemberId === String(profileId))}
                  />
                  {visibleWidgets.details && (
                    <MemberInfo
                        user={userData}
                        memberId={profileId}
                        canEdit={canEdit}
                        onSaved={(profile) => setUserData((current) => ({
                          ...current,
                          ...profile,
                        }))}
                    />
                  )}
                </aside>
                {visibleWidgets.about && (
                  <section className="profile-main-content profile-widget">
                  <AboutMe
                      user={userData.aboutMe ?? userData.aboutme}
                      memberId={profileId}
                      canEdit={canEdit}
                  />
                  </section>
                )}
              </div>
            </>
        ) : (
             <p className="profile-status">No user data found.</p>
         )}
      </main>
  );
};

export default ProfileDashboard;
