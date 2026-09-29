import { useState } from 'react';
import PropTypes from 'prop-types';

const NotePosting = ({ onAddNote }) => {
  const [title, setTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onAddNote({ title: title.trim(), content: noteContent.trim() });
      setTitle('');
      setNoteContent('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
      <form className="journal-editor" onSubmit={handleSubmit}>
        <label htmlFor="note-title">Entry title</label>
        <input
            id="note-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A title for today"
        />
        <label htmlFor="note-content">What is on your mind?</label>
        <textarea
            id="note-content"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Write a new note..."
            rows="6"
        />
        <button type="submit" disabled={!noteContent.trim() || isSaving}>
          {isSaving ? 'Saving...' : 'Add Note'}
        </button>
      </form>
  );
};

export default NotePosting;

NotePosting.propTypes = {
  onAddNote: PropTypes.func.isRequired,
};