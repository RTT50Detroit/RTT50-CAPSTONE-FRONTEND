import { Link } from 'react-router-dom';
import { getCurrentMemberId, getTokenPayload, hasValidAuthToken } from '../utils/auth.js';

const LandingPage = () => {
  return (
      <main className="home-page">
        <section className="home-hero page-content">
          <div className="home-hero-copy">
            <p className="home-eyebrow">Connection, with intention</p>
            <h1>
              A space for Black connection, <span>built around the whole you.</span>
            </h1>
            <p className="home-intro">
              Meet people who get your rhythm. Share the stories that shaped you.
              Find your people in a community made for real conversation and
              showing up as yourself.
            </p>
            <p className="home-companion-note">
              Dating, friendship, and a little more room to be yourself.
            </p>
            <div className="home-actions">
              <Link className="home-primary-action" to="/register">
                Join the Community <span aria-hidden="true">-&gt;</span>
              </Link>
              <Link className="home-secondary-action" to="/login">Sign In</Link>
            </div>
            <p className="home-note">Come as you are. Connection starts here.</p>
          </div>

          <div className="home-persona-stage">
            <img
              className="home-portrait"
              src="https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/BLACK_COUPLE_AND_THEIR_DOG_IN_THEIR_APARTMENT_IN_SOUTH_SIDE_CHICAGO._FROM_1960_TO_1970_THE_PERCENTAGE_OF_CHICAGO..._-_NARA_-_556171.jpg/960px-BLACK_COUPLE_AND_THEIR_DOG_IN_THEIR_APARTMENT_IN_SOUTH_SIDE_CHICAGO._FROM_1960_TO_1970_THE_PERCENTAGE_OF_CHICAGO..._-_NARA_-_556171.jpg"
              alt="A Black couple at home with their dog in Chicago, photographed in 1973"
              fetchPriority="high"
            />
            <div className="home-image-caption" aria-hidden="true">
              <span className="home-image-caption-line">Real stories.</span>
              <span className="home-image-caption-line home-image-caption-line--accent">
                Meaningful connections.
              </span>
            </div>
            <div className="home-persona-card">
              <div className="home-persona-topline">
                <span>A community for you</span>
                <span className="home-online-status">Here together</span>
              </div>
              <p className="home-persona-label">Your next chapter</p>
              <h2>Good people. Real connection.</h2>
              <p className="home-persona-bio">
                A welcoming place to meet, share your story, and find common ground.
              </p>
              <div className="home-persona-tags">
                <span>Dating</span>
                <span>Friendship</span>
                <span>Community</span>
              </div>
            </div>
            <div className="home-note-card home-note-card--top">
              <span>A little reminder</span>
              <strong>Your story belongs here.</strong>
            </div>
            <div className="home-note-card home-note-card--bottom">
              <span>Make room for</span>
              <strong>Good conversation &amp; new connections</strong>
            </div>
          </div>
        </section>

        <section className="home-pillars page-content" aria-labelledby="home-pillars-heading">
          <div className="home-section-heading">
            <p className="home-eyebrow">More than a match</p>
            <h2 id="home-pillars-heading">Bring Your Whole Self.</h2>
          </div>
          <div className="home-pillar-grid">
            <Link className="home-pillar" to="/register">
              <img
                className="home-pillar-image"
                src="https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Black_couple%2C_August_1973.jpg/500px-Black_couple%2C_August_1973.jpg"
                alt="A Black couple together in a 1973 portrait"
                loading="lazy"
              />
              <span className="home-pillar-number">01</span>
              <h3>Meet</h3>
              <p>Discover people through the details that make them uniquely themselves.</p>
              <span className="home-pillar-action">
                Join to Meet <span aria-hidden="true">-&gt;</span>
              </span>
            </Link>
            <Link className="home-pillar" to="/register">
              <img
                className="home-pillar-image"
                src="https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/BLACK_COUPLE_AND_THEIR_DOG_IN_THEIR_APARTMENT_IN_SOUTH_SIDE_CHICAGO._FROM_1960_TO_1970_THE_PERCENTAGE_OF_CHICAGO..._-_NARA_-_556171.jpg/960px-BLACK_COUPLE_AND_THEIR_DOG_IN_THEIR_APARTMENT_IN_SOUTH_SIDE_CHICAGO._FROM_1960_TO_1970_THE_PERCENTAGE_OF_CHICAGO..._-_NARA_-_556171.jpg"
                alt="A Black couple sharing a moment together at home"
                loading="lazy"
              />
              <span className="home-pillar-number">02</span>
              <h3>Share</h3>
              <p>Keep a journal of moments, lessons, and stories worth passing along.</p>
              <span className="home-pillar-action">
                Join to Share <span aria-hidden="true">-&gt;</span>
              </span>
            </Link>
            <Link className="home-pillar" to="/register">
              <img
                className="home-pillar-image"
                src="https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Black_couple%2C_August_1973.jpg/500px-Black_couple%2C_August_1973.jpg"
                alt="A Black couple photographed together in August 1973"
                loading="lazy"
              />
              <span className="home-pillar-number">03</span>
              <h3>Collaborate</h3>
              <p>Turn shared interests into thoughtful conversations and real momentum.</p>
              <span className="home-pillar-action">
                Join the Conversation <span aria-hidden="true">-&gt;</span>
              </span>
            </Link>
          </div>
        </section>
        <section className="home-companion page-content" aria-labelledby="home-companion-heading">
          <div>
            <p className="home-eyebrow">A companion for your story</p>
            <h2 id="home-companion-heading">Know What You Bring.</h2>
          </div>
          <div>
            <p>
              The Relationship Resume helps you reflect on your values, communication
              style, and relationship goals before you connect with someone new.
            </p>
            <a
                className="home-secondary-action"
                href="https://therelationshipresume.netlify.app/"
                target="_blank"
                rel="noreferrer"
            >
              Explore The Relationship Resume <span aria-hidden="true">-&gt;</span>
            </a>
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
            <p className="home-eyebrow">Welcome to the beta</p>
            <h1>Welcome Back, {memberName}.</h1>
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

        <section className="member-home-notice page-content" aria-labelledby="member-home-notice-heading">
          <div className="member-home-notice-mark" aria-hidden="true">!</div>
          <div>
            <p className="home-eyebrow">Early access</p>
            <h2 id="member-home-notice-heading">You Are Helping Us Build What Comes Next.</h2>
            <p>
              The Social Match Game is still under development. Try the features below,
              let us know what feels useful, and share your feedback as you explore.
              Your experience will help shape the next version of the community.
            </p>
          </div>
        </section>

        <section className="member-home-content page-content" aria-labelledby="member-home-heading">
          <div className="home-section-heading">
            <p className="home-eyebrow">Available now</p>
            <h2 id="member-home-heading">Start Exploring the Community.</h2>
          </div>
          <div className="member-hub-grid">
            <Link className="member-hub-card member-hub-card--primary" to="/dashboard">
              <span className="member-hub-number">01 / PROFILES</span>
              <h3>Meet the Community</h3>
              <p>Explore member profiles and find the people, ideas, and energy that fit your world.</p>
              <span className="member-hub-arrow" aria-hidden="true">-&gt;</span>
            </Link>
            <Link className="member-hub-card" to="/notes">
              <span className="member-hub-number">02 / JOURNAL</span>
              <h3>Open Your Journal</h3>
              <p>Write down a moment, hold onto a lesson, or share a story with your community.</p>
              <span className="member-hub-arrow" aria-hidden="true">-&gt;</span>
            </Link>
            <Link className="member-hub-card" to="/feedback">
              <span className="member-hub-number">03 / FEEDBACK</span>
              <h3>Join the Conversation</h3>
              <p>Share ideas, celebrate what works, and help shape the next version together.</p>
              <span className="member-hub-arrow" aria-hidden="true">-&gt;</span>
            </Link>
            <Link className="member-hub-card" to={profilePath}>
              <span className="member-hub-number">04 / PROFILE</span>
              <h3>Shape Your Profile</h3>
              <p>Let people see the details that make you you. Your profile is yours to keep current.</p>
              <span className="member-hub-arrow" aria-hidden="true">-&gt;</span>
            </Link>
          </div>
        </section>

        <section className="member-home-prompt page-content" aria-label="Member prompt">
          <p className="home-eyebrow">A small invitation</p>
          <blockquote>“What would make this space more useful, welcoming, and meaningful for you?”</blockquote>
          <Link className="home-secondary-action" to="/notes">Write a Note</Link>
        </section>
      </main>
  );
};

const Home = () => (hasValidAuthToken() ? <MemberHub /> : <LandingPage />);

export default Home;