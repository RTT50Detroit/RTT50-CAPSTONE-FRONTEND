import { useState } from 'react';
import PropTypes from 'prop-types';

const NoteList = ({ notes, onEditNote, onDeleteNote }) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editType, setEditType] = useState('journal');
  const [busyId, setBusyId] = useState(null);

  const startEditing = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title || '');
    setEditContent(note.content || '');
    setEditType(note.type === 'note' ? 'note' : 'journal');
  };

  const stopEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
    setEditType('journal');
  };

  const handleUpdate = async () => {
    if (editContent.trim()) {
      setBusyId(editingId);
      try {
        await onEditNote(editingId, {
          title: editTitle.trim(),
          content: editContent.trim(),
          type: editType,
        });
      } finally {
        setBusyId(null);
      }
      stopEditing();
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    try {
      await onDeleteNote(id);
    } finally {
      setBusyId(null);
    }
  };

  const renderNotes = (notesToRender) => (
    <ul className="note-cards">
      {notesToRender.map((note) => (
          <li className={`note-card note-card--${note.type === 'note' ? 'note' : 'journal'}`} key={note._id}>
            {editingId === note._id ? (
                <div className="note-edit-form">
                  <div className="post-type-picker" role="group" aria-label="Post type">
                    <button
                        type="button"
                        className={editType === 'note' ? 'active' : ''}
                        onClick={() => setEditType('note')}
                    >
                      Post Note
                    </button>
                    <button
                        type="button"
                        className={editType === 'journal' ? 'active' : ''}
                        onClick={() => setEditType('journal')}
                    >
                      Post Journal
                    </button>
                  </div>
                  <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Entry title"
                  />
                  <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className="note-actions">
                    <button type="button" onClick={handleUpdate} disabled={busyId === note._id}>
                      {busyId === note._id ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className="button-secondary" onClick={stopEditing}>
                      Cancel
                    </button>
                  </div>
                </div>
            ) : (
                 <article>
                   <p className="note-date">
                     {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Journal Entry'}
                   </p>
                   <span className="note-type-label">
                     {note.type === 'note' ? 'Note' : 'Journal'}
                   </span>
                   <h3>{note.title || 'Untitled Entry'}</h3>
                   <p className="note-content">{note.content}</p>
                   <div className="note-actions">
                     <button type="button" onClick={() => startEditing(note)}>Edit</button>
                     <button
                         type="button"
                         className="button-danger"
                         onClick={() => handleDelete(note._id)}
                         disabled={busyId === note._id}
                     >
                       {busyId === note._id ? 'Deleting...' : 'Delete'}
                     </button>
                   </div>
                 </article>
             )}
          </li>
      ))}
    </ul>
  );

  const journalNotes = notes.filter((note) => note.type !== 'note');
  const postedNotes = notes.filter((note) => note.type === 'note');

  return (
      <div className="notes-list">
        {notes.length > 0 ? (
            <div className="note-card-groups">
              {postedNotes.length > 0 && (
                <section className="note-card-group" aria-labelledby="posted-notes-heading">
                  <div className="note-card-group-heading">
                    <div>
                      <p className="notes-section-kicker">Short-form Posts</p>
                      <h3 id="posted-notes-heading">Notes</h3>
                    </div>
                    <span>{postedNotes.length}</span>
                  </div>
                  {renderNotes(postedNotes)}
                </section>
              )}
              {journalNotes.length > 0 && (
                <section className="note-card-group" aria-labelledby="journal-entries-heading">
                  <div className="note-card-group-heading">
                    <div>
                      <p className="notes-section-kicker">Long-form Reflections</p>
                      <h3 id="journal-entries-heading">Journal</h3>
                    </div>
                    <span>{journalNotes.length}</span>
                  </div>
                  {renderNotes(journalNotes)}
                </section>
              )}
            </div>
        ) : (
             <p className="empty-notes">Your journal is waiting for its first entry.</p>
         )}
      </div>
  );
};

export default NoteList;

NoteList.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    type: PropTypes.oneOf(['note', 'journal']),
  })).isRequired,
  onEditNote: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
};