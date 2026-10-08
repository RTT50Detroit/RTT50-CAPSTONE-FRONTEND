import { useState } from 'react';
import { Link } from 'react-router-dom';
import { STATUS_PHASE } from '../content/status.js';

const DISMISS_KEY = 'statusBannerDismissed';

const StatusBanner = () => {
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(DISMISS_KEY) === '1');
  if (dismissed) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

  return (
    <div className="status-banner" role="region" aria-label="Project Status">
      <p>
        <strong>{STATUS_PHASE}:</strong> This site is live but still in development.
        Features may change and data may be reset. This includes our companion site,
        The Relationship Resume.{' '}
        <Link to="/status">See What Works and What to Expect</Link>
      </p>
      <button type="button" onClick={dismiss} aria-label="Dismiss Project Status Notice">
        ×
      </button>
    </div>
  );
};

export default StatusBanner;
