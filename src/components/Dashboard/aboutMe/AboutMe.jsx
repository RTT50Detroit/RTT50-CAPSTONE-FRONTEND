import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, isMasterUser } from '../../../utils/auth.js';
import './AboutMe.css';

const AboutMe = ({ user, memberId, canEdit }) => {
  const navigate = useNavigate();
  const [aboutMe, setAboutMe] = useState(user || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setAboutMe(user || '');
  }, [user]);

  const handleSave = async (event) => {
    event.preventDefault();
    const updatedAboutMe = aboutMe.trim();
    if (updatedAboutMe === (user || '').trim()) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');
      const token = getAuthToken();
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }
      const isMasterEditingMember = isMasterUser() && memberId;
      const saveUrl = isMasterEditingMember
        ? `${apiUrl}/api/members/${memberId}`
        : `${apiUrl}/api/members/aboutme`;
      const saveMethod = isMasterEditingMember ? 'put' : 'patch';
      await axios[saveMethod](
          saveUrl,
          { aboutMe: updatedAboutMe },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setAboutMe(updatedAboutMe);
      setIsEditing(false);
    } catch (requestError) {
      console.error('Error updating about-me content:', requestError);
      if (requestError.response?.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login', { replace: true });
        return;
      }
      setError('Unable to update your about-me content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
      <div className="user-bio">
        <h2>About me</h2>
        {isEditing ? (
          <form className="about-me-edit-form" onSubmit={handleSave}>
            <textarea
                value={aboutMe}
                onChange={(event) => setAboutMe(event.target.value)}
                rows="7"
                maxLength="2000"
                autoFocus
            />
            <div className="about-me-actions">
              <button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save about me'}
              </button>
              <button
                  type="button"
                  onClick={() => {
                    setAboutMe(user || '');
                    setIsEditing(false);
                    setError('');
                  }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <p>{aboutMe || 'No biography added yet.'}</p>
        )}
        {canEdit && !isEditing && (
          <button onClick={() => setIsEditing(true)} disabled={isSaving}>
            Edit about me
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
