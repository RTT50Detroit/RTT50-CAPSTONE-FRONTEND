import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  clearMemberReaction,
  fetchMemberReactions,
  saveMemberReaction,
} from '../../utils/memberReactions.js';
import { getMemberId, getProfileImage, isMemberOnline } from '../../utils/member.js';

const MemberReactionDecks = () => {
  const [decks, setDecks] = useState({ likes: [], dislikes: [] });
  const [selectedDeck, setSelectedDeck] = useState('likes');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyTargetId, setBusyTargetId] = useState(null);

  useEffect(() => {
    let isActive = true;
    fetchMemberReactions()
        .then((data) => {
          if (isActive) setDecks({
            likes: Array.isArray(data.likes) ? data.likes : [],
            dislikes: Array.isArray(data.dislikes) ? data.dislikes : [],
          });
        })
        .catch((requestError) => {
          console.error('Failed to load your reaction decks:', requestError);
          if (isActive) {
            setError(
                requestError.response?.data?.message ||
                'Your Likes and Dislikes could not be loaded.',
            );
          }
        })
        .finally(() => {
          if (isActive) setIsLoading(false);
        });

    return () => {
      isActive = false;
    };
  }, []);

  const updateReaction = async (targetId, reaction) => {
    setBusyTargetId(targetId);
    setError(null);
    try {
      if (reaction) {
        await saveMemberReaction(targetId, reaction);
      } else {
        await clearMemberReaction(targetId);
      }

      setDecks((current) => {
        const profile = [...current.likes, ...current.dislikes]
            .find((entry) => String(getMemberId(entry)) === String(targetId));
        const next = {
          likes: current.likes.filter((entry) => String(getMemberId(entry)) !== String(targetId)),
          dislikes: current.dislikes.filter((entry) => String(getMemberId(entry)) !== String(targetId)),
        };
        if (profile && reaction) {
          next[reaction === 'like' ? 'likes' : 'dislikes'].unshift({ ...profile, reaction });
        }
        return next;
      });
    } catch (requestError) {
      console.error('Failed to update your reaction deck:', requestError);
      setError(
          requestError.response?.data?.message || 'Your deck could not be updated. Please try again.',
      );
    } finally {
      setBusyTargetId(null);
    }
  };

  const profiles = decks[selectedDeck];
  const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');

  return (
    <section className="member-reaction-decks" aria-labelledby="reaction-decks-heading">
      <div className="reaction-decks-heading">
        <div>
          <p className="profile-detail-label">Your Private Decks</p>
          <h2 id="reaction-decks-heading">Likes and Dislikes</h2>
        </div>
        <div className="reaction-deck-tabs" role="tablist" aria-label="Reaction Decks">
          <button
              type="button"
              role="tab"
              id="likes-deck-tab"
              aria-selected={selectedDeck === 'likes'}
              aria-controls="reaction-deck-content"
              className={selectedDeck === 'likes' ? 'is-active' : ''}
              onClick={() => setSelectedDeck('likes')}
          >
            Likes <span>{decks.likes.length}</span>
          </button>
          <button
              type="button"
              role="tab"
              id="dislikes-deck-tab"
              aria-selected={selectedDeck === 'dislikes'}
              aria-controls="reaction-deck-content"
              className={selectedDeck === 'dislikes' ? 'is-active' : ''}
              onClick={() => setSelectedDeck('dislikes')}
          >
            Dislikes <span>{decks.dislikes.length}</span>
          </button>
        </div>
      </div>
      {error && <p className="reaction-deck-error" role="alert">{error}</p>}
      {isLoading ? (
        <p className="reaction-deck-empty">Loading your decks...</p>
      ) : (
        <div
            className="reaction-deck-content"
            id="reaction-deck-content"
            role="tabpanel"
            aria-labelledby={`${selectedDeck}-deck-tab`}
            tabIndex={0}
        >
          {profiles.length === 0 ? (
            <p className="reaction-deck-empty">
              {selectedDeck === 'likes'
                ? 'Profiles you like will appear here.'
                : 'Profiles you pass on will appear here.'}
            </p>
          ) : (
            <div className="reaction-deck-list">
              {profiles.map((profile) => {
                const profileId = getMemberId(profile);
                const name = profile.name || 'Unnamed Member';
                const image = getProfileImage(profile);
                const imageUrl = image?.startsWith('/') ? `${apiUrl}${image}` : image;
                const initials = name.split(/\s+/).filter(Boolean)
                    .map((part) => part[0]).slice(0, 2).join('').toUpperCase() || '?';

                return (
                  <article className="reaction-deck-card" key={profileId}>
                    <Link
                        className="reaction-deck-profile"
                        to={`/dashboard/profile?id=${profileId}`}
                    >
                      <span className="reaction-deck-photo">
                        {imageUrl ? (
                          <>
                            <img
                                src={imageUrl}
                                alt=""
                                onError={(event) => {
                                  event.currentTarget.hidden = true;
                                  event.currentTarget.nextElementSibling.hidden = false;
                                }}
                            />
                            <span hidden aria-hidden="true">{initials}</span>
                          </>
                        ) : (
                          <span aria-hidden="true">{initials}</span>
                        )}
                      </span>
                      <span className="reaction-deck-member">
                        <strong>{name}</strong>
                        <span>
                          {profile.age ? `${profile.age} Years` : 'Age Private'}
                          {profile.gender ? ` · ${profile.gender}` : ''}
                        </span>
                      </span>
                    </Link>
                    <span className={`reaction-deck-status${isMemberOnline(profile) ? ' is-online' : ''}`}>
                      {isMemberOnline(profile) ? 'Online' : 'Offline'}
                    </span>
                    <div className="reaction-deck-actions">
                      <button
                          type="button"
                          disabled={busyTargetId === String(profileId)}
                          onClick={() => updateReaction(
                              String(profileId),
                              selectedDeck === 'likes' ? 'dislike' : 'like',
                          )}
                      >
                        Move to {selectedDeck === 'likes' ? 'Dislikes' : 'Likes'}
                      </button>
                      <button
                          type="button"
                          className="reaction-deck-remove"
                          disabled={busyTargetId === String(profileId)}
                          onClick={() => updateReaction(String(profileId), null)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default MemberReactionDecks;
