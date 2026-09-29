import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const ProfileCards = ({ profiles }) => {
  return (
      <div className="profile-cards-grid">
        {profiles.map((profile) => {
          const profileId = profile._id || profile.id;
          const profileImage = profile.profileImage || profile.photo;
          const genderKey = profile.gender?.toLowerCase();
          const genderClass = genderKey === 'male' || genderKey === 'female'
            ? `profile-card--${genderKey}`
            : 'profile-card--neutral';
          const summary = profile.bio || profile.aboutme ||
            'Open to making a meaningful connection.';

          return (
            <article key={profileId} className={`profile-card ${genderClass}`}>
              <div className="profile-card-image">
                {profileImage ? (
                  <img src={profileImage} alt={`${profile.name}'s profile`} />
                ) : (
                  <span>{profile.name?.charAt(0).toUpperCase() || '?'}</span>
                )}
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
                    View profile <span aria-hidden="true">-&gt;</span>
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