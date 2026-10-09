import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { useState } from 'react';
import { getMemberId, getProfileImage, isMemberOnline } from '../../utils/member.js';

const ProfileCards = ({ profiles, currentMemberId }) => {
  const [layout, setLayout] = useState('current');
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
                    <Link
                        className="profile-card-profile-link"
                        to={`/dashboard/profile?id=${profileId}`}
                        aria-label={`View ${profile.name || 'member'}'s Profile`}
                        title={`View ${profile.name || 'Member'}'s Profile`}
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                        <circle cx="12" cy="8" r="3.25" />
                        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
                      </svg>
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
                      <span className="profile-card-resume-mark" aria-hidden="true">
                        RR
                      </span>
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
      <div className={`profile-card-groups${layout === 'editorial' ? ' profile-card-groups--editorial' : ''}`}>
        <div className="profile-layout-controls">
          <span className="profile-layout-label">Card Layout</span>
          <div className="profile-layout-switcher" role="group" aria-label="Choose a card layout">
            <button
                type="button"
                className={layout === 'current' ? 'is-active' : ''}
                aria-pressed={layout === 'current'}
                onClick={() => setLayout('current')}
            >
              Current Design
            </button>
            <button
                type="button"
                className={layout === 'editorial' ? 'is-active' : ''}
                aria-pressed={layout === 'editorial'}
                onClick={() => setLayout('editorial')}
            >
              Editorial
            </button>
          </div>
        </div>
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