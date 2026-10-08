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

// Sends a stored invite to the backend. Resolves true when the resume is now linked.
export const claimStoredInvite = async () => {
  const invite = getResumeInvite();
  if (!invite) return false;
  try {
    await axios.post(`${apiUrl()}/api/integrations/relationship-resume/claim`, { invite }, authConfig());
    clearResumeInvite();
    return true;
  } catch (error) {
    // A 400 means this invite can never work, so drop it. Other errors keep it for a retry.
    if (error.response?.status === 400) clearResumeInvite();
    return false;
  }
};

export const fetchResumeLinked = async () => {
  const { data } = await axios.get(
    `${apiUrl()}/api/integrations/relationship-resume/status`, authConfig());
  return Boolean(data.resumeLinked);
};
