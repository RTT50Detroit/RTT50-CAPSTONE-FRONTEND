import { jwtDecode } from 'jwt-decode';

export const getAuthToken = () => localStorage.getItem('authToken');

export const getTokenPayload = () => {
  const token = getAuthToken();

  try {
    return token ? jwtDecode(token) : null;
  } catch {
    return null;
  }
};

export const hasValidAuthToken = () => {
  const payload = getTokenPayload();

  if (!payload) {
    return false;
  }

  return !payload.exp || payload.exp * 1000 > Date.now();
};

export const getCurrentMemberId = () => {
  const payload = getTokenPayload();
  const memberId = payload?.id || payload?._id || payload?.userId ||
    payload?.memberId || payload?.sub;

  return memberId ? String(memberId) : null;
};