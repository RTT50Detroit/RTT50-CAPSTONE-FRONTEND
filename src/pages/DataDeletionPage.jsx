import { useSearchParams } from 'react-router-dom';
import { CONTACT_EMAIL } from '../content/policies.js';
import './css/Policy.css';

const DataDeletionPage = () => {
  const [searchParams] = useSearchParams();
  const confirmationCode = searchParams.get('confirmation_code');
  const requestComplete = searchParams.get('status') === 'complete' && confirmationCode;

  return (
    <main className="page-content policy-page">
      <article className="policy-card">
        <p className="auth-panel-eyebrow">Data Privacy</p>
        <h1>{requestComplete ? 'Deletion Request Complete' : 'Facebook User Data Deletion'}</h1>
        {requestComplete ? (
          <section className="policy-section" aria-live="polite">
            <p>
              The Facebook data deletion request has been processed. Your confirmation code is:
            </p>
            <p><strong>{confirmationCode}</strong></p>
          </section>
        ) : (
          <>
            <p className="policy-summary">
              You can request deletion of the Social Match Game account and data linked to your
              Facebook account.
            </p>
            <section className="policy-section">
              <h2>Request Deletion Through Facebook</h2>
              <p>
                Submit a data deletion request through Facebook. We verify Meta’s signed deletion
                callback and automatically remove any account data linked to the Facebook user ID,
                including profile information, notes, feedback contributions, and related records.
                This does not delete information held by Meta.
              </p>
            </section>
            <section className="policy-section">
              <h2>Request Help by Email</h2>
              <p>
                If you cannot use Facebook’s deletion flow, email us from the address associated
                with your Social Match Game account and tell us you are requesting Facebook data
                deletion. Do not send your Facebook password.
              </p>
              <p>
                <a href={`mailto:${CONTACT_EMAIL}?subject=Facebook%20Data%20Deletion%20Request`}>
                  Email {CONTACT_EMAIL}
                </a>
              </p>
            </section>
          </>
        )}
      </article>
    </main>
  );
};

export default DataDeletionPage;
