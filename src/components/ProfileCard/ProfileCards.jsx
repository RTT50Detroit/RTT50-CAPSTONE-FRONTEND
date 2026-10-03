import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const ProfileCards = ({ profiles }) => {
  const apiUrl = import.meta.env.VITE_APP_BASE_URL.replace(/\/$/, '');

  return (
      <div className="profile-cards-grid">
        {profiles.map((profile) => {
          const profileId = profile._id || profile.id;
          const rawProfileImage = profile.profileImage || profile.photo;
          const profileImage = rawProfileImage?.startsWith('/')
            ? `${apiUrl}${rawProfileImage}`
            : rawProfileImage;
          const nameParts = (profile.name || '').trim().split(/\s+/).filter(Boolean);
          const firstName = nameParts[0] || 'member';
          const initials = nameParts.length > 1
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
            : (nameParts[0]?.slice(0, 2) || '?');
          const genderKey = profile.gender?.toLowerCase();
          const genderClass = genderKey === 'male' || genderKey === 'female'
            ? `profile-card--${genderKey}`
            : 'profile-card--neutral';
          const isOnline = profile.isOnline === true ||
            profile.online === true ||
            profile.status?.toLowerCase() === 'online';
          const summary = profile.bio || profile.aboutme ||
            'Open to making a meaningful connection.';

          return (
            <article key={profileId} className={`profile-card ${genderClass}`}>
              <div className="profile-card-image">
                {profileImage ? (
                  <>
                    <img
                        src={profileImage}
                        alt={`${profile.name}'s profile`}
                        onError={(event) => {
                          event.currentTarget.hidden = true;
                          event.currentTarget.nextElementSibling.hidden = false;
                        }}
                    />
                    <span className="profile-card-initials" hidden>{initials.toUpperCase()}</span>
                  </>
                ) : (
                  <span className="profile-card-initials">{initials.toUpperCase()}</span>
                )}
                <span
                    className={`profile-card-status${isOnline ? ' profile-card-status--online' : ''}`}
                    aria-label={`${profile.name || 'Member'} is ${isOnline ? 'online' : 'offline'}`}
                >
                  <span className="profile-card-status-dot" aria-hidden="true" />
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="profile-card-body">
                <p className="profile-card-kicker">
                  {genderKey === 'male' ? 'Male member' :
                    genderKey === 'female' ? 'Female member' : 'Community member'}
                </p>
                <h3>{profile.name || 'Unnamed member'}</h3>
                <div className="profile-card-details">
                  <span>{profile.age ? `${profile.age} years` : 'Age private'}</span>
                  <span>{profile.gender || 'Not specified'}</span>
                </div>
                <p className="profile-card-summary">{summary}</p>
                {profileId && (
                  <Link className="profile-card-link" to={`/dashboard/profile?id=${profileId}`}>
                    View {firstName}&apos;s profile <span aria-hidden="true">-&gt;</span>
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
  );
};

export default ProfileCards;

ProfileCards.propTypes = {
  profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
};