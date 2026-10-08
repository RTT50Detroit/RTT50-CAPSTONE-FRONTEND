import { Link, Navigate, useParams } from 'react-router-dom';
import { POLICY_UPDATED, getPolicy, policies } from '../content/policies.js';
import './css/Policy.css';

export const PoliciesIndex = () => (
  <main className="page-content policy-page">
    <article className="policy-card">
      <p className="auth-panel-eyebrow">POLICIES</p>
      <h1>Our Policies</h1>
      <p className="policy-summary">
        The standards that keep The Social Match Game safe, respectful, and adults-only.
      </p>
      <ul className="policy-index">
        {policies.map((policy) => (
          <li key={policy.slug}>
            <Link to={`/policies/${policy.slug}`}>
              <strong>{policy.title}</strong>
              <span>{policy.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  </main>
);

const PolicyPage = () => {
  const { slug } = useParams();
  const policy = getPolicy(slug);

  if (!policy) return <Navigate to="/policies" replace />;

  return (
    <main className="page-content policy-page">
      <article className="policy-card">
        <p className="auth-panel-eyebrow">LAST UPDATED {POLICY_UPDATED.toUpperCase()}</p>
        <h1>{policy.title}</h1>
        <p className="policy-summary">{policy.summary}</p>

        {policy.sections.map((section) => (
          <section key={section.heading} className="policy-section">
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.items && (
              <ul>
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
            {section.links?.map((link) => (
              <p key={link.to}><Link to={link.to}>{link.label}</Link></p>
            ))}
          </section>
        ))}

        <nav className="policy-related" aria-label="Other Policies">
          {policies.filter((other) => other.slug !== policy.slug).map((other) => (
            <Link key={other.slug} to={`/policies/${other.slug}`}>{other.title}</Link>
          ))}
        </nav>
      </article>
    </main>
  );
};

export default PolicyPage;
