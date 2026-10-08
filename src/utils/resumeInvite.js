import axios from 'axios';

const KEY = 'resumeInvite';
const apiUrl = () => (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');
const authConfig = () => {
  const token = localStorage.getItem('authToken');
  return { headers: token ? { Authorization: `Bearer ${token}` } : {}, withCredentials: true };
};

export const getResumeInvite = () => localStorage.getItem(KEY);
export const saveResumeInvite = (invite) => localStorage.setItem(KEY, invite);
export const clearResumeInvite = () => localStorage.removeItem(KEY);

const FIELD_HELP = {
  name: 'Your name on the resume must match the name on your Google or GitHub account. Update the name on that account (GitHub needs a display name) and sign in again, or correct the name on your resume.',
  dateOfBirth: 'Your date of birth on the resume must match the one you verified here. Correct it on The Relationship Resume.',
  sex: 'Your sex on the resume must match what you verified here. Correct it on The Relationship Resume.',
};

// Sends a stored invite to the backend. Resolves { linked, retry, message } where message
// explains why a resume was refused and retry says whether the same invite can be checked again.
export const claimStoredInvite = async () => {
  const invite = getResumeInvite();
  if (!invite) return { linked: false, retry: false, message: '' };
  try {
    await axios.post(`${apiUrl()}/api/integrations/relationship-resume/claim`, { invite }, authConfig());
    clearResumeInvite();
    return { linked: true, retry: false, message: '' };
  } catch (error) {
    const data = error.response?.data || {};
    const status = error.response?.status;
    if (data.code === 'IDENTITY_MISMATCH') {
      if (!data.retry) clearResumeInvite();
      const help = (data.fields || []).map((field) => FIELD_HELP[field]).filter(Boolean).join(' ');
      const tail = data.retry
        ? `You can check again after correcting this (${data.attemptsLeft} ${data.attemptsLeft === 1 ? 'try' : 'tries'} left).`
        : 'Correct your resume details, then send your resume again from The Relationship Resume.';
      return { linked: false, retry: Boolean(data.retry), message: `${data.message} ${help} ${tail}` };
    }
    // Other client errors mean this invite can never work, so drop it. Network and server errors keep it.
    if (status >= 400 && status < 500 && status !== 401 && status !== 403) clearResumeInvite();
    return { linked: false, retry: false, message: data.message || '' };
  }
};

export const fetchResumeLinked = async () => {
  const { data } = await axios.get(
    `${apiUrl()}/api/integrations/relationship-resume/status`, authConfig());
  return Boolean(data.resumeLinked);
};
