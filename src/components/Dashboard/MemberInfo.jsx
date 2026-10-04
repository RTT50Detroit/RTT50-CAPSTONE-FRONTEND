import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { getAuthToken } from '../../utils/auth.js';

const emptyLink = { label: '', url: '' };

const normalizeHobbies = (hobbies) => (
  Array.isArray(hobbies) ? hobbies : hobbies ? [hobbies] : []
);

const MemberInfo = ({ user, canEdit, onSaved }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ occupation: '', hobbies: '', links: [] });

  useEffect(() => {
    setForm({
      occupation: user?.occupation || '',
      hobbies: normalizeHobbies(user?.hobbies).join(', '),
      links: user?.links?.length ? user.links : [],
    });
  }, [user]);

  if (!user) return <p>No member information found.</p>;

  const updateLink = (index, field, value) => {
    setForm((current) => ({
      ...current,
      links: current.links.map((link, linkIndex) => (
        linkIndex === index ? { ...link, [field]: value } : link
      )),
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    const links = form.links
        .map(({ label, url }) => ({ label: label.trim(), url: url.trim() }))
        .filter(({ label, url }) => label || url);

    if (links.some(({ label, url }) => !label || !url)) {
      setError('Each link needs both a label and a URL.');
      setIsSaving(false);
      return;
    }

    try {
      const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');
      const { data } = await axios.patch(
          `${apiUrl}/api/members/aboutme`,
          {
            bio: user.bio ?? user.aboutme ?? '',
            occupation: form.occupation.trim(),
            hobbies: form.hobbies.split(',').map((hobby) => hobby.trim()).filter(Boolean),
            links,
          },
          { headers: { Authorization: `Bearer ${getAuthToken()}` } },
      );
      onSaved(data.profile);
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
        {isEditing ? (
          <form className="profile-details-form" onSubmit={handleSave}>
            <label>
              Occupation
              <input
                  value={form.occupation}
                  onChange={(event) => setForm((current) => ({
                    ...current, occupation: event.target.value,
                  }))}
                  maxLength="120"
              />
            </label>
            <label>
              Hobbies <span>(separate with commas)</span>
              <input
                  value={form.hobbies}
                  onChange={(event) => setForm((current) => ({
                    ...current, hobbies: event.target.value,
                  }))}
                  placeholder="Reading, hiking, cooking"
              />
            </label>
            <fieldset>
              <legend>Links and socials</legend>
              {form.links.map((link, index) => (
                <div className="profile-link-edit-row" key={index}>
                  <input
                      aria-label={`Link ${index + 1} label`}
                      value={link.label}
                      onChange={(event) => updateLink(index, 'label', event.target.value)}
                      placeholder="Instagram"
                      maxLength="50"
                  />
                  <input
                      aria-label={`Link ${index + 1} URL`}
                      type="url"
                      value={link.url}
                      onChange={(event) => updateLink(index, 'url', event.target.value)}
                      placeholder="https://..."
                      maxLength="500"
                  />
                  <button
                      type="button"
                      className="profile-link-remove"
                      onClick={() => setForm((current) => ({
                        ...current, links: current.links.filter((_, linkIndex) => linkIndex !== index),
                      }))}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {form.links.length < 10 && (
                <button
                    type="button"
                    className="profile-link-add"
                    onClick={() => setForm((current) => ({
                      ...current, links: [...current.links, { ...emptyLink }],
                    }))}
                >
                  + Add a link
                </button>
              )}
            </fieldset>
            <div className="profile-details-actions">
              <button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save details'}
              </button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
            {error && <p className="profile-edit-error">{error}</p>}
          </form>
        ) : (
          <>
            <div className="additional-info">
              <p><strong>Age:</strong> {user.age || 'Not provided'}</p>
              <p><strong>Gender:</strong> {user.gender || 'Not provided'}</p>
              <p><strong>Occupation:</strong> {user.occupation || 'Not provided'}</p>
              <p><strong>Hobbies:</strong> {normalizeHobbies(user.hobbies).join(', ') || 'Not provided'}</p>
            </div>
            {user.links?.length > 0 && (
              <div className="profile-links">
                <strong>Links & socials</strong>
                {user.links.map((link) => (
                  <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            )}
            {canEdit && (
              <button className="profile-details-edit" type="button" onClick={() => setIsEditing(true)}>
                Edit details
              </button>
            )}
          </>
        )}
      </section>
  );
};

export default MemberInfo;

MemberInfo.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gender: PropTypes.string,
    bio: PropTypes.string,
    aboutme: PropTypes.string,
    occupation: PropTypes.string,
    hobbies: PropTypes.arrayOf(PropTypes.string),
    links: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string,
    })),
  }),
  canEdit: PropTypes.bool,
  onSaved: PropTypes.func,
};