import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { hasValidAuthToken } from '../utils/auth.js';
import { isProfileComplete } from '../utils/profileCompletion.js';
import { claimStoredInvite, fetchResumeLinked } from '../utils/resumeInvite.js';
import { RESUME_URL } from '../content/status.js';
import './css/Login.css';
import './css/Policy.css';

// Members need a Relationship Resume to use The Social Match Game. This page links one that
// arrived by invite, forwards members who already have one, and otherwise sends them to create it.
const ResumeRequired = () => {
  const [state, setState] = useState('checking');
  const [notice, setNotice] = useState('');

  const check = async () => {
    setState('checking');
    try {
      const claim = await claimStoredInvite();
      setNotice(claim.message);
      setState(await fetchResumeLinked() ? 'linked' : 'missing');
    } catch {
      setState('error');
    }
  };

  useEffect(() => {
    if (hasValidAuthToken() && isProfileComplete()) check();
  }, []);

  if (!hasValidAuthToken()) return <Navigate to="/login" replace />;
  if (!isProfileComplete()) return <Navigate to="/complete-profile" replace />;
  if (state === 'linked') return <Navigate to="/dashboard" replace />;

  return (
    <main className="page-content complete-profile-page">
      <section className="complete-profile-card" aria-labelledby="resume-required-title">
        <p className="auth-panel-eyebrow">Start Here</p>
        <h2 id="resume-required-title">Your Relationship Resume Comes First</h2>
        <p className="complete-profile-intro">
          The Relationship Resume is the heart of The Social Match Game. Create yours there, then
          send it here. It is added to your profile automatically once you pass our age and
          policy checks.
        </p>

        {state === 'checking' && <p role="status">Checking Your Resume…</p>}
        {notice && <p className="error-message" role="alert">{notice}</p>}
        {state === 'error' && (
          <p className="error-message" role="alert">
            We could not check your resume just now. Please try again.
          </p>
        )}

        <div className="complete-profile-actions">
          <a className="submit-button" href={RESUME_URL} target="_blank" rel="noreferrer">
            Create My Relationship Resume
          </a>
          <button type="button" className="submit-button resume-secondary" onClick={check} disabled={state === 'checking'}>
            {notice ? 'Check Again' : 'I Sent My Resume'}
          </button>
        </div>
        <p className="complete-profile-hint">
          Questions? See <Link to="/status">Project Status</Link>.
        </p>
      </section>
    </main>
  );
};

export default ResumeRequired;
