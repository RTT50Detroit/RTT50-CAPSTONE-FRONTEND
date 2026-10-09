import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { getMemberId, getProfileImage, isMemberOnline } from '../../utils/member.js';

export const ProfileLayoutControls = ({ layout, onLayoutChange }) => {
  const [isLayoutControlVisible, setIsLayoutControlVisible] = useState(false);
  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);
  const layoutControlsRef = useRef(null);
  const layoutLauncherRef = useRef(null);
  const layoutToggleRef = useRef(null);
  const layoutLabels = {
    current: 'Default',
    photo: 'Photo-Forward',
    magazine: 'Magazine',
  };

  useEffect(() => {
    if (!isLayoutMenuOpen && !isLayoutControlVisible) return undefined;

    const handlePointerDown = (event) => {
      if (!layoutControlsRef.current?.contains(event.target)) {
        setIsLayoutMenuOpen(false);
        setIsLayoutControlVisible(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isLayoutMenuOpen) {
          setIsLayoutMenuOpen(false);
          layoutToggleRef.current?.focus();
        } else {
          setIsLayoutControlVisible(false);
          layoutLauncherRef.current?.focus();
        }
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLayoutControlVisible, isLayoutMenuOpen]);

  return (
    <div
        className={`profile-layout-controls${isLayoutMenuOpen ? ' is-open' : ''}${isLayoutControlVisible ? ' is-toggle-visible' : ''}`}
        ref={layoutControlsRef}
    >
      <button
          type="button"
          className="profile-layout-launcher"
          ref={layoutLauncherRef}
          aria-label="Show Card Layouts Toggle"
          aria-controls="profile-layout-toggle"
          aria-expanded={isLayoutControlVisible}
          onClick={() => setIsLayoutControlVisible(true)}
      >
        <span aria-hidden="true">Layout</span>
        <span className="profile-layout-launcher-icon" aria-hidden="true">‹</span>
      </button>
      <button
          type="button"
          className={`profile-layout-toggle${isLayoutControlVisible ? ' is-visible' : ''}`}
          id="profile-layout-toggle"
          ref={layoutToggleRef}
          aria-expanded={isLayoutMenuOpen}
          aria-controls="profile-layout-choices"
          tabIndex={isLayoutControlVisible ? 0 : -1}
          aria-hidden={!isLayoutControlVisible}
          onClick={() => {
            if (!isLayoutControlVisible) {
              setIsLayoutControlVisible(true);
              return;
            }
            setIsLayoutMenuOpen((isOpen) => !isOpen);
          }}
      >
        <span className="profile-layout-toggle-icon" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className="profile-layout-toggle-copy">
          <span className="profile-layout-toggle-label">Card Layouts</span>
          <span className="profile-layout-current">{layoutLabels[layout]}</span>
        </span>
        <span className="profile-layout-switch" aria-hidden="true">
          <span />
        </span>
      </button>
      <div
          id="profile-layout-choices"
          className={`profile-layout-switcher${isLayoutMenuOpen ? ' is-open' : ''}`}
          role="group"
          aria-label="Choose a card layout"
          aria-hidden={!isLayoutMenuOpen}
      >
        <button
            type="button"
            className={layout === 'current' ? 'is-active' : ''}
            aria-pressed={layout === 'current'}
            tabIndex={isLayoutMenuOpen ? 0 : -1}
            onClick={() => {
              onLayoutChange('current');
              setIsLayoutMenuOpen(false);
            }}
        >
          Default
        </button>
        <button
            type="button"
            className={layout === 'photo' ? 'is-active' : ''}
            aria-pressed={layout === 'photo'}
            tabIndex={isLayoutMenuOpen ? 0 : -1}
            onClick={() => {
              onLayoutChange('photo');
              setIsLayoutMenuOpen(false);
            }}
        >
          Photo-Forward
        </button>
        <button
            type="button"
            className={layout === 'magazine' ? 'is-active' : ''}
            aria-pressed={layout === 'magazine'}
            tabIndex={isLayoutMenuOpen ? 0 : -1}
            onClick={() => {
              onLayoutChange('magazine');
              setIsLayoutMenuOpen(false);
            }}
        >
          Magazine
        </button>
      </div>
    </div>
  );
};

ProfileLayoutControls.propTypes = {
  layout: PropTypes.oneOf(['current', 'photo', 'magazine']).isRequired,
  onLayoutChange: PropTypes.func.isRequired,
};

const ProfileDirectory = ({ profiles, currentMemberId }) => {
  const apiUrl = import.meta.env.VITE_APP_BASE_URL.replace(/\/$/, '');
  return (
    <div className="roster-directory" aria-label="All Directory">
      {profiles.map((profile) => {
        const profileId = getMemberId(profile);
        const name = profile.name || 'Unnamed Member';
        const rawProfileImage = getProfileImage(profile);
        const profileImage = rawProfileImage?.startsWith('/')
          ? `${apiUrl}${rawProfileImage}`
          : rawProfileImage;
        const nameParts = name.trim().split(/\s+/).filter(Boolean);
        const initials = nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
          : (nameParts[0]?.slice(0, 2) || '?');
        const isOnline = isMemberOnline(profile, currentMemberId);

        return (
          <article className="roster-directory-row" key={profileId}>
            <div className="roster-directory-photo">
              {profileImage ? (
                <>
                  <img
                      src={profileImage}
                      alt={`${name}'s profile`}
                      onError={(event) => {
                        event.currentTarget.hidden = true;
                        event.currentTarget.nextElementSibling.hidden = false;
                      }}
                  />
                  <span hidden aria-hidden="true">{initials.toUpperCase()}</span>
                </>
              ) : (
                <span aria-hidden="true">{initials.toUpperCase()}</span>
              )}
            </div>
            <div className="roster-directory-details">
              <strong>{name}</strong>
              <span>
                {profile.age ? `${profile.age} Years` : 'Age Private'}
                {profile.gender ? ` · ${profile.gender}` : ''}
              </span>
            </div>
            <span className={`roster-directory-status${isOnline ? ' is-online' : ''}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            {profileId && (
              <Link
                  className="roster-directory-link"
                  to={`/dashboard/profile?id=${profileId}`}
                  aria-label={`View ${name}'s Profile`}
              >
                View Profile
              </Link>
            )}
          </article>
        );
      })}
    </div>
  );
};

ProfileDirectory.propTypes = {
  profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentMemberId: PropTypes.string,
};

const ProfileCards = ({ profiles, currentMemberId, layout, view }) => {
  const apiUrl = import.meta.env.VITE_APP_BASE_URL.replace(/\/$/, '');
  const onlineProfiles = profiles.filter((profile) => {
    return isMemberOnline(profile, currentMemberId);
  });
  const offlineProfiles = profiles.filter((profile) => !onlineProfiles.includes(profile));

  if (view === 'directory') {
    return <ProfileDirectory profiles={profiles} currentMemberId={currentMemberId} />;
  }

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
                </div>
              </div>
          </article>
        );
      })}
    </div>
  );

  return (
      <div className={`profile-card-groups${layout === 'photo' ? ' profile-card-groups--photo' : ''}${layout === 'magazine' ? ' profile-card-groups--magazine' : ''}`}>
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
  layout: PropTypes.oneOf(['current', 'photo', 'magazine']).isRequired,
  view: PropTypes.oneOf(['cards', 'directory']).isRequired,
};