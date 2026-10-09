import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProfileImage from './ProfileImage.jsx';
import MemberInfo from './MemberInfo.jsx';
import AboutMe from './aboutMe/AboutMe.jsx';
import axios from 'axios';
import { getCurrentMemberId, isMasterUser } from '../../utils/auth.js';
import { getMemberId, getProfileImage, isMemberOnline } from '../../utils/member.js';
import './Profile.css';
import '../../pages/css/game_interface.css';

const ProfileDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState({
    details: true,
    about: true,
  });
  const [editRequested, setEditRequested] = useState(false);
  const [aboutEditRequested, setAboutEditRequested] = useState(false);
  const [photoEditRequested, setPhotoEditRequested] = useState(false);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const token = localStorage.getItem('authToken');
  const currentMemberId = getCurrentMemberId();

  useEffect(() => {
    document.body.classList.add('profile-page-active');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.classList.remove('profile-page-active');
      document.body.style.overflow = previousOverflow;
    };
  }, []);

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

  const requestPageEdit = () => {
    setIsCustomizeOpen(false);
    setEditRequested(true);
  };

  const requestAboutEdit = () => {
    setIsCustomizeOpen(false);
    setAboutEditRequested(true);
  };

  const requestPhotoEdit = () => {
    setIsCustomizeOpen(false);
    setPhotoEditRequested(true);
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
      <main className="page-content profile-dashboard game-interface">
        {userData ? (
            <>
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
                    <span aria-hidden="true">⚙</span> Settings
                  </button>
                  <p className={`profile-detail-status${isOnline ? ' profile-detail-status--online' : ''}`}>
                    <span className="profile-detail-status-dot" aria-hidden="true" />
                    {isOnline ? 'Online Now' : 'Offline'}
                  </p>
                </div>
              </header>
              {isCustomizeOpen && (
                <section className="profile-settings-menu" aria-label="Profile Page Settings">
                  <div className="profile-settings-heading">
                    <p className="profile-detail-label">Page Settings</p>
                    <h2>Customize Your Profile</h2>
                  </div>
                  <div className="profile-widget-toggles" aria-label="Widget Visibility">
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
                      About Me
                    </label>
                  </div>
                  {canEdit && (
                    <div className="profile-settings-actions">
                      <button type="button" onClick={requestPhotoEdit}>
                        Change Picture
                      </button>
                      <button type="button" onClick={requestPageEdit}>
                        Edit Details
                      </button>
                      <button type="button" onClick={requestAboutEdit}>
                        Edit About Me
                      </button>
                    </div>
                  )}
                </section>
              )}
              <div className="profile-detail-grid">
                <aside className="profile-sidebar profile-widget">
                  <ProfileImage
                      profileImageUrl={getProfileImage(userData)}
                      memberId={profileId}
                      canEdit={Boolean(currentMemberId && profileId &&
                        currentMemberId === String(profileId))}
                      editRequested={photoEditRequested}
                      onEditRequestHandled={() => setPhotoEditRequested(false)}
                  />
                  {visibleWidgets.details && (
                    <MemberInfo
                        user={userData}
                        memberId={profileId}
                        canEdit={canEdit}
                        editRequested={editRequested}
                        onEditRequestHandled={() => setEditRequested(false)}
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
                      editRequested={aboutEditRequested}
                      onEditRequestHandled={() => setAboutEditRequested(false)}
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
