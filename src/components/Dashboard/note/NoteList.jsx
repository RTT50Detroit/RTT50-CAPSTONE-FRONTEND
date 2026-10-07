import { useState } from 'react';
import PropTypes from 'prop-types';

const NoteList = ({ notes, onEditNote, onDeleteNote }) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [busyId, setBusyId] = useState(null);

  const startEditing = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title || '');
    setEditContent(note.content || '');
  };

  const stopEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleUpdate = async () => {
    if (editContent.trim()) {
      setBusyId(editingId);
      try {
        await onEditNote(editingId, {
          title: editTitle.trim(),
          content: editContent.trim(),
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

  return (
      <div className="notes-list">
        {notes.length > 0 ? (
            <ul className="note-cards">
              {notes.map((note) => (
                  <li className="note-card" key={note._id}>
                    {editingId === note._id ? (
                        <div className="note-edit-form">
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
                              {busyId === note._id ? 'Saving...' : 'Save changes'}
                            </button>
                            <button type="button" className="button-secondary" onClick={stopEditing}>
                              Cancel
                            </button>
                          </div>
                        </div>
                    ) : (
                         <article>
                           <p className="note-date">
                             {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Journal entry'}
                           </p>
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
  })).isRequired,
  onEditNote: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
};