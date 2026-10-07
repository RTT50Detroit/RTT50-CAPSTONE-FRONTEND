import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useRef } from 'react';

const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');

const resolveImageUrl = (imageUrl) => (
  imageUrl?.startsWith('/') ? `${apiUrl}${imageUrl}` : imageUrl
);

const ProfileImage = ({
  profileImageUrl, memberId, canEdit, editRequested, onEditRequestHandled,
}) => {
  const [imageUrl, setImageUrl] = useState(resolveImageUrl(profileImageUrl));
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setImageUrl(resolveImageUrl(profileImageUrl));
  }, [profileImageUrl]);

  useEffect(() => {
    if (!editRequested || !canEdit) return;
    fileInputRef.current?.click();
    onEditRequestHandled?.();
  }, [canEdit, editRequested, onEditRequestHandled]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !memberId) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      setError('');
      const response = await axios.post(
          `${apiUrl}/api/members/profile-image/${memberId}`,
          formData,
          { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );
      const savedImageUrl = response.data?.profileImageUrl;
      setImageUrl(resolveImageUrl(savedImageUrl) || URL.createObjectURL(file));
    } catch (uploadError) {
      console.error('Error uploading image:', uploadError);
      setError(uploadError.response?.data?.message ||
        'Unable to update profile picture.');
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
                ref={fileInputRef}
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
  editRequested: PropTypes.bool,
  onEditRequestHandled: PropTypes.func,
};