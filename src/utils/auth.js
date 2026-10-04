import { jwtDecode } from 'jwt-decode';

export const getAuthToken = () => localStorage.getItem('authToken');

export const getTokenPayload = () => {
  const token = getAuthToken();

  try {
    if (token) return jwtDecode(token);
    const sessionUser = localStorage.getItem('authUser');
    return sessionUser ? JSON.parse(sessionUser) : null;
  } catch {
    return null;
  }
};

export const hasValidAuthToken = () => {
  const payload = getTokenPayload();

  if (!payload) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    return false;
  }

  const isValid = !payload.exp || payload.exp * 1000 > Date.now();
  if (!isValid) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }

  return isValid;
};

export const getCurrentMemberId = () => {
  const payload = getTokenPayload();
  const memberId = payload?.id || payload?._id || payload?.userId ||
    payload?.memberId || payload?.sub;

  return memberId ? String(memberId) : null;
};

export const getCurrentUserRole = () => {
  const payload = getTokenPayload();
  const role = payload?.role || payload?.userRole || payload?.permissions;

  return Array.isArray(role) ? role : role ? [role] : [];
};

export const isMasterUser = () => (
  getCurrentUserRole().some((role) => String(role).toLowerCase() === 'master')
);