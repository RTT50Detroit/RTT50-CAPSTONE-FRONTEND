const KEY = 'resumeInvite';

export const getResumeInvite = () => localStorage.getItem(KEY);
export const saveResumeInvite = (invite) => localStorage.setItem(KEY, invite);
export const clearResumeInvite = () => localStorage.removeItem(KEY);
