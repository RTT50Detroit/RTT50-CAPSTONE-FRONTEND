import { getCurrentMemberId, getTokenPayload, isMasterUser } from './auth.js';

// Bump when the Terms, Privacy Policy, Community Guidelines, or Age Policy change materially.
// Members who accepted an older version are asked to review and accept again.
export const POLICY_VERSION = '2026-10-08.5';

const storageKey = (memberId) => `profileCompletion:${memberId}`;

export const getStoredCompletion = (memberId = getCurrentMemberId()) => {
  if (!memberId) return null;
  try {
    return JSON.parse(localStorage.getItem(storageKey(memberId)));
  } catch {
    return null;
  }
};

const FORCE_KEY = 'forceProfileCompletion';

// Set when the server reports that verification is required despite local state.
export const requireProfileCompletion = () => sessionStorage.setItem(FORCE_KEY, '1');

export const saveCompletion = (memberId, record) => {
  sessionStorage.removeItem(FORCE_KEY);
  if (!memberId) return;
  localStorage.setItem(storageKey(memberId), JSON.stringify(record));
};

// A profile is complete once the server (or this browser) records a 21+ age
// verification and acceptance of the current policy version.
export const isProfileComplete = () => {
  if (isMasterUser()) return true;
  if (sessionStorage.getItem(FORCE_KEY)) return false;

  const payload = getTokenPayload() || {};
  const serverVerified = payload.ageVerified === true
    && payload.policyVersion === POLICY_VERSION;
  if (serverVerified) return true;

  const stored = getStoredCompletion();
  return Boolean(stored?.ageVerified && stored.policyVersion === POLICY_VERSION);
};
