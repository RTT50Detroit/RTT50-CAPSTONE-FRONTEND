import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { getCurrentMemberId, isMasterUser } from '../../../utils/auth.js';
import './AboutMe.css';

const AboutMe = ({ user, memberId, canEdit }) => {
  const [bio, setBio] = useState(user || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setBio(user || '');
  }, [user]);

  const handleSave = async (event) => {
    event.preventDefault();
    const updatedBio = bio.trim();
    if (updatedBio === (user || '').trim()) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');
      const isOwnProfile = getCurrentMemberId() === String(memberId);
      const isMasterEditingMember = isMasterUser() && memberId && !isOwnProfile;
      const saveUrl = isMasterEditingMember
        ? `${apiUrl}/api/members/${memberId}`
        : `${apiUrl}/api/members/aboutme`;
      const saveMethod = isMasterEditingMember ? 'put' : 'patch';
      await axios[saveMethod](
          saveUrl,
          { bio: updatedBio },
          { headers: { Authorization: `******'authToken')}` } }
      );
      setBio(updatedBio);
      setIsEditing(false);
    } catch (requestError) {
      console.error('Error updating bio:', requestError);
      setError('Unable to update your bio. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
      <div className="user-bio">
        <h2>Bio</h2>
        {isEditing ? (
          <form className="about-me-edit-form" onSubmit={handleSave}>
            <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows="7"
                maxLength="2000"
                autoFocus
            />
            <div className="about-me-actions">
              <button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Bio'}
              </button>
              <button
                  type="button"
                  onClick={() => {
                    setBio(user || '');
                    setIsEditing(false);
                    setError('');
                  }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <p>{bio || 'No biography added yet.'}</p>
        )}
        {canEdit && !isEditing && (
          <button onClick={() => setIsEditing(true)} disabled={isSaving}>
            Edit Bio
          </button>
        )}
        {error && <p className="about-me-error">{error}</p>}
      </div>
  );
};

export default AboutMe;

AboutMe.propTypes = {
  user: PropTypes.string,
  memberId: PropTypes.string,
  canEdit: PropTypes.bool,
};
