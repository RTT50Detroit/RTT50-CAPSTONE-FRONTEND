import { Link } from 'react-router-dom';
import { getAuthToken, getCurrentMemberId, getTokenPayload } from '../utils/auth.js';

const LandingPage = () => {
  return (
      <main className="home-page">
        <section className="home-hero page-content">
          <div className="home-hero-copy">
            <p className="home-eyebrow">The Social Match Game</p>
            <h1>Make room for a better kind of connection.</h1>
            <p className="home-intro">
              Meet someone who gets your pace, share the stories that shaped you,
              and find a community where showing up as yourself feels natural.
            </p>
            <div className="home-actions">
              <Link className="home-primary-action" to="/register">Join the conversation</Link>
              <Link className="home-secondary-action" to="/login">Sign in</Link>
            </div>
            <p className="home-note">Dating, friendship, and a place to put your thoughts.</p>
          </div>

          <div className="home-persona-stage" aria-label="A Social Match Game member profile">
            <div className="home-persona-card">
              <div className="home-persona-topline">
                <span>Member spotlight</span>
                <span className="home-online-status">● online</span>
              </div>
              <div className="home-persona-avatar" aria-hidden="true">MC</div>
              <p className="home-persona-label">The thoughtful connector</p>
              <h2>Maya Chen, 29</h2>
              <p className="home-persona-bio">
                Product designer, Sunday cook, and collector of small, good stories.
              </p>
              <div className="home-persona-tags">
                <span>Curious minds</span>
                <span>Long walks</span>
                <span>Good questions</span>
              </div>
              <div className="home-persona-footer">
                <span>Looking for meaningful conversations</span>
                <span aria-hidden="true">-&gt;</span>
              </div>
            </div>
            <div className="home-note-card home-note-card--top">
              <span>Journal note</span>
              <strong>What made you smile today?</strong>
            </div>
            <div className="home-note-card home-note-card--bottom">
              <span>Shared interest</span>
              <strong>Slow mornings + live music</strong>
            </div>
          </div>
        </section>

        <section className="home-pillars page-content" aria-labelledby="home-pillars-heading">
          <div className="home-section-heading">
            <p className="home-eyebrow">More than a match</p>
            <h2 id="home-pillars-heading">Bring your whole self.</h2>
          </div>
          <div className="home-pillar-grid">
            <article className="home-pillar">
              <span className="home-pillar-number">01</span>
              <h3>Meet</h3>
              <p>Discover people through the details that make them uniquely themselves.</p>
            </article>
            <article className="home-pillar">
              <span className="home-pillar-number">02</span>
              <h3>Share</h3>
              <p>Keep a journal of moments, lessons, and stories worth passing along.</p>
            </article>
            <article className="home-pillar">
              <span className="home-pillar-number">03</span>
              <h3>Collaborate</h3>
              <p>Turn shared interests into thoughtful conversations and real momentum.</p>
            </article>
          </div>
        </section>
      </main>
  );
};

const MemberHub = () => {
  const payload = getTokenPayload();
  const memberId = getCurrentMemberId();
  const memberName = payload?.loginName || payload?.username || payload?.name || 'Member';
  const profilePath = memberId ? `/dashboard/profile?id=${memberId}` : '/dashboard';

  return (
      <main className="home-page member-home-page">
        <section className="member-home-hero page-content">
          <div>
            <p className="home-eyebrow">Your member hub</p>
            <h1>Welcome back, {memberName}.</h1>
            <p className="home-intro">
              Your space to meet people, keep your story moving, and stay close to
              the conversations that matter to you.
            </p>
          </div>
          <div className="member-home-mark" aria-hidden="true">
            <span>SM</span>
            <small>your space</small>
          </div>
        </section>

        <section className="member-home-content page-content" aria-labelledby="member-home-heading">
          <div className="home-section-heading">
            <p className="home-eyebrow">Make yourself at home</p>
            <h2 id="member-home-heading">Where would you like to begin?</h2>
          </div>
          <div className="member-hub-grid">
            <Link className="member-hub-card member-hub-card--primary" to="/dashboard">
              <span className="member-hub-number">01 / DISCOVER</span>
              <h3>Meet the community</h3>
              <p>Explore member profiles and find the people, ideas, and energy that fit your world.</p>
              <span className="member-hub-arrow" aria-hidden="true">-&gt;</span>
            </Link>
            <Link className="member-hub-card" to="/notes">
              <span className="member-hub-number">02 / REFLECT</span>
              <h3>Open your journal</h3>
              <p>Write down a moment, hold onto a lesson, or share a story with your community.</p>
              <span className="member-hub-arrow" aria-hidden="true">-&gt;</span>
            </Link>
            <Link className="member-hub-card" to={profilePath}>
              <span className="member-hub-number">03 / BE KNOWN</span>
              <h3>Shape your profile</h3>
              <p>Let people see the details that make you you. Your profile is yours to keep current.</p>
              <span className="member-hub-arrow" aria-hidden="true">-&gt;</span>
            </Link>
          </div>
        </section>

        <section className="member-home-prompt page-content" aria-label="Member prompt">
          <p className="home-eyebrow">A small invitation</p>
          <blockquote>“What is something you know now that you wish you knew a year ago?”</blockquote>
          <Link className="home-secondary-action" to="/notes">Write a note</Link>
        </section>
      </main>
  );
};

const Home = () => (getAuthToken() ? <MemberHub /> : <LandingPage />);

export default Home;