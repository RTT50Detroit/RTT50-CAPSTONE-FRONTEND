import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProfileImage from './ProfileImage.jsx';
import MemberInfo from './MemberInfo.jsx';
import AboutMe from './aboutMe/AboutMe.jsx';
import axios from 'axios';
import { getCurrentMemberId } from '../../utils/auth.js';
import { getMemberId, getProfileImage, isMemberOnline } from '../../utils/member.js';
import './Profile.css';

const ProfileDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const token = localStorage.getItem('authToken');
  const currentMemberId = getCurrentMemberId();

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
  const canEdit = Boolean(currentMemberId && profileId &&
    currentMemberId === String(profileId));
  const isOnline = isMemberOnline(userData, currentMemberId);

  return (
      <main className="page-content profile-dashboard">
        {userData ? (
            <>
              <Link className="profile-back-link" to="/dashboard">
                &lt;- Back to profiles
              </Link>
              <header className="profile-detail-header">
                <p className="profile-detail-eyebrow">Community profile</p>
                <h1>{userData.name || 'Member profile'}</h1>
                <p className={`profile-detail-status${isOnline ? ' profile-detail-status--online' : ''}`}>
                  <span className="profile-detail-status-dot" aria-hidden="true" />
                  {isOnline ? 'Online now' : 'Offline'}
                </p>
              </header>
              <div className="profile-detail-grid">
                <aside className="profile-sidebar">
                  <ProfileImage
                      profileImageUrl={getProfileImage(userData)}
                      memberId={profileId}
                      canEdit={canEdit}
                  />
                  <MemberInfo user={userData} />
                </aside>
                <section className="profile-main-content">
                  <AboutMe
                      user={userData.bio ?? userData.aboutme}
                      canEdit={canEdit}
                  />
                </section>
              </div>
            </>
        ) : (
             <p className="profile-status">No user data found.</p>
         )}
      </main>
  );
};

export default ProfileDashboard;
