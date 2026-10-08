import { useMemo, useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  DATE_OF_BIRTH_MESSAGES, MINIMUM_AGE, getBirthDateBounds, validateDateOfBirth,
} from '../utils/age.js';
import { getCurrentMemberId, hasValidAuthToken } from '../utils/auth.js';
import { POLICY_VERSION, isProfileComplete, saveCompletion } from '../utils/profileCompletion.js';
import './css/Login.css';
import './css/Policy.css';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const bounds = useMemo(() => getBirthDateBounds(), []);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [confirmsAdult, setConfirmsAdult] = useState(false);
  const [acceptsPolicies, setAcceptsPolicies] = useState(false);
  const [error, setError] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const signOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login', { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Underage dates still go to the server, which removes the account and blocks a retry.
    const result = validateDateOfBirth(dateOfBirth);
    if (!result.valid && result.reason !== 'underage') {
      setError(DATE_OF_BIRTH_MESSAGES[result.reason]);
      return;
    }
    if (!gender) {
      setError('Please select a gender.');
      return;
    }
    if (!confirmsAdult || !acceptsPolicies) {
      setError('Please confirm your age and accept the policies to continue.');
      return;
    }

    setIsSubmitting(true);
    const acceptedAt = new Date().toISOString();

    try {
      const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');
      const token = localStorage.getItem('authToken');
      const { data } = await axios.post(
        `${apiUrl}/api/members/age-verification`,
        { dateOfBirth, gender, confirmsAdult, acceptsPolicies },
        { headers: token ? { Authorization: `Bearer ${token}` } : {}, withCredentials: true },
      );

      if (token && data.token) localStorage.setItem('authToken', data.token);
      else if (data.user) localStorage.setItem('authUser', JSON.stringify(data.user));

      saveCompletion(getCurrentMemberId(), {
        ageVerified: true,
        policyVersion: POLICY_VERSION,
        policiesAcceptedAt: acceptedAt,
      });
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      if (requestError.response?.data?.code === 'UNDERAGE') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setIsBlocked(true);
        return;
      }
      console.error('Error completing profile:', requestError);
      setError(requestError.response?.data?.message
        || 'We could not save your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isBlocked) {
    return (
      <main className="page-content complete-profile-page">
        <section className="complete-profile-card" aria-labelledby="blocked-title">
          <p className="auth-panel-eyebrow">AGE REQUIREMENT</p>
          <h2 id="blocked-title">You Must Be {MINIMUM_AGE} or Older</h2>
          <p className="complete-profile-intro">
            The Social Match Game is for adults only. We cannot create an account
            for you, and we do not keep your date of birth. Read our{' '}
            <Link to="/policies/age-policy">Age Policy</Link> to learn more.
          </p>
          <button type="button" className="submit-button" onClick={signOut}>
            Sign Out
          </button>
        </section>
      </main>
    );
  }

  if (!hasValidAuthToken()) return <Navigate to="/login" replace />;
  if (isProfileComplete()) return <Navigate to="/dashboard" replace />;

  return (
    <main className="page-content complete-profile-page">
      <section className="complete-profile-card" aria-labelledby="complete-title">
        <p className="auth-panel-eyebrow">ONE LAST STEP</p>
        <h2 id="complete-title">Complete Your Profile</h2>
        <p className="complete-profile-intro">
          This community is for adults. Confirm your age and review our policies to continue.
        </p>

        {error && <p className="error-message" role="alert">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form complete-profile-form" noValidate>
          <div className="auth-field">
            <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              className="form-input"
              value={dateOfBirth}
              min={bounds.min}
              max={bounds.max}
              onChange={(event) => setDateOfBirth(event.target.value)}
              autoComplete="bday"
              required
            />
            <small className="complete-profile-hint">
              Only your age is shown to other members.
            </small>
          </div>

          <div className="auth-field">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select
              id="gender"
              className="form-input"
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              required
            >
              <option value="">Select an Option</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <label className="policy-check">
            <input
              type="checkbox"
              checked={confirmsAdult}
              onChange={(event) => setConfirmsAdult(event.target.checked)}
            />
            <span>
              I am at least {MINIMUM_AGE} years old and the date of birth I entered is accurate.
            </span>
          </label>

          <label className="policy-check">
            <input
              type="checkbox"
              checked={acceptsPolicies}
              onChange={(event) => setAcceptsPolicies(event.target.checked)}
            />
            <span>
              I agree to the{' '}
              <Link to="/policies/terms" target="_blank">Terms of Service</Link>,{' '}
              <Link to="/policies/privacy" target="_blank">Privacy Policy</Link>,{' '}
              <Link to="/policies/community-guidelines" target="_blank">Community Guidelines</Link>,
              {' '}and{' '}
              <Link to="/policies/age-policy" target="_blank">Age Policy</Link>.
            </span>
          </label>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Continue'}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
        </form>
      </section>
    </main>
  );
};

export default CompleteProfile;
