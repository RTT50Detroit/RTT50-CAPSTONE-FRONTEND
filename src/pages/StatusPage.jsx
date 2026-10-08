import { Link } from 'react-router-dom';
import {
  RESUME_URL, STATUS_PHASE, STATUS_UPDATED, statusContent,
} from '../content/status.js';
import { policies } from '../content/policies.js';
import './css/Policy.css';

const StatusPage = () => (
  <main className="page-content policy-page">
    <article className="policy-card">
      <p className="auth-panel-eyebrow">LAST UPDATED {STATUS_UPDATED.toUpperCase()}</p>
      <h1>Project Status</h1>
      <p className="status-phase-badge">Current Phase: {STATUS_PHASE}</p>
      <p className="policy-summary">{statusContent.summary}</p>

      <section className="policy-section">
        <h2>Where We Are</h2>
        {statusContent.phase.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </section>

      <section className="policy-section">
        <h2>The Relationship Resume</h2>
        {statusContent.companion.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <ol>
          {statusContent.companionSteps.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <p>
          <a href={RESUME_URL} target="_blank" rel="noreferrer">
            Explore The Relationship Resume →
          </a>
        </p>
      </section>

      <section className="policy-section">
        <h2>What You Can Do Today</h2>
        <ul>
          {statusContent.available.map(([title, description]) => (
            <li key={title}><strong>{title}:</strong> {description}</li>
          ))}
        </ul>
      </section>

      <section className="policy-section">
        <h2>Coming Soon</h2>
        <ul>{statusContent.comingSoon.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="policy-section">
        <h2>What to Expect</h2>
        <ul>{statusContent.expectations.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="policy-section">
        <h2>Who It Is For</h2>
        <ul>
          {statusContent.useCases.map(([title, description]) => (
            <li key={title}><strong>{title}:</strong> {description}</li>
          ))}
        </ul>
      </section>

      <section className="policy-section">
        <h2>Staying Safe</h2>
        <ul>{statusContent.safety.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <nav className="policy-related" aria-label="Related Pages">
        {policies.map((policy) => (
          <Link key={policy.slug} to={`/policies/${policy.slug}`}>{policy.title}</Link>
        ))}
      </nav>
    </article>
  </main>
);

export default StatusPage;
