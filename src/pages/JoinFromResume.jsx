import { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { saveResumeInvite } from '../utils/resumeInvite.js';

// Landing point for members sent over from The Relationship Resume. Remembers the invite,
// then sends them to sign in; the link is added after they pass verification.
const JoinFromResume = () => {
  const [params] = useSearchParams();
  const invite = params.get('invite');

  useEffect(() => {
    if (invite) saveResumeInvite(invite);
  }, [invite]);

  return <Navigate to="/login" replace />;
};

export default JoinFromResume;
