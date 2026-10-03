import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './AboutMe.css';


const AboutMe = ({ user, canEdit }) => {
  const [bio, setBio] = useState(user || 'No biography added yet.');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = async () => {
    const updatedBio = prompt("Edit your bio:", bio);
    if (updatedBio === null || updatedBio.trim() === bio) {
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');
      await axios.patch(
          `${apiUrl}/api/members/aboutme`,
          { bio: updatedBio.trim() },
          { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );
      setBio(updatedBio.trim());
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
        <p>{bio}</p>
        {canEdit && (
          <button onClick={handleEdit} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Edit Bio'}
          </button>
        )}
        {error && <p className="about-me-error">{error}</p>}
      </div>
  );
};

export default AboutMe;

AboutMe.propTypes = {
  user: PropTypes.string,
  canEdit: PropTypes.bool,
};