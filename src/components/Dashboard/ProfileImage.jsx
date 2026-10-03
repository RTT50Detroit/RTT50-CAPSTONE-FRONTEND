import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');

const resolveImageUrl = (imageUrl) => (
  imageUrl?.startsWith('/') ? `${apiUrl}${imageUrl}` : imageUrl
);

const ProfileImage = ({ profileImageUrl, memberId, canEdit }) => {
  const [imageUrl, setImageUrl] = useState(resolveImageUrl(profileImageUrl));
  const [error, setError] = useState('');

  useEffect(() => {
    setImageUrl(resolveImageUrl(profileImageUrl));
  }, [profileImageUrl]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !memberId) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      setError('');
      await axios.post(
          `${apiUrl}/api/members/profile-image/${memberId}`,
          formData,
          { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );
      setImageUrl(URL.createObjectURL(file));
    } catch (uploadError) {
      console.error('Error uploading image:', uploadError);
      setError('Unable to update profile picture.');
    }
  };

  return (
      <div className="profile-image">
        <img
            src={imageUrl || 'https://api.dicebear.com/5.x/initials/svg?seed=member'}
            alt="Member profile"
        />
        {canEdit && (
          <>
            <label className="profile-image-button" htmlFor="image-upload">
              Change profile picture
            </label>
            <input
                id="image-upload"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageUpload}
            />
          </>
        )}
        {error && <p className="profile-image-error">{error}</p>}
      </div>
  );
};

export default ProfileImage;

ProfileImage.propTypes = {
  profileImageUrl: PropTypes.string,
  memberId: PropTypes.string.isRequired,
  canEdit: PropTypes.bool,
};