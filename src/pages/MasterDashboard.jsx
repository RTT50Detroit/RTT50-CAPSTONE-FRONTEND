import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthToken } from '../utils/auth.js';
import './css/MasterDashboard.css';

const emptyProfile = {
  name: '',
  age: '',
  gender: '',
  email: '',
  password: '',
  bio: '',
};

const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');
const authConfig = () => ({
  headers: { Authorization: `Bearer ${getAuthToken()}` },
});

const MasterDashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState(emptyProfile);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [resetPassword, setResetPassword] = useState('');

  const loadProfiles = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/members`, authConfig());
      setProfiles(Array.isArray(data) ? data : data?.profiles || []);
    } catch (requestError) {
      console.error('Error loading profiles:', requestError);
      setError('Unable to load profiles.');
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const startEditing = (profile) => {
    setEditingId(profile._id || profile.id || profile.memberId);
    setForm({
      name: profile.name || '',
      age: profile.age || '',
      gender: profile.gender || '',
      email: profile.email || '',
      password: '',
      bio: profile.bio || profile.aboutme || '',
    });
    setResetPassword('');
    setStatus('');
    setError('');
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyProfile);
    setResetPassword('');
  };

  const handlePasswordReset = async () => {
    if (!editingId || resetPassword.length < 8) {
      setError('Enter a new password with at least 8 characters.');
      return;
    }

    setIsSaving(true);
    setStatus('');
    setError('');
    try {
      await axios.put(
          `${apiUrl}/api/members/${editingId}/password`,
          { password: resetPassword },
          authConfig()
      );
      setResetPassword('');
      setStatus('Password reset successfully.');
    } catch (requestError) {
      console.error('Error resetting password:', requestError);
      setError(requestError.response?.data?.error || 'Unable to reset password.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus('');
    setError('');

    try {
      const payload = { ...form, age: form.age === '' ? undefined : Number(form.age) };
      if (editingId) delete payload.password;
      if (editingId) {
        await axios.put(`${apiUrl}/api/members/${editingId}`, payload, authConfig());
        setStatus('Profile updated.');
      } else {
        await axios.post(`${apiUrl}/api/members`, payload, authConfig());
        setStatus('Profile created.');
      }
      resetForm();
      await loadProfiles();
    } catch (requestError) {
      console.error('Error saving profile:', requestError);
      setError(requestError.response?.data?.message || 'Unable to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="page-content master-dashboard">
      <header className="master-dashboard-heading">
        <p className="dashboard-eyebrow">Master controls</p>
        <h1>Manage profiles</h1>
        <p>Create profiles and update any member in the community.</p>
      </header>

      <section className="master-dashboard-grid">
        <form className="master-profile-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Update profile' : 'Create profile'}</h2>
          {error && <p className="dashboard-status dashboard-error">{error}</p>}
          {status && <p className="master-success">{status}</p>}
          {['name', 'age', 'email', ...(editingId ? [] : ['password'])].map((field) => (
            <label key={field} className="master-form-label" htmlFor={`master-${field}`}>
              {field[0].toUpperCase() + field.slice(1)}
              <input
                  id={`master-${field}`}
                  name={field}
                  type={field === 'age' ? 'number' : field}
                  value={form[field]}
                  onChange={handleChange}
                  required={field !== 'email' || field === 'password'}
              />
            </label>
          ))}
          <label className="master-form-label" htmlFor="master-gender">
            Gender
            <select id="master-gender" name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="master-form-label" htmlFor="master-bio">
            Bio
            <textarea id="master-bio" name="bio" value={form.bio} onChange={handleChange} rows="5" />
          </label>
          {editingId && (
            <div className="master-password-reset">
              <label className="master-form-label" htmlFor="master-reset-password">
                New password
                <input
                    id="master-reset-password"
                    type="password"
                    value={resetPassword}
                    onChange={(event) => setResetPassword(event.target.value)}
                    minLength="8"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                />
              </label>
              <button type="button" onClick={handlePasswordReset} disabled={isSaving}>
                Reset password
              </button>
            </div>
          )}
          <div className="master-form-actions">
            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : editingId ? 'Update profile' : 'Create profile'}
            </button>
            {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>

        <section className="master-profile-list" aria-labelledby="master-profiles-heading">
          <h2 id="master-profiles-heading">All profiles</h2>
          {profiles.map((profile) => {
            const profileId = profile._id || profile.id || profile.memberId;
            return (
              <article className="master-profile-row" key={profileId}>
                <div>
                  <strong>{profile.name || 'Unnamed member'}</strong>
                  <span>{profile.email || 'No email'}</span>
                </div>
                <button type="button" onClick={() => startEditing(profile)}>Edit</button>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
};

export default MasterDashboard;
