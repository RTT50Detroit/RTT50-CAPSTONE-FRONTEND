import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { getAuthToken, isMasterUser } from '../../utils/auth.js';

const relationshipResumeBaseUrl = 'https://therelationshipresume.netlify.app/';

const getRelationshipResumeUrl = (username) => {
  const url = new URL(relationshipResumeBaseUrl);
  if (username) url.pathname = `/r/${encodeURIComponent(username)}`;
  return url.toString().replace(/\/$/, '');
};

const getRelationshipResumeUsername = (link) => {
  try {
    const pathParts = new URL(link.url).pathname.split('/').filter(Boolean);
    return pathParts[0] === 'r' ? decodeURIComponent(pathParts[1] || '') : '';
  } catch {
    return '';
  }
};

const normalizeHobbies = (hobbies) => (
  Array.isArray(hobbies) ? hobbies : hobbies ? [hobbies] : []
);

const relationshipResumeLink = (username) => ({
  label: 'Relationship Resume',
  url: getRelationshipResumeUrl(username),
});

const getProfileRelationshipResumeUsername = (user) => {
  const relationshipResume = user?.links?.find((link) => (
    link.label?.toLowerCase() === 'relationship resume'
  ));

  return getRelationshipResumeUsername(relationshipResume);
};

const getProfileRelationshipResumeLink = (user) => {
  const relationshipResume = user?.links?.find((link) => (
    link.label?.toLowerCase() === 'relationship resume'
  ));

  return relationshipResume || relationshipResumeLink('');
};

const MemberInfo = ({ user, memberId, canEdit, onSaved }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    age: '',
    gender: '',
    occupation: '',
    hobbies: '',
    links: [],
    relationshipResumeUsername: '',
  });

  useEffect(() => {
    const username = getProfileRelationshipResumeUsername(user);

    setForm({
      age: user?.age ?? '',
      gender: user?.gender || '',
      occupation: user?.occupation || '',
      hobbies: normalizeHobbies(user?.hobbies).join(', '),
      links: [relationshipResumeLink(username)],
      relationshipResumeUsername: username,
    });
  }, [user]);

  if (!user) return <p>No member information found.</p>;

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    const username = form.relationshipResumeUsername.trim();
    const links = username ? [relationshipResumeLink(username)] : [];
    const age = Number(form.age);
    if (!Number.isInteger(age) || age < 18 || age > 120) {
      setError('Age must be a whole number between 18 and 120.');
      setIsSaving(false);
      return;
    }
    if (!form.gender.trim()) {
      setError('Please select a gender.');
      setIsSaving(false);
      return;
    }

    try {
      const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');
      const isMasterEditingMember = isMasterUser() && memberId;
      const saveUrl = isMasterEditingMember
        ? `${apiUrl}/api/members/${memberId}`
        : `${apiUrl}/api/members/aboutme`;
      const saveMethod = isMasterEditingMember ? 'put' : 'patch';
      const payload = {
        age,
        gender: form.gender.trim(),
        aboutMe: user.aboutMe ?? user.aboutme ?? '',
        occupation: form.occupation.trim(),
        hobbies: form.hobbies.split(',').map((hobby) => hobby.trim()).filter(Boolean),
        links,
      };
      const { data } = await axios[saveMethod](
          saveUrl,
          payload,
          { headers: { Authorization: `Bearer ${getAuthToken()}` } },
      );
      onSaved({
        ...user,
        ...(data.profile || data.member || {}),
        age,
        gender: form.gender.trim(),
        occupation: form.occupation.trim(),
        hobbies: form.hobbies.split(',').map((hobby) => hobby.trim()).filter(Boolean),
        links,
      });
      setIsEditing(false);
    } catch (requestError) {
      console.error('Error updating profile details:', requestError);
      setError(requestError.response?.data?.message ||
        'Unable to update your profile details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
      <section className="user-info-container">
        <p className="profile-detail-label">Member details</p>
        <h2>{user.name || 'Unnamed member'}</h2>
        <form className={isEditing ? 'profile-details-form' : ''} onSubmit={handleSave}>
          <div className="additional-info">
            <label>
              <strong>Age:</strong>
              {isEditing ? (
                <input
                    type="number"
                    min="18"
                    max="120"
                    step="1"
                    value={form.age}
                    onChange={(event) => setForm((current) => ({
                      ...current, age: event.target.value,
                    }))}
                    required
                    autoComplete="bday"
                />
              ) : user.age || 'Not provided'}
            </label>
            <label>
              <strong>Gender:</strong>
              {isEditing ? (
                <select
                    value={form.gender}
                    onChange={(event) => setForm((current) => ({
                      ...current, gender: event.target.value,
                    }))}
                    required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              ) : user.gender || 'Not provided'}
            </label>
            <label>
              <strong>Occupation:</strong>
              {isEditing ? (
                <input
                    value={form.occupation}
                    onChange={(event) => setForm((current) => ({
                      ...current, occupation: event.target.value,
                    }))}
                    maxLength="120"
                    autoComplete="organization-title"
                />
              ) : user.occupation || 'Not provided'}
            </label>
            <label>
              <strong>Hobbies:</strong>
              {isEditing ? (
                <input
                    value={form.hobbies}
                    onChange={(event) => setForm((current) => ({
                      ...current, hobbies: event.target.value,
                    }))}
                    placeholder="Reading, hiking, cooking"
                    autoComplete="off"
                />
              ) : normalizeHobbies(user.hobbies).join(', ') || 'Not provided'}
            </label>
          </div>
          <div className="profile-links">
            <strong>Relationship Resume</strong>
            <a
                href={getProfileRelationshipResumeLink(user).url}
                target="_blank"
                rel="noreferrer"
            >
              <span>{getProfileRelationshipResumeLink(user).url}</span>
            </a>
            {isEditing && (
              <label>
                Relationship Resume username
                <input
                    value={form.relationshipResumeUsername}
                    onChange={(event) => setForm((current) => ({
                      ...current,
                      relationshipResumeUsername: event.target.value,
                    }))}
                    placeholder="Enter your username"
                    maxLength="100"
                    autoComplete="username"
                />
              </label>
            )}
          </div>
          {isEditing && (
            <>
              <div className="profile-details-actions">
                <button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save details'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
              {error && <p className="profile-edit-error">{error}</p>}
            </>
          )}
          {!isEditing && canEdit && (
            <button className="profile-details-edit" type="button" onClick={() => setIsEditing(true)}>
              Edit details
            </button>
          )}
        </form>
      </section>
  );
};

export default MemberInfo;

MemberInfo.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    username: PropTypes.string,
    loginName: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gender: PropTypes.string,
    aboutMe: PropTypes.string,
    aboutme: PropTypes.string,
    occupation: PropTypes.string,
    hobbies: PropTypes.arrayOf(PropTypes.string),
    links: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string,
    })),
  }),
  canEdit: PropTypes.bool,
  memberId: PropTypes.string,
  onSaved: PropTypes.func,
};