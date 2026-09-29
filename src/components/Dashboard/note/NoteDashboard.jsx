import { useEffect, useState } from 'react';
import axios from 'axios';
import NoteList from './NoteList';
import NotePosting from './NotePosting';
import './Notes.css';

const apiUrl = import.meta.env.VITE_APP_BASE_URL;

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
});

const NotesDashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/api/members/notes`, authConfig());
      setNotes(Array.isArray(data) ? data : data.notes || []);
    } catch (requestError) {
      console.error('Error while fetching notes:', requestError);
      setError('Your notes could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (note) => {
    const { data } = await axios.post(
        `${apiUrl}/api/members/notes`,
        note,
        authConfig()
    );
    const savedNote = data.note || data;
    setNotes((prevNotes) => [...prevNotes, {
      ...note,
      ...savedNote,
    }]);
  };

  const updateNote = async (id, updates) => {
    const { data } = await axios.put(
        `${apiUrl}/api/members/notes/${id}`,
        updates,
        authConfig()
    );
    const updatedNote = data.note || data;
    setNotes((prevNotes) => prevNotes.map((note) => (
      note._id === id ? { ...note, ...updatedNote, ...updates } : note
    )));
  };

  const deleteNote = async (id) => {
    await axios.delete(`${apiUrl}/api/members/notes/${id}`, authConfig());
    setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
      <main className="page-content notes-page">
        <section className="notes-heading">
          <p className="notes-eyebrow">Private journal</p>
          <h1>Notes</h1>
          <p>Capture the thoughts, plans, and little moments worth keeping.</p>
        </section>

        <NotePosting onAddNote={addNote} />

        <section className="notes-list-section" aria-labelledby="saved-notes-heading">
          <div className="notes-list-heading">
            <h2 id="saved-notes-heading">Saved entries</h2>
            <span>{notes.length} {notes.length === 1 ? 'entry' : 'entries'}</span>
          </div>
          {loading && <p className="notes-status">Opening your journal...</p>}
          {error && <p className="notes-status notes-error">{error}</p>}
          {!loading && !error && (
            <NoteList
                notes={notes}
                onEditNote={updateNote}
                onDeleteNote={deleteNote}
            />
          )}
        </section>
      </main>
  );
};

export default NotesDashboard;