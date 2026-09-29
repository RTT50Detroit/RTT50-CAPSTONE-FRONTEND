import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProfileImage from './ProfileImage.jsx';
import MemberInfo from './MemberInfo.jsx';
import AboutMe from './aboutMe/AboutMe.jsx';
import axios from 'axios';
import './Profile.css';

const ProfileDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!id) {
          setError('No profile ID provided.');
          return;
        }

        const apiUrl = import.meta.env.VITE_APP_BASE_URL.replace(/\/$/, '');
        const response = await axios.get(`${apiUrl}/api/members/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
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
                <p>Get to know a little more about this member.</p>
              </header>
              <div className="profile-detail-grid">
                <aside className="profile-sidebar">
                  <ProfileImage
                      profileImageUrl={userData.profileImageUrl || userData.profileImage}
                      memberId={userData._id || id}
                  />
                  <MemberInfo user={userData} />
                </aside>
                <section className="profile-main-content">
                  <AboutMe user={userData.aboutme} />
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
