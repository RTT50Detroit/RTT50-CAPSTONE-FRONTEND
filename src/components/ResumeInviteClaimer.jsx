import axios from 'axios';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { hasValidAuthToken } from '../utils/auth.js';
import { isProfileComplete } from '../utils/profileCompletion.js';
import { clearResumeInvite, getResumeInvite } from '../utils/resumeInvite.js';

// Once a member who arrived from The Relationship Resume is signed in and verified, sends
// their invite to the backend so the resume link lands on their profile. Renders nothing.
const ResumeInviteClaimer = () => {
  const location = useLocation();

  useEffect(() => {
    const invite = getResumeInvite();
    if (!invite || !hasValidAuthToken() || !isProfileComplete()) return;

    const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');
    const token = localStorage.getItem('authToken');
    axios.post(
      `${apiUrl}/api/integrations/relationship-resume/claim`,
      { invite },
      { headers: token ? { Authorization: `Bearer ${token}` } : {}, withCredentials: true },
    )
        .then(() => {
          clearResumeInvite();
          sessionStorage.setItem('resumeLinked', '1');
        })
        .catch((error) => {
          // Keep the invite for a retry unless the server says it can never work.
          if (error.response?.status === 400) clearResumeInvite();
        });
  }, [location.pathname]);

  return null;
};

export default ResumeInviteClaimer;
