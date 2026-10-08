import { useState } from 'react';
import PropTypes from 'prop-types';

const NotePosting = ({ onAddNote }) => {
  const [title, setTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [postType, setPostType] = useState('journal');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onAddNote({
        title: title.trim(),
        content: noteContent.trim(),
        type: postType,
      });
      setTitle('');
      setNoteContent('');
      setPostType('journal');
    } finally {
      setIsSaving(false);
    }
  };

  return (
      <form className="journal-editor" onSubmit={handleSubmit}>
        <div className="post-type-picker" role="group" aria-label="Post Type">
          <button
              type="button"
              className={postType === 'note' ? 'active' : ''}
              onClick={() => setPostType('note')}
          >
            Post Note
          </button>
          <button
              type="button"
              className={postType === 'journal' ? 'active' : ''}
              onClick={() => setPostType('journal')}
          >
            Post Journal
          </button>
        </div>
        <label htmlFor="note-title">Entry Title</label>
        <input
            id="note-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A title for today"
        />
        <label htmlFor="note-content">What Is on Your Mind?</label>
        <textarea
            id="note-content"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Write a new note..."
            rows="6"
        />
        <button type="submit" disabled={!noteContent.trim() || isSaving}>
          {isSaving ? 'Saving...' : postType === 'journal' ? 'Post Journal' : 'Post Note'}
        </button>
      </form>
  );
};

export default NotePosting;

NotePosting.propTypes = {
  onAddNote: PropTypes.func.isRequired,
};