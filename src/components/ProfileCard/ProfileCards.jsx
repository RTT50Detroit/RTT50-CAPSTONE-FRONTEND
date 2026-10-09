import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { getMemberId, getProfileImage, isMemberOnline } from '../../utils/member.js';

const ProfileCards = ({ profiles, currentMemberId }) => {
  const apiUrl = import.meta.env.VITE_APP_BASE_URL.replace(/\/$/, '');
  const onlineProfiles = profiles.filter((profile) => {
    return isMemberOnline(profile, currentMemberId);
  });
  const offlineProfiles = profiles.filter((profile) => !onlineProfiles.includes(profile));

  const renderProfileCards = (profilesToRender) => (
    <div className="profile-cards-grid">
      {profilesToRender.map((profile) => {
          const profileId = getMemberId(profile);
          const rawProfileImage = getProfileImage(profile);
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
          const isOnline = isMemberOnline(profile, currentMemberId);
          const summary = profile.aboutMe || profile.aboutme ||
            'Open to making a meaningful connection.';

        return (
          <article key={profileId} className={`profile-card profile-card--editorial ${genderClass}`}>
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
                <div className="profile-card-identity">
                  <p className="profile-card-kicker">
                    {genderKey === 'male' ? 'Male Member' :
                      genderKey === 'female' ? 'Female Member' : 'Community Member'}
                  </p>
                  <h3>{profile.name || 'Unnamed Member'}</h3>
                </div>
                <span
                    className={`profile-card-status${isOnline ? ' profile-card-status--online' : ''}`}
                    aria-label={`${profile.name || 'Member'} is ${isOnline ? 'online' : 'offline'}`}
                >
                  <span className="profile-card-status-dot" aria-hidden="true" />
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="profile-card-body">
                <div className="profile-card-details">
                  <span>{profile.age ? `${profile.age} years` : 'Age private'}</span>
                  <span>{profile.gender || 'Not specified'}</span>
                </div>
                <p className="profile-card-summary">{summary}</p>
                {profileId && (
                  <Link className="profile-card-link" to={`/dashboard/profile?id=${profileId}`}>
                    <span>View {firstName}&apos;s Profile</span>
                    <span aria-hidden="true">-&gt;</span>
                  </Link>
                )}
              </div>
          </article>
        );
      })}
    </div>
  );

  return (
      <div className="profile-card-groups">
        {onlineProfiles.length > 0 && (
          <section className="profile-card-group" aria-labelledby="online-profiles-heading">
            <h3 id="online-profiles-heading" className="profile-card-group-heading">
            Online Now
            </h3>
            {renderProfileCards(onlineProfiles)}
          </section>
        )}
        {offlineProfiles.length > 0 && (
          <section className="profile-card-group" aria-labelledby="offline-profiles-heading">
            <h3 id="offline-profiles-heading" className="profile-card-group-heading">
              Offline
            </h3>
            {renderProfileCards(offlineProfiles)}
          </section>
        )}
      </div>
  );
};

export default ProfileCards;

ProfileCards.propTypes = {
  profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentMemberId: PropTypes.string,
};