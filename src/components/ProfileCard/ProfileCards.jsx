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
          const relationshipResume = profile.links?.find((link) => (
            ['relationship resume', 'the relationship resume'].includes(
                String(link.label || '').trim().toLowerCase(),
            ) && typeof link.url === 'string' && link.url.trim()
          ));

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
                <div className="profile-card-actions">
                  {profileId && (
                    <Link className="profile-card-link" to={`/dashboard/profile?id=${profileId}`}>
                      <span>View {firstName}&apos;s Profile</span>
                      <span aria-hidden="true">-&gt;</span>
                    </Link>
                  )}
                  {relationshipResume && (
                    <a
                        className="profile-card-resume-link"
                        href={relationshipResume.url.trim()}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${profile.name || 'member'}'s Relationship Resume`}
                        title="Open Relationship Resume"
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M7 3.75h7l4 4v12.5H7a2 2 0 0 1-2-2V5.75a2 2 0 0 1 2-2Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M14 3.75v4h4M8.5 12h7M8.5 15.5h4"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="m16.8 14.4.8-.8a1.7 1.7 0 0 1 2.4 2.4l-1.7 1.7a1.7 1.7 0 0 1-2.4 0"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                        />
                      </svg>
                    </a>
                  )}
                </div>
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