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

// Sends a stored invite to the backend. Resolves { linked, message } where message explains
// why a resume was refused, for example when its details do not match this profile.
export const claimStoredInvite = async () => {
  const invite = getResumeInvite();
  if (!invite) return { linked: false, message: '' };
  try {
    await axios.post(`${apiUrl()}/api/integrations/relationship-resume/claim`, { invite }, authConfig());
    clearResumeInvite();
    return { linked: true, message: '' };
  } catch (error) {
    // Client errors mean this invite can never work, so drop it. Other errors keep it for a retry.
    if (error.response?.status >= 400 && error.response?.status < 500
      && error.response?.status !== 401 && error.response?.status !== 403) {
      clearResumeInvite();
    }
    return { linked: false, message: error.response?.data?.message || '' };
  }
};

export const fetchResumeLinked = async () => {
  const { data } = await axios.get(
    `${apiUrl()}/api/integrations/relationship-resume/status`, authConfig());
  return Boolean(data.resumeLinked);
};
