import { Navigate, useSearchParams } from 'react-router-dom';
import { hasValidAuthToken } from '../utils/auth.js';
import { saveResumeInvite } from '../utils/resumeInvite.js';

// Landing point for members sent over from The Relationship Resume. Remembers the invite,
// then sends them to sign in; the link is added after they pass verification.
const JoinFromResume = () => {
  const [params] = useSearchParams();
  const invite = params.get('invite');

  // Saved before redirecting so the next page always finds it. The write is idempotent.
  if (invite) saveResumeInvite(invite);

  // Members who are already signed in go straight to the step that links the resume.
  return <Navigate to={hasValidAuthToken() ? '/resume-required' : '/login'} replace />;
};

export default JoinFromResume;
