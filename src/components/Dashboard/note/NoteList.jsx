import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const NoteList = ({
  notes,
  onEditNote,
  selectedNoteIds,
  editRequestIds,
  selectionMode,
  onSelectionChange,
}) => {
  const [editingIds, setEditingIds] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [busyIds, setBusyIds] = useState([]);

  const notesRef = useRef(notes);
  notesRef.current = notes;

  useEffect(() => {
    setEditingIds(editRequestIds);
    setDrafts((currentDrafts) => notesRef.current.reduce((nextDrafts, note) => {
      const id = note._id;
      if (editRequestIds.includes(id)) {
        nextDrafts[id] = currentDrafts[id] || {
          title: note.title || '',
          content: note.content || '',
          type: note.type === 'note' ? 'note' : 'journal',
        };
      }
      return nextDrafts;
    }, {}));
  }, [editRequestIds]);

  const updateDraft = (id, field, value) => {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [id]: { ...currentDrafts[id], [field]: value },
    }));
  };

  const stopEditing = (id) => {
    setEditingIds((currentIds) => currentIds.filter((currentId) => currentId !== id));
  };

  const handleUpdate = async (id) => {
    const draft = drafts[id];
    if (!draft?.content.trim()) return;

    setBusyIds((currentIds) => [...currentIds, id]);
    try {
      await onEditNote(id, {
        title: draft.title.trim(),
        content: draft.content.trim(),
        type: draft.type,
      });
      stopEditing(id);
    } finally {
      setBusyIds((currentIds) => currentIds.filter((currentId) => currentId !== id));
    }
  };

  const renderNotes = (notesToRender) => (
    <ul className="note-cards">
      {notesToRender.map((note) => (
          <li className={`note-card note-card--${note.type === 'note' ? 'note' : 'journal'}`} key={note._id}>
            {selectionMode && !editingIds.includes(note._id) && (
              <label className="note-selection">
                <input
                    type="checkbox"
                    checked={selectedNoteIds.includes(note._id)}
                    onChange={(event) => onSelectionChange(note._id, event.target.checked)}
                />
                <span>Select entry</span>
              </label>
            )}
            {editingIds.includes(note._id) ? (
                <div className="note-edit-form">
                  <p className="note-editing-label">Editing Selected Entry</p>
                  <div className="post-type-picker" role="group" aria-label="Post Type">
                    <button
                        type="button"
                        className={drafts[note._id]?.type === 'note' ? 'active' : ''}
                        onClick={() => updateDraft(note._id, 'type', 'note')}
                    >
                      Post Note
                    </button>
                    <button
                        type="button"
                        className={drafts[note._id]?.type === 'journal' ? 'active' : ''}
                        onClick={() => updateDraft(note._id, 'type', 'journal')}
                    >
                      Post Journal
                    </button>
                  </div>
                  <input
                      value={drafts[note._id]?.title || ''}
                      onChange={(e) => updateDraft(note._id, 'title', e.target.value)}
                      placeholder="Entry title"
                  />
                  <textarea
                      value={drafts[note._id]?.content || ''}
                      onChange={(e) => updateDraft(note._id, 'content', e.target.value)}
                  />
                  <div className="note-actions">
                    <button type="button" onClick={() => handleUpdate(note._id)} disabled={busyIds.includes(note._id)}>
                      {busyIds.includes(note._id) ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className="button-secondary" onClick={() => stopEditing(note._id)}>
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
                      <p className="notes-section-kicker">Short-Form Posts</p>
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
                      <p className="notes-section-kicker">Long-Form Reflections</p>
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
  selectedNoteIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  editRequestIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectionMode: PropTypes.bool.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};