import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, getTokenPayload } from '../utils/auth.js';
import './css/Feedback.css';

const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');

const authConfig = () => ({
  headers: { Authorization: `Bearer ${getAuthToken()}` },
});

const formatDate = (date) => {
  if (!date) return 'Just now';

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? 'Just now'
    : parsedDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
};

const getAuthorName = (feedback) => (
  feedback.authorName
  || feedback.author?.name
  || feedback.memberName
  || feedback.user?.name
  || 'Early Access member'
);

const getPostId = (post) => post._id || post.id;

const getReplies = (post) => (
  Array.isArray(post.replies) ? post.replies : []
);

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Product idea');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replySubmitting, setReplySubmitting] = useState({});
  const [replyErrors, setReplyErrors] = useState({});
  const navigate = useNavigate();
  const memberName = getTokenPayload()?.loginName || getTokenPayload()?.username || 'Early Access member';

  const handleRequestError = useCallback((requestError, message) => {
    if (requestError.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      navigate('/login', { replace: true });
      return;
    }

    setError(message);
  }, [navigate]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/members/feedback`, authConfig());
        const submissions = Array.isArray(data) ? data : data?.feedback || data?.submissions || [];
        setFeedback(submissions);
      } catch (requestError) {
        console.error('Error while fetching feedback:', requestError);
        handleRequestError(requestError, 'Feedback could not be loaded. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [handleRequestError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const submission = { title: trimmedTitle, category, content: trimmedContent };
      const { data } = await axios.post(
          `${apiUrl}/api/members/feedback`,
          submission,
          authConfig()
      );
      const savedFeedback = data.feedback || data.submission || data;
      setFeedback((currentFeedback) => [{ ...submission, ...savedFeedback }, ...currentFeedback]);
      setTitle('');
      setCategory('Product idea');
      setContent('');
      setSuccess('Thanks for helping shape the next version.');
    } catch (requestError) {
      console.error('Error while submitting feedback:', requestError);
      handleRequestError(requestError, 'Your feedback could not be submitted. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyChange = (postId, value) => {
    setReplyDrafts((currentDrafts) => ({ ...currentDrafts, [postId]: value }));
  };

  const handleReplySubmit = async (event, post) => {
    event.preventDefault();
    const postId = getPostId(post);
    const trimmedContent = (replyDrafts[postId] || '').trim();

    if (!postId || !trimmedContent) return;

    setReplySubmitting((currentState) => ({ ...currentState, [postId]: true }));
    setReplyErrors((currentErrors) => ({ ...currentErrors, [postId]: '' }));

    try {
      const { data } = await axios.post(
          `${apiUrl}/api/members/feedback/${postId}/replies`,
          { content: trimmedContent },
          authConfig()
      );
      const savedReply = data.reply || data;
      setFeedback((currentFeedback) => currentFeedback.map((currentPost) => (
        getPostId(currentPost) === postId
          ? { ...currentPost, replies: [...getReplies(currentPost), savedReply] }
          : currentPost
      )));
      setReplyDrafts((currentDrafts) => ({ ...currentDrafts, [postId]: '' }));
    } catch (requestError) {
      console.error('Error while submitting reply:', requestError);
      if (requestError.response?.status === 401) {
        handleRequestError(requestError, 'Your reply could not be submitted. Please sign in again.');
      } else {
        setReplyErrors((currentErrors) => ({
          ...currentErrors,
          [postId]: 'Your reply could not be submitted. Please try again.',
        }));
      }
    } finally {
      setReplySubmitting((currentState) => ({ ...currentState, [postId]: false }));
    }
  };

  return (
      <main className="page-content feedback-page">
        <section className="feedback-heading">
          <p className="feedback-eyebrow">Early Access forum</p>
          <h1>Feedback board</h1>
          <p>
            Share what is working, what could be better, and the ideas you would
            love to see next. Your fellow members can learn from every post.
          </p>
        </section>

        <section className="feedback-layout">
          <form className="feedback-composer" onSubmit={handleSubmit}>
            <div className="feedback-composer-heading">
              <div>
                <p className="feedback-eyebrow">Start a conversation</p>
                <h2>What is on your mind, {memberName}?</h2>
              </div>
              <span className="feedback-composer-mark" aria-hidden="true">+</span>
            </div>
            <label htmlFor="feedback-title">Subject</label>
            <input
                id="feedback-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="A short summary of your feedback"
                maxLength="120"
                required
            />
            <label htmlFor="feedback-category">Topic</label>
            <select
                id="feedback-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
            >
              <option>Product idea</option>
              <option>Something is not working</option>
              <option>Love this</option>
              <option>Community experience</option>
            </select>
            <label htmlFor="feedback-content">Details</label>
            <textarea
                id="feedback-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Tell the community what you noticed..."
                rows="6"
                maxLength="2000"
                required
            />
            <div className="feedback-composer-footer">
              <span>{content.length}/2000</span>
              <button type="submit" disabled={isSubmitting || !title.trim() || !content.trim()}>
                {isSubmitting ? 'Posting...' : 'Post feedback'}
              </button>
            </div>
            {success && <p className="feedback-success" role="status">{success}</p>}
          </form>

          <section className="feedback-board" aria-labelledby="feedback-board-heading">
            <div className="feedback-board-heading">
              <div>
                <p className="feedback-eyebrow">The conversation</p>
                <h2 id="feedback-board-heading">Community posts</h2>
              </div>
              <span>{feedback.length} {feedback.length === 1 ? 'post' : 'posts'}</span>
            </div>
            {error && <p className="feedback-status feedback-error" role="alert">{error}</p>}
            {isLoading && <p className="feedback-status">Checking the board...</p>}
            {!isLoading && !error && feedback.length === 0 && (
              <p className="feedback-status">No posts yet. Start the first conversation.</p>
            )}
            {!isLoading && feedback.length > 0 && (
              <ul className="feedback-posts">
                {feedback.map((post, index) => {
                  const postId = getPostId(post);

                  return (
                    <li className="feedback-post" key={postId || `${post.title}-${index}`}>
                    <div className="feedback-post-meta">
                      <span className="feedback-post-category">{post.category || 'Feedback'}</span>
                      <time dateTime={post.createdAt || post.created_at}>
                        {formatDate(post.createdAt || post.created_at)}
                      </time>
                    </div>
                    <h3>{post.title || 'Untitled feedback'}</h3>
                    <p>{post.content}</p>
                    <div className="feedback-post-author">
                      <span className="feedback-avatar" aria-hidden="true">
                        {getAuthorName(post).charAt(0).toUpperCase()}
                      </span>
                      <span>Posted by <strong>{getAuthorName(post)}</strong></span>
                    </div>
                    <div className="feedback-replies">
                      <div className="feedback-replies-heading">
                        <span>Replies</span>
                        <span>{getReplies(post).length}</span>
                      </div>
                      {getReplies(post).length > 0 && (
                        <ul className="feedback-reply-list">
                          {getReplies(post).map((reply, replyIndex) => (
                            <li
                                className="feedback-reply"
                                key={reply._id || reply.id || `${reply.content}-${replyIndex}`}
                            >
                              <div className="feedback-reply-meta">
                                <strong>{getAuthorName(reply)}</strong>
                                <time dateTime={reply.createdAt || reply.created_at}>
                                  {formatDate(reply.createdAt || reply.created_at)}
                                </time>
                              </div>
                              <p>{reply.content}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                      {postId && (
                        <form className="feedback-reply-form" onSubmit={(event) => handleReplySubmit(event, post)}>
                          <label htmlFor={`reply-${postId}`}>Add a reply</label>
                          <div className="feedback-reply-input">
                            <textarea
                                id={`reply-${postId}`}
                                value={replyDrafts[postId] || ''}
                                onChange={(event) => handleReplyChange(postId, event.target.value)}
                                placeholder="Add your perspective..."
                                rows="2"
                                maxLength="1000"
                            />
                            <button
                                type="submit"
                                disabled={replySubmitting[postId] || !(replyDrafts[postId] || '').trim()}
                            >
                              {replySubmitting[postId] ? 'Replying...' : 'Reply'}
                            </button>
                          </div>
                          {replyErrors[postId] && (
                            <p className="feedback-reply-error" role="alert">{replyErrors[postId]}</p>
                          )}
                        </form>
                      )}
                    </div>
                  </li>
                  );
                })}
              </ul>
            )}
          </section>
        </section>
      </main>
  );
};

export default Feedback;
